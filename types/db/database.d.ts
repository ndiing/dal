export = Database;
declare const Dialects: {
    "better-sqlite3": string;
    mssql: string;
    pg: string;
};
export type DialectKey = keyof typeof Dialects;
export type DialectValue = typeof Dialects[DialectKey];
export type Connection = {
    user: string;
    password: string;
    server: string;
    database: string;
};
export type Config = {
    client: DialectKey;
    connection: Connection;
    debug: boolean;
};
/**
 * @typedef Connection
 * @property {String} user
 * @property {String} password
 * @property {String} server
 * @property {String} database
 */
/**
 * @typedef Config
 * @property {DialectKey} client
 * @property {Connection} connection
 * @property {Boolean} debug
 */
declare class Database {
    /**@type {import("./client.js")} */
    client: import("./client.js");
    /**@param {Config} config */
    constructor(config?: Config);
    escapeLike(any: any): string;
    escapeGlob(any: any): string;
    escapeIdentifier(any: any): string;
    escapeLiteral(any: any): string;
    /**@returns {import("./raw.js")} */
    raw(): import("./raw.js");
    /**@returns {import("./query.js")} */
    query(): import("./query.js");
    /**@returns {import("./schema.js")} */
    schema(): import("./schema.js");
    migrate(): Promise<any>;
    rollback(): Promise<any>;
    connect(): Promise<void>;
    close(): Promise<void>;
    execute(query: any, params: any): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map