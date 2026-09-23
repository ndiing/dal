const Client = require("../client.js");
const SQLiteSQLQuery = require("../query/sqlitesql.js");
const SQLiteSQLSchema = require("../schema/sqlitesql.js");
const { requireDriver } = require("../util.js");

class BetterSqlite3Client extends Client {
    /**@type {import("better-sqlite3").Database}*/
    pool = null;

    constructor(config, dialect, debug) {
        super(
            {
                database: ":memory:",
                options: {
                    journal_mode: "WAL",
                    synchronous: "NORMAL",
                    mmap_size: 268435456,
                    page_size: 4096,
                    foreign_keys: "ON",
                    recursive_triggers: "ON",
                    defer_foreign_keys: "ON",
                    temp_store: "MEMORY",
                    locking_mode: "NORMAL",
                    cache_size: -262144,
                    busy_timeout: 5000,
                    wal_autocheckpoint: 100,
                    journal_size_limit: 1073741824,
                    case_sensitive_like: "OFF",
                    auto_vacuum: "INCREMENTAL",
                    optimize: null,
                },
                ...config,
            },
            dialect,
            debug,
        );
        this.counter = 0;
    }

    query() {
        return new SQLiteSQLQuery(this);
    }

    schema() {
        return new SQLiteSQLSchema(this);
    }

    async connect() {
        if (!this.pool) {
            const Database = requireDriver("better-sqlite3");
            this.pool = new Database(this.config.database, {});
            for (const name in this.config.options) {
                const value = this.config.options[name];
                if (value === undefined || value === null || value == "") {
                    this.pool.pragma(name);
                } else {
                    this.pool.pragma([name, value].join("="));
                }
            }
        }
        return this.pool;
    }

    async close() {
        try {
            this.pool.close();
        } finally {
            this.pool = null;
            this.counter = 0;
        }
    }

    isReader(stmt) {
        return stmt.reader;
    }

    async execute(query, params = {}) {
        const pool = await this.connect();
        const stmt = pool.prepare(query);
        if (this.isReader(stmt)) {
            return stmt.all(params);
        }
        return stmt.run(params);
    }

    async begin() {
        this.counter++;
        if (this.counter === 1) {
            this.pool.exec("BEGIN TRANSACTION");
        } else {
            this.pool.exec(`SAVEPOINT SP_${this.counter};`);
        }
    }

    async commit() {
        if (this.counter === 0) {
            throw new Error("No active transaction");
        }
        if (this.counter === 1) {
            this.pool.exec("COMMIT");
        } else {
            this.pool.exec(`RELEASE SAVEPOINT SP_${this.counter};`);
        }
        this.counter--;
    }

    async rollback() {
        if (this.counter === 0) {
            throw new Error("No active transaction");
        }
        if (this.counter === 1) {
            this.pool.exec("ROLLBACK");
        } else {
            this.pool.exec(`ROLLBACK TO SAVEPOINT SP_${this.counter};`);
            this.pool.exec(`RELEASE SAVEPOINT SP_${this.counter};`);
        }
        this.counter--;
    }

    async transaction(callback) {
        await this.connect();
        try {
            await this.begin();
            const result = await callback(this);
            await this.commit();
            return result;
        } catch (error) {
            await this.rollback();
            throw error;
        }
    }
}

module.exports = BetterSqlite3Client;
