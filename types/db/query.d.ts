export = Query;
import Thenable = require("./thenable.js");
import { isArray, isObject, isFunction, QUERY, RAW } from "./util.js";
export type QueryCallback = (query: Query) => any;
/**
 * @callback QueryCallback
 * @param {Query} query
 */
declare class Query extends Thenable {
    [QUERY]: boolean;
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
    constructor(client: any);
    _createSubquery(callback: any): any;
    _createReference(callback: any): any;
    /**
     *
     * @param {String} name
     * @param {QueryCallback} callback
     * @returns {this}
     */
    with(name: string, callback: QueryCallback): this;
    /**
     *
     * @param {String} name
     * @param {QueryCallback} callback
     * @returns {this}
     */
    withRecursive(name: string, callback: QueryCallback): this;
    insert(table: any, columns?: null, values?: null): this;
    default(): this;
    onConflict(...columns: any[]): this;
    doUpdate(): this;
    doNothing(): this;
    /**
     *
     * @param {String} table
     * @param {Object.<string, QueryCallback>} row
     * @returns {this}
     */
    update(table: string, row: Record<string, QueryCallback>): this;
    delete(table: any): this;
    /**
     *
     * @param  {...(String|QueryCallback)} columns
     * @returns {this}
     */
    select(...columns: (string | QueryCallback)[]): this;
    /**
     *
     * @param {String|QueryCallback} table
     * @returns {this}
     */
    from(table: string | QueryCallback): this;
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
    _setJoin(type: any, table: any, column: any, operator: any, value: any): this;
    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    join(table: string, column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    innerJoin(table: string, column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    leftJoin(table: string, column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String} table
     * @returns {this}
     */
    crossJoin(table: string): this;
    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    rightJoin(table: string, column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    fullOuterJoin(table: string, column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    _setOn(conjunction: any, type: any, column: any, operator: any, value: any): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    on(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    onNot(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    onExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    onNotExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOn(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOnNot(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOnExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOnNotExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    _setWhere(conjunction: any, type: any, column: any, operator: any, value: any): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    where(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    whereNot(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    whereExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    whereNotExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhere(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhereNot(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhereExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhereNotExists(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    groupBy(...columns: any[]): this;
    _setHaving(conjunction: any, type: any, column: any, operator: any, value: any): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    having(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orHaving(column: string | QueryCallback, operator: string, value: string | QueryCallback): this;
    orderBy(column: any, direction: any): this;
    _setUnion(type: any, callback: any): this;
    /**
     *
     * @param {QueryCallback} callback
     * @returns {this}
     */
    union(callback: QueryCallback): this;
    /**
     *
     * @param {QueryCallback} callback
     * @returns {this}
     */
    unionAll(callback: QueryCallback): this;
    limit(limit?: null): this;
    offset(offset?: null): this;
    returning(...columns: any[]): this;
    as(alias: any): this;
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
}
//# sourceMappingURL=query.d.ts.map