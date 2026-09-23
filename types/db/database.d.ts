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
declare class Database<D extends keyof Driver> {
    /**@type {import("./client.js")} */
    client: import("./client.js");
    /**@param {Config<D>} config */
    constructor(config?: Config<D>);
    escapeLike(any: any): string;
    escapeGlob(any: any): string;
    escapeIdentifier(any: any): string;
    escapeLiteral(any: any): string;
    raw(): import("./raw");
    query(): {
        [x: symbol]: boolean;
        _transform(rows: any): any;
        first(column: any): /*elided*/ any;
        count(): /*elided*/ any;
        exists(): /*elided*/ any;
        pluck(column: any): /*elided*/ any;
        then(onfulfilled: any, onrejected: any): any;
        catch(onrejected: any): any;
        finally(onfinally: any): any;
        _with: any[];
        _withRecursive: any[];
        _columns: null;
        _placeholders: null;
        _values: null;
        _insert: null;
        _default: null;
        _onConflict: null;
        _doUpdate: null;
        _doNothing: null;
        _update: null;
        _delete: null;
        _select: null;
        _from: null;
        _join: any[];
        _on: any[];
        _where: any[];
        _groupBy: any[];
        _having: any[];
        _orderBy: any[];
        _union: any[];
        _limit: null;
        _offset: null;
        _returning: null;
        _as: null;
        _counter: {};
        params: null;
        _subquery: null;
        _reference: null;
        used: null;
        _createSubquery(callback: any): any;
        _createReference(callback: any): any;
        with(name: string, callback: import("./query").QueryCallback): /*elided*/ any;
        withRecursive(name: string, callback: import("./query").QueryCallback): /*elided*/ any;
        insert(table: any, columns?: null, values?: null): /*elided*/ any;
        default(): /*elided*/ any;
        onConflict(...columns: any[]): /*elided*/ any;
        doUpdate(): /*elided*/ any;
        doNothing(): /*elided*/ any;
        update(table: string, row: Record<string, import("./query").QueryCallback>): /*elided*/ any;
        delete(table: any): /*elided*/ any;
        select(...columns: (string | import("./query").QueryCallback)[]): /*elided*/ any;
        from(table: string | import("./query").QueryCallback): /*elided*/ any;
        _createWhereCondition(column: any, operator: any, value: any): {
            column: any;
            operator: any;
            value: any;
        };
        _createJoinCondition(column: any, operator: any, value: any): {
            column: any;
            operator: any;
            value: any;
        };
        _setJoin(type: any, table: any, column: any, operator: any, value: any): /*elided*/ any;
        join(table: string, column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        innerJoin(table: string, column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        leftJoin(table: string, column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        crossJoin(table: string): /*elided*/ any;
        rightJoin(table: string, column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        fullOuterJoin(table: string, column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        _setOn(conjunction: any, type: any, column: any, operator: any, value: any): /*elided*/ any;
        on(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        onNot(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        onExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        onNotExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orOn(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orOnNot(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orOnExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orOnNotExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        _setWhere(conjunction: any, type: any, column: any, operator: any, value: any): /*elided*/ any;
        where(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        whereNot(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        whereExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        whereNotExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orWhere(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orWhereNot(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orWhereExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orWhereNotExists(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        groupBy(...columns: any[]): /*elided*/ any;
        _setHaving(conjunction: any, type: any, column: any, operator: any, value: any): /*elided*/ any;
        having(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orHaving(column: string | import("./query").QueryCallback, operator: string, value: string | import("./query").QueryCallback): /*elided*/ any;
        orderBy(column: any, direction: any): /*elided*/ any;
        _setUnion(type: any, callback: any): /*elided*/ any;
        union(callback: import("./query").QueryCallback): /*elided*/ any;
        unionAll(callback: import("./query").QueryCallback): /*elided*/ any;
        limit(limit?: null): /*elided*/ any;
        offset(offset?: null): /*elided*/ any;
        returning(...columns: any[]): /*elided*/ any;
        as(alias: any): /*elided*/ any;
        _setParams(params: any): void;
        _buildRawQuery(raw: any): any;
        _buildCondition({ column, operator, value }?: {}): string;
        _applyWith(arr: any): void;
        _applyWithRecursive(arr: any): void;
        _applyInsert(arr: any): void;
        _applyUpdate(arr: any): void;
        _applyDelete(arr: any): void;
        _applySelect(arr: any): void;
        _applyFrom(arr: any): void;
        _applyJoin(arr: any): void;
        _applyOn(arr: any): void;
        _applyWhere(arr: any): void;
        _applyGroupBy(arr: any): void;
        _applyHaving(arr: any): void;
        _applyOrderBy(arr: any): void;
        _applyUnion(arr: any): void;
        _applyLimit(arr: any): void;
        _applyOffset(arr: any): void;
        _applyReturning(arr: any): void;
        _buildStatement(arr: any): any;
        build(): never[] | {
            query: any;
            params: null;
        };
        client: import("./client.js");
        _transforms: any[];
    };
    /**@returns {import("./schema.js")<Driver[D]>}*/
    schema(): import("./schema.js")<Driver[D]>;
    migrate(): Promise<any>;
    rollback(): Promise<any>;
    connect(): Promise<void>;
    close(): Promise<void>;
    execute(query: any, params: any): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map