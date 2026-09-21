const Client = require("../client.js");
const PLpgSQLQuery = require("../query/plpgsql.js");
const PLpgSQLSchema = require("../schema/plpgsql.js");
const { requireDriver } = require("../util.js");

class PgClient extends Client {
    /**@type {Pool}*/
    pool = null;

    constructor(config, dialect, debug) {
        super(
            {
                user: undefined,
                password: undefined,
                host: "localhost",
                database: undefined,
                port: 5432,
                ...config,
            },
            dialect,
            debug,
        );
    }

    defaultParams() {
        return [];
    }

    defaultPlaceholder(name) {
        return 1;
    }

    formatPlaceholder(name) {
        return `$${name}`;
    }

    query() {
        return new PLpgSQLQuery(this);
    }

    schema() {
        return new PLpgSQLSchema(this);
    }

    async connect() {
        if (!this.pool) {
            const pg = requireDriver("pg");
            const pool = new pg.Pool(this.config);
            this.pool = pool;
        }
        return this.pool;
    }

    async close() {
        try {
            await this.pool?.end();
        } finally {
            this.pool = null;
        }
    }

    async begin() {
        await this.pool.query("BEGIN");
    }

    async commit() {
        await this.pool.query("COMMIT");
    }

    async rollback() {
        await this.pool.query("ROLLBACK");
    }

    isReader(command, rows) {
        const readerCommands = ["SELECT", "SHOW", "EXPLAIN", "FETCH", "COPY"];
        return readerCommands.includes(command) || rows?.length > 0;
    }

    async execute(query, params = []) {
        const pool = await this.connect();
        const { command, rowCount, rows } = await pool.query(query, params);
        if (this.isReader(command, rows)) {
            return rows || [];
        }
        return { changes: rowCount || 0 };
    }

    /**@type {Client['transaction']}*/
    async transaction(callback) {
        if (this.nested) {
            return await callback(this);
        }
        const pool = await this.connect();
        /**@type {import("pg").PoolClient}*/
        const client = await pool.connect();
        /**@type {PgClient}*/
        const current = Object.create(this);
        current.pool = client;
        current.nested = true;
        try {
            await current.begin();
            const result = await callback(current);
            await current.commit();
            return result;
        } catch (error) {
            await current.rollback();
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = PgClient;
