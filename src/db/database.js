const BetterSqlite3Client = require("./client/better-sqlite3");
const MssqlClient = require("./client/mssql");
const PgClient = require("./client/pg");

const SQLiteSQLMigration = require("./migration/sqlitesql.js");
const TSQLMigration = require("./migration/tsql.js");
const PLpgSQLMigration = require("./migration/plpgsql.js");

const Clients = {
    "better-sqlite3": BetterSqlite3Client,
    mssql: MssqlClient,
    pg: PgClient,
};

const Dialects = {
    "better-sqlite3": "sqlitesql",
    mssql: "tsql",
    pg: "plpgsql",
};

const Migrations = {
    sqlitesql: SQLiteSQLMigration,
    tsql: TSQLMigration,
    plpgsql: PLpgSQLMigration,
};

/**
 * @typedef Driver
 * @property {"sqlitesql"} better-sqlite3
 * @property {"plpgsql"} pg
 * @property {"tsql"} mssql
 */

/**
 * @typedef Connection
 * @property {String} user
 * @property {String} password
 * @property {String} server
 * @property {String} database
 */

/**
 * @template {keyof Driver} D
 * @typedef Config
 * @property {D} client
 * @property {Connection} connection
 * @property {Boolean} debug
 */

/**@template {keyof Driver} D*/

class Database {
    /**@type {import("./client.js")} */
    client = null;

    /**@param {Config<D>} config */
    constructor(config = {}) {
        const { client, connection, migrations, debug } = config;
        const dialect = Dialects[client];
        this.client = new Clients[client](connection, dialect, !!debug);
        Object.defineProperty(this,'_migration',{
            value: new Migrations[dialect](this.client, migrations),
            configurable:true,
            enumerable:false,
            writable:true
        })
    }

    escapeLike(any) {
        return this.client.escapeLike(any);
    }

    escapeGlob(any) {
        return this.client.escapeGlob(any);
    }

    escapeIdentifier(any) {
        return this.client.escapeIdentifier(any);
    }

    escapeLiteral(any) {
        return this.client.escapeLiteral(any);
    }

    raw() {
        return this.client.raw(...arguments);
    }

    query() {
        return this.client.query();
    }

    /**@returns {import("./schema.js")<Driver[D]>}*/
    schema() {
        return this.client.schema();
    }

    async migrate() {
        return this._migration.migrate();
    }

    async rollback() {
        return this._migration.rollback();
    }

    async connect() {
        return this.client.connect();
    }

    async close() {
        return this.client.close();
    }

    async execute(query, params) {
        return this.client.execute(query, params);
    }

    /**@type {import("./client.js")['transaction']}*/
    async transaction(callback) {
        return this.client.transaction(callback);
    }
}

module.exports = Database;
