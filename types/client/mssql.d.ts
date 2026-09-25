export = MssqlClient;
import Client = require("../client.js");
import TSQLQuery = require("../query/tsql.js");
import TSQLSchema = require("../schema/tsql.js");
declare class MssqlClient extends Client {
    /**@type {import("mssql/msnodesqlv8").ConnectionPool}*/
    pool: import("mssql/msnodesqlv8").ConnectionPool;
    constructor(config: any, dialect: any, debug: any);
    query(): TSQLQuery;
    schema(): TSQLSchema;
    connect(): Promise<any>;
    close(): Promise<void>;
    isReader(query: any): boolean;
    execute(query: any, params?: {}): Promise<any>;
    transaction(callback: any): Promise<any>;
}
//# sourceMappingURL=mssql.d.ts.map