export = Migration;
export type Context = {
    query: () => import('./query.js');
    schema: () => import('./schema.js');
    raw: () => import('./raw.js');
};
/**
 * @typedef Context
 * @property {() => import('./query.js')} query
 * @property {() => import('./schema.js')} schema
 * @property {() => import('./raw.js')} raw
 */
declare class Migration {
    config: {
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: PropertyKey): boolean;
        cwd: any;
        directory: string;
        tableName: string;
    };
    directory: any;
    tableName: string;
    /**@type {import('./client.js')}*/
    client: import('./client.js');
    /**
     * @param {import('./client.js')} client
     * @param {Object} config
     */
    constructor(client: import('./client.js'), config?: Object);
    _hasTable(): Promise<any>;
    _createTable(): Promise<any>;
    _ensureTable(): Promise<any>;
    _getApplied(): Promise<any>;
    _getPending(): any;
    _createContext(): {
        context: {
            query: (...args: any[]) => any;
            schema: (...args: any[]) => any;
            raw: (...args: any[]) => any;
        };
        statements: any[];
    };
    _markApplied(client: any, { name, batch }?: {}): Promise<any>;
    /**
     * @async
     * @returns {unknown}
     */
    migrate(): unknown;
    _getLastBatch(): Promise<any>;
    _getAppliedBatch(batch: any): Promise<any>;
    _unmarkApplied(client: any, id: any): Promise<any>;
    /**
     * @async
     * @returns {unknown}
     */
    rollback(): unknown;
}
//# sourceMappingURL=migration.d.ts.map