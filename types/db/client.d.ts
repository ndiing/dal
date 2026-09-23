export = Client;
import Raw = require("./raw.js");
import Query = require("./query.js");
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
    raw(): Raw;
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
        with(name: string, callback: Query.QueryCallback): /*elided*/ any;
        withRecursive(name: string, callback: Query.QueryCallback): /*elided*/ any;
        insert(table: any, columns?: null, values?: null): /*elided*/ any;
        default(): /*elided*/ any;
        onConflict(...columns: any[]): /*elided*/ any;
        doUpdate(): /*elided*/ any;
        doNothing(): /*elided*/ any;
        update(table: string, row: Record<string, Query.QueryCallback>): /*elided*/ any;
        delete(table: any): /*elided*/ any;
        select(...columns: (string | Query.QueryCallback)[]): /*elided*/ any;
        from(table: string | Query.QueryCallback): /*elided*/ any;
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
        join(table: string, column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        innerJoin(table: string, column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        leftJoin(table: string, column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        crossJoin(table: string): /*elided*/ any;
        rightJoin(table: string, column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        fullOuterJoin(table: string, column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        _setOn(conjunction: any, type: any, column: any, operator: any, value: any): /*elided*/ any;
        on(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        onNot(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        onExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        onNotExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orOn(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orOnNot(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orOnExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orOnNotExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        _setWhere(conjunction: any, type: any, column: any, operator: any, value: any): /*elided*/ any;
        where(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        whereNot(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        whereExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        whereNotExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orWhere(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orWhereNot(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orWhereExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orWhereNotExists(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        groupBy(...columns: any[]): /*elided*/ any;
        _setHaving(conjunction: any, type: any, column: any, operator: any, value: any): /*elided*/ any;
        having(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orHaving(column: string | Query.QueryCallback, operator: string, value: string | Query.QueryCallback): /*elided*/ any;
        orderBy(column: any, direction: any): /*elided*/ any;
        _setUnion(type: any, callback: any): /*elided*/ any;
        union(callback: Query.QueryCallback): /*elided*/ any;
        unionAll(callback: Query.QueryCallback): /*elided*/ any;
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