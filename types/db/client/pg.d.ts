export = PgClient;
import Client = require("../client.js");
import PLpgSQLQuery = require("../query/plpgsql.js");
import PLpgSQLSchema = require("../schema/plpgsql.js");
declare class PgClient extends Client {
    /**@type {Pool}*/
    pool: Pool;
    constructor(config: any, dialect: any, debug: any);
    defaultParams(): never[];
    defaultPlaceholder(name: any): number;
    formatPlaceholder(name: any): string;
    query(): PLpgSQLQuery;
    schema(): PLpgSQLSchema;
    connect(): Promise<Pool>;
    close(): Promise<void>;
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    isReader(command: any, rows: any): boolean;
    execute(query: any, params?: any[]): Promise<any>;
    transaction(callback: any): Promise<any>;
}
//# sourceMappingURL=pg.d.ts.map