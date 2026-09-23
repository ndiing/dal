export = BetterSqlite3Client;
import Client = require("../client.js");
import SQLiteSQLQuery = require("../query/sqlitesql.js");
import SQLiteSQLSchema = require("../schema/sqlitesql.js");
declare class BetterSqlite3Client extends Client {
    counter: number;
    /**@type {import("better-sqlite3").Database}*/
    pool: import("better-sqlite3").Database;
    constructor(config: any, dialect: any, debug: any);
    query(): SQLiteSQLQuery;
    schema(): SQLiteSQLSchema;
    connect(): Promise<any>;
    close(): Promise<void>;
    isReader(stmt: any): any;
    execute(query: any, params?: {}): Promise<any>;
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
