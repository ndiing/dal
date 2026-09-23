export = Client;
import Schema = require("./schema.js");
export type TransactionCallback = (client: Client) => any;
/**
 * @callback TransactionCallback
 * @param {Client} client
 */
declare class Client {
    config: {};
    pool: null;
    dialect: null;
    debug: null;
    constructor(config: {} | undefined, dialect: any, debug: any);
    escapeLike(value: any): string;
    escapeGlob(value: any): string;
    escapeIdentifier(value: any): string;
    escapeLiteral(value: any): string;
    defaultParams(): {};
    defaultPlaceholder(name: any): any;
    formatPlaceholder(name: any): string;
    /**@returns {import("./raw.js")} */
    raw(): import("./raw.js");
    /**@returns {import("./query.js")} */
    query(): import("./query.js");
    /**
     * Description placeholder
     *
     * @returns {Schema<string | number | symbol>}
     */
    schema(): Schema<string | number | symbol>;
    connect(): Promise<void>;
    close(): Promise<void>;
    isReader(): Promise<void>;
    execute(query: any, params: any): Promise<void>;
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    /**
     * @param {TransactionCallback} callback
     * @returns {Client}
     */
    transaction(callback: TransactionCallback): Client;
}
//# sourceMappingURL=client.d.ts.map