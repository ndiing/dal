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
    /**@private*/ private _with;
    /**@private*/ private _withRecursive;
    /**@private*/ private _columns;
    /**@private*/ private _placeholders;
    /**@private*/ private _values;
    /**@private*/ private _insert;
    /**@private*/ private _default;
    /**@private*/ private _onConflict;
    /**@private*/ private _doUpdate;
    /**@private*/ private _doNothing;
    /**@private*/ private _update;
    /**@private*/ private _delete;
    /**@private*/ private _select;
    /**@private*/ private _from;
    /**@private*/ private _join;
    /**@private*/ private _on;
    /**@private*/ private _where;
    /**@private*/ private _groupBy;
    /**@private*/ private _having;
    /**@private*/ private _orderBy;
    /**@private*/ private _union;
    /**@private*/ private _limit;
    /**@private*/ private _offset;
    /**@private*/ private _returning;
    /**@private*/ private _as;
    /**@private*/ private _counter;
    params: null;
    /**@private*/ private _subquery;
    /**@private*/ private _reference;
    used: null;
    constructor(client: any);
    /**@private*/
    private _createSubquery;
    /**@private*/
    private _createReference;
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
    /**@private*/
    private _createWhereCondition;
    /**@private*/
    private _createJoinCondition;
    /**@private*/
    private _setJoin;
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
    /**@private*/
    private _setOn;
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
    /**@private*/
    private _setWhere;
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
    /**@private*/
    private _setHaving;
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
    /**@private*/
    private _setUnion;
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
    /**@private*/
    private _setParams;
    /**@private*/
    private _buildRawQuery;
    /**@private*/
    private _buildCondition;
    /**@private*/
    private _applyWith;
    /**@private*/
    private _applyWithRecursive;
    /**@private*/
    private _applyInsert;
    /**@private*/
    private _applyUpdate;
    /**@private*/
    private _applyDelete;
    /**@private*/
    private _applySelect;
    /**@private*/
    private _applyFrom;
    /**@private*/
    private _applyJoin;
    /**@private*/
    private _applyOn;
    /**@private*/
    private _applyWhere;
    /**@private*/
    private _applyGroupBy;
    /**@private*/
    private _applyHaving;
    /**@private*/
    private _applyOrderBy;
    /**@private*/
    private _applyUnion;
    /**@private*/
    private _applyLimit;
    /**@private*/
    private _applyOffset;
    /**@private*/
    private _applyReturning;
    /**@private*/
    private _buildStatement;
    build(): never[] | {
        query: any;
        params: null;
    };
}
