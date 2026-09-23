export = Database;
export type Driver = {
    "better-sqlite3": "sqlitesql";
    pg: "plpgsql";
    mssql: "tsql";
};
export type Connection = {
    user: string;
    password: string;
    server: string;
    database: string;
};
export type Config<D extends keyof Driver> = {
    client: D;
    connection: Connection;
    debug: boolean;
};
export type Client = import("./client.js");
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
/**@typedef {import("./client.js")} Client*/
/**@template {keyof Driver} D*/
declare class Database<D extends keyof Driver> {
    /**@type {Client} */
    client: Client;
    /**@param {Config<D>} config */
    constructor(config?: Config<D>);
    escapeLike(any: any): string;
    escapeGlob(any: any): string;
    escapeIdentifier(any: any): string;
    escapeLiteral(any: any): string;
    raw(): import("./raw");
    /**@returns {import("./schema.js")<Driver[D]>}*/
    schema(): import("./schema.js")<Driver[D]>;
    migrate(): Promise<any>;
    rollback(): Promise<any>;
    connect(): Promise<void>;
    close(): Promise<void>;
    execute(query: any, params: any): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map