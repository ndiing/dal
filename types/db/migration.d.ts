export = Migration;
export type Context = {
    query: () => import('./query.js');
    schema: () => import('./schema.js')<'PLpgSQL' | 'SQLiteSQL' | 'TSQL'>;
    raw: () => import('./raw.js');
};
/**
 * @typedef Context
 * @property {() => import('./query.js')} query
 * @property {() => import('./schema.js')<'PLpgSQL'|'SQLiteSQL'|'TSQL'>} schema
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
    /**@type {import('./database.js')<'pg'|'better-sqlite3'|'mssql'>}*/
    client: import('./database.js')<'pg' | 'better-sqlite3' | 'mssql'>;
    /**
     * @param {import('./database.js')<'pg'|'better-sqlite3'|'mssql'>} client
     * @param {Object} config
     */
    constructor(client: import('./database.js')<'pg' | 'better-sqlite3' | 'mssql'>, config?: Object);
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
    migrate(): Promise<any>;
    _getLastBatch(): Promise<any>;
    _getAppliedBatch(batch: any): Promise<any>;
    _unmarkApplied(client: any, id: any): Promise<any>;
    rollback(): Promise<any>;
}
