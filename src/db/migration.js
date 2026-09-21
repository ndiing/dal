const fs = require("fs");
const path = require("path");

/**
 * @typedef Context
 * @property {() => import('./query.js')} query
 * @property {() => import('./schema.js')<'PLpgSQL'|'SQLiteSQL'|'TSQL'>} schema
 * @property {() => import('./raw.js')} raw
 */

class Migration {
    /**@type {import('./database.js')<'pg'|'better-sqlite3'|'mssql'>}*/
    client = null;

    /**
     * @param {import('./database.js')<'pg'|'better-sqlite3'|'mssql'>} client
     * @param {Object} config
     */
    constructor(client, config = {}) {
        this.client = client;
        this.config = {
            cwd: process.cwd(),
            directory: "migrations",
            tableName: "migrations",
            ...config,
        };

        this.directory = path.join(this.config.cwd, this.config.directory, this.client.dialect);
        this.tableName = this.config.tableName;
    }

    async _hasTable() {
        return await this.client.query().select().from("information_schema.tables").where("table_name", this.tableName).exists();
    }

    async _createTable() {
        return await this.client.schema().createTable(this.tableName, (table) => {
            table.column("id").serial().primaryKey();
            table.column("batch").integer().notNull();
            table.column("name").varChar(256).notNull().unique();
            table.column("applied_at").timestamptz().notNull().default(this.client.raw("CURRENT_TIMESTAMP"));
        });
    }

    async _ensureTable() {
        const exists = await this._hasTable();
        if (exists) {
            return;
        }

        return await this._createTable();
    }

    async _getApplied() {
        return await this.client.query().select().from(this.tableName).orderBy("id", "ASC");
    }

    _getPending() {
        if (!fs.existsSync(this.directory)) {
            return [];
        }

        return fs
            .readdirSync(this.directory)
            .filter((name) => name.endsWith(".js"))
            .sort((a, b) => a.localeCompare(b));
    }

    _createContext() {
        const statements = [];

        const create = (factory) => {
            return (...args) => {
                const instance = factory(...args);
                instance.then = () => {};
                statements.push(instance);
                return instance;
            };
        };

        const context = {
            query: create(() => this.client.query()),
            schema: create(() => this.client.schema()),
            raw: create((...args) => this.client.raw(...args)),
        };

        return { context, statements };
    }

    async _markApplied(client, { name, batch } = {}) {
        return await client.query().insert(this.tableName, { name, batch }).returning();
    }

    async migrate() {
        const pending = this._getPending();
        if (!pending.length) {
            return [];
        }

        await this._ensureTable();

        const applied = await this._getApplied();
        const appliedMap = new Map(applied.map((a) => [a.name, a]));
        const lastBatch = await this._getLastBatch();
        const batch = lastBatch + 1;

        return await this.client.transaction(async (client) => {
            const results = [];
            for (const name of pending) {
                if (appliedMap.has(name)) {
                    continue;
                }

                const file = path.join(this.directory, name);
                const { up } = require(file);

                const { context, statements } = this._createContext();

                up(context);
                const queries = statements.flatMap((stmt) => stmt.build());

                for (const { query } of queries) {
                    await client.execute(query);
                }

                const result = await this._markApplied(client, { name, batch });
                results.push(result);
            }
            return results.flat();
        });
    }

    async _getLastBatch() {
        return (await this.client.query().select().from(this.tableName).orderBy("id", "DESC").limit(1).first("batch")) ?? 0;
    }

    async _getAppliedBatch(batch) {
        return await this.client.query().select().from(this.tableName).where("batch", batch).orderBy("id", "DESC");
    }

    async _unmarkApplied(client, id) {
        return await client.query().delete(this.tableName).where("id", id).returning();
    }

    async rollback() {
        await this._ensureTable();

        const lastBatch = await this._getLastBatch();
        if (lastBatch === 0) {
            return [];
        }

        const applied = await this._getAppliedBatch(lastBatch);

        return await this.client.transaction(async (client) => {
            const results = [];
            for (const { id, name } of applied) {
                const file = path.join(this.directory, name);
                const { down } = require(file);

                const { context, statements } = this._createContext();

                down(context);
                const queries = statements.flatMap((stmt) => stmt.build());

                for (const { query } of queries) {
                    await client.execute(query);
                }

                const result = await this._unmarkApplied(client, id);
                results.push(result);
            }
            return results.flat();
        });
    }
}

module.exports = Migration;
