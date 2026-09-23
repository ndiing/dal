const Thenable = require("./thenable.js");
const { isArray, isObject, isFunction, QUERY, RAW } = require("./util.js");

/**
 * @callback QueryCallback
 * @param {Query} query
 */

class Query extends Thenable {
    [QUERY] = true;
     _with = [];
     _withRecursive = [];
     _columns = null;
     _placeholders = null;
     _values = null;
     _insert = null;
     _default = null;
     _onConflict = null;
     _doUpdate = null;
     _doNothing = null;
     _update = null;
     _delete = null;
     _select = null;
     _from = null;
     _join = [];
     _on = [];
     _where = [];
     _groupBy = [];
     _having = [];
     _orderBy = [];
     _union = [];
     _limit = null;
     _offset = null;
     _returning = null;
     _as = null;
     _counter = {};
    params = null;
     _subquery = null;
     _reference = null;
    used = null;

    constructor(client) {
        super(client);
        this.params = this.client.defaultParams();
    }

    
    _createSubquery(callback) {
        if (isFunction(callback)) {
            const query = new Query(this.client);
            query._subquery = true;
            callback(query);
            callback = query;
        }
        return callback;
    }

    
    _createReference(callback) {
        if (isFunction(callback)) {
            const query = new Query(this.client);
            query._reference = true;
            callback(query);
            callback = query;
        }
        return callback;
    }

    /**
     *
     * @param {String} name
     * @param {QueryCallback} callback
     * @returns {this}
     */
    with(name, callback) {
        const context = this._createSubquery(callback);
        this._with.push({ name, context });
        return this;
    }

    /**
     *
     * @param {String} name
     * @param {QueryCallback} callback
     * @returns {this}
     */
    withRecursive(name, callback) {
        const context = this._createSubquery(callback);
        this._withRecursive.push({ name, context });
        return this;
    }

    insert(table, columns = null, values = null) {
        this._insert = table;
        if (isArray(values) && !isArray(values[0])) {
            values = [values];
        }
        if (isObject(columns)) {
            columns = [columns];
        }
        if (isArray(columns) && isObject(columns[0])) {
            const rows = columns;
            const row = columns[0];
            columns = Object.keys(row);
            values = rows.map((row) => columns.map((column) => row[column]));
        }
        this._columns = columns;
        this._values = values?.flat();
        this._placeholders = values;
        return this;
    }

    default() {
        this._default = true;
        return this;
    }

    onConflict(...columns) {
        this._onConflict = columns.flat();
        return this;
    }

    doUpdate() {
        const _onConflict = new Set(this._onConflict);
        this._doUpdate = this._columns.filter((column) => !_onConflict.has(column));
        return this;
    }

    doNothing() {
        this._doNothing = true;
        return this;
    }

    /**
     *
     * @param {String} table
     * @param {Object.<string, QueryCallback>} row
     * @returns {this}
     */
    update(table, row) {
        this._update = table;
        this._columns = [];
        this._values = [];
        for (const name in row) {
            const value = row[name];
            this._columns.push(name);
            this._values.push(this._createSubquery(value));
        }
        return this;
    }

    delete(table) {
        this._delete = true;
        if (this._from === null) {
            this.from(table);
        }
        return this;
    }

    /**
     *
     * @param  {...(String|QueryCallback)} columns
     * @returns {this}
     */
    select(...columns) {
        columns = columns.flat();
        if (columns[0] === undefined) {
            columns[0] = "*";
        }
        this._select = columns.map((column) => this._createSubquery(column));
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} table
     * @returns {this}
     */
    from(table) {
        this._from = this._createSubquery(table);
        return this;
    }

    
    _createWhereCondition(column, operator, value) {
        column = this._createSubquery(column);
        if (value === undefined && operator !== undefined) {
            value = operator;
            operator = "=";
        }
        operator = operator?.toUpperCase();
        value = this._createSubquery(value);
        if (value === null) {
            value = this.client.raw("NULL");
        }
        return { column, operator, value };
    }

    
    _createJoinCondition(column, operator, value) {
        column = this._createSubquery(column);
        if (value === undefined && operator !== undefined) {
            value = operator;
            operator = "=";
        }
        operator = operator?.toUpperCase();
        value = this._createSubquery(value);
        if (value && !(value && value[RAW]) && !(value && value[QUERY])) {
            value = this.client.raw(value);
        }
        return { column, operator, value };
    }

    
    _setJoin(type, table, column, operator, value) {
        table = this._createSubquery(table);
        column = this._createReference(column);
        const condition = column ? this._createJoinCondition(column, operator, value) : null;
        this._join.push({ type, table, condition });
        return this;
    }

    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    join(table, column, operator, value) {
        this._setJoin("JOIN", table, column, operator, value);
        return this;
    }

    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    innerJoin(table, column, operator, value) {
        this._setJoin("INNER JOIN", table, column, operator, value);
        return this;
    }

    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    leftJoin(table, column, operator, value) {
        this._setJoin("LEFT JOIN", table, column, operator, value);
        return this;
    }

    /**
     *
     * @param {String} table
     * @returns {this}
     */
    crossJoin(table) {
        this._setJoin("CROSS JOIN", table);
        return this;
    }

    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    rightJoin(table, column, operator, value) {
        this._setJoin("RIGHT JOIN", table, column, operator, value);
        return this;
    }

    /**
     *
     * @param {String} table
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    fullOuterJoin(table, column, operator, value) {
        this._setJoin("FULL OUTER JOIN", table, column, operator, value);
        return this;
    }

    
    _setOn(conjunction, type, column, operator, value) {
        if (!this._subquery && !this._reference) {
            throw new Error(`Invalid usage: on()|onNot()|onExists()|onNotExists()|orOn()|orOnNot()|orOnExists()|orOnNotExists() can only be called inside a join() callback`);
        }

        conjunction = this._on.length ? conjunction : "";
        const condition = this._createJoinCondition(column, operator, value);
        this._on.push({ conjunction, type, condition });
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    on(column, operator, value) {
        this._setOn("AND", "", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    onNot(column, operator, value) {
        this._setOn("AND", "NOT", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    onExists(column, operator, value) {
        this._setOn("AND", "EXISTS", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    onNotExists(column, operator, value) {
        this._setOn("AND", "NOT EXISTS", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOn(column, operator, value) {
        this._setOn("OR", "", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOnNot(column, operator, value) {
        this._setOn("OR", "NOT", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOnExists(column, operator, value) {
        this._setOn("OR", "EXISTS", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orOnNotExists(column, operator, value) {
        this._setOn("OR", "NOT EXISTS", column, operator, value);
        return this;
    }

    
    _setWhere(conjunction, type, column, operator, value) {
        conjunction = this._where.length ? conjunction : "";
        const condition = this._createWhereCondition(column, operator, value);
        this._where.push({ conjunction, type, condition });
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    where(column, operator, value) {
        this._setWhere("AND", "", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    whereNot(column, operator, value) {
        this._setWhere("AND", "NOT", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    whereExists(column, operator, value) {
        this._setWhere("AND", "EXISTS", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    whereNotExists(column, operator, value) {
        this._setWhere("AND", "NOT EXISTS", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhere(column, operator, value) {
        this._setWhere("OR", "", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhereNot(column, operator, value) {
        this._setWhere("OR", "NOT", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhereExists(column, operator, value) {
        this._setWhere("OR", "EXISTS", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orWhereNotExists(column, operator, value) {
        this._setWhere("OR", "NOT EXISTS", column, operator, value);
        return this;
    }

    groupBy(...columns) {
        this._groupBy.push(...columns);
        return this;
    }

    
    _setHaving(conjunction, type, column, operator, value) {
        conjunction = this._having.length ? conjunction : "";
        const condition = this._createWhereCondition(column, operator, value);
        this._having.push({ conjunction, type, condition });
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    having(column, operator, value) {
        this._setHaving("AND", "", column, operator, value);
        return this;
    }

    /**
     *
     * @param {String|QueryCallback} column
     * @param {String} operator
     * @param {String|QueryCallback} value
     * @returns {this}
     */
    orHaving(column, operator, value) {
        this._setHaving("OR", "", column, operator, value);
        return this;
    }

    orderBy(column, direction) {
        this._orderBy.push({ column, direction });
        return this;
    }

    
    _setUnion(type, callback) {
        const query = this._createReference(callback);
        this._union.push({ type, query });
        return this;
    }

    /**
     *
     * @param {QueryCallback} callback
     * @returns {this}
     */
    union(callback) {
        this._setUnion("UNION", callback);
        return this;
    }

    /**
     *
     * @param {QueryCallback} callback
     * @returns {this}
     */
    unionAll(callback) {
        this._setUnion("UNION ALL", callback);
        return this;
    }

    limit(limit = null) {
        this._limit = limit;
        return this;
    }

    offset(offset = null) {
        this._offset = offset;
        return this;
    }

    returning(...columns) {
        columns = columns.flat();
        if (columns[0] === undefined) {
            columns[0] = "*";
        }
        this._returning = columns;
        return this;
    }

    as(alias) {
        this._as = alias;
        return this;
    }

    
    _setParams(params) {
        if (isArray(this.params)) {
            for (const value of params) {
                this.params.push(value);
            }
        } else {
            for (const name in params) {
                this.params[name] = params[name];
            }
        }
    }

    
    _buildRawQuery(raw) {
        if ((raw && raw[RAW]) || raw[QUERY]) {
            raw._counter = this._counter;
            const result = raw.build();
            this._counter = raw._counter;
            this._setParams(result.params);
            raw = result.query;
        }
        return raw;
    }

    
    _buildCondition({ column, operator, value } = {}) {
        column = this._buildRawQuery(column);

        if (operator !== undefined && !(value && value[RAW]) && !(value && value[QUERY])) {
            if (["IN", "NOT IN"].includes(operator?.toUpperCase())) {
                if (value?.length === 0) {
                    return operator.toUpperCase() === "IN" ? "1 = 0" : "1 = 1";
                }
                value = this.client.raw(`(${value.map((_value) => "?").join(", ")})`, value);
            } else if (["BETWEEN", "NOT BETWEEN"].includes(operator?.toUpperCase())) {
                value = this.client.raw(value.map((_value) => "?").join(" AND "), value);
            } else {
                value = this.client.raw("?", [value]);
            }
        }

        if (value && (value[QUERY] || value[RAW])) {
            value = this._buildRawQuery(value);
        }

        const arr = [];
        if (column) {
            arr.push(column);
        }
        if (operator) {
            arr.push(operator);
        }
        if (value) {
            arr.push(value);
        }
        // if (["LIKE", "NOT LIKE"].includes(operator?.toUpperCase())) {
        //     arr.push("ESCAPE '\\'");
        // }
        return arr.join(" ");
    }

    
    _applyWith(arr) {
        arr.push("WITH");
        arr.push(
            this._with
                .map(({ name, context }) => {
                    const arr = [];
                    arr.push(name, "AS");
                    arr.push(this._buildRawQuery(context));
                    return arr.join(" ");
                })
                .join(", "),
        );
    }

    
    _applyWithRecursive(arr) {
        arr.push("WITH RECURSIVE");
        arr.push(
            this._withRecursive
                .map(({ name, context }) => {
                    const arr = [];
                    arr.push(name, "AS");
                    arr.push(this._buildRawQuery(context));
                    return arr.join(" ");
                })
                .join(", "),
        );
    }

    
    _applyInsert(arr) {
        arr.push("INSERT");
        arr.push("INTO");
        arr.push(this._insert);
        if (this._columns !== null) {
            arr.push(`(${this._columns.map((column) => column).join(", ")})`);
        }
        if (this._default !== null) {
            arr.push("DEFAULT");
            arr.push("VALUES");
        }
        if (this._placeholders !== null) {
            arr.push("VALUES");
            const raw = this.client.raw(this._placeholders.map((value) => `(${(this._columns ? this._columns.map((column) => `?${column}`) : value.map((_value) => "?")).join(", ")})`).join(", "), this._values);
            arr.push(this._buildRawQuery(raw));
        }
        if (this._onConflict !== null) {
            arr.push("ON CONFLICT");
            arr.push(`(${this._onConflict.map((column) => column).join(",")})`);
        }
        if (this._doUpdate !== null) {
            arr.push("DO UPDATE SET");
            arr.push(this._doUpdate.map((column) => [`${column}`, `excluded.${column}`].join(" = ")).join(", "));
        }
        if (this._doNothing !== null) {
            arr.push("DO NOTHING");
        }
    }

    
    _applyUpdate(arr) {
        arr.push("UPDATE", this._update, "SET");
        const raw = this.client.raw(
            this._columns
                .map((column, index) => {
                    const value = this._values[index];
                    let placeholder = "?" + column;
                    if (value && (value[RAW] || value[QUERY])) {
                        placeholder = this._buildRawQuery(value);
                    }
                    return [column, placeholder].join(" = ");
                })
                .join(", "),
            this._values,
        );
        arr.push(this._buildRawQuery(raw));
    }

    
    _applyDelete(arr) {
        arr.push("DELETE");
    }

    
    _applySelect(arr) {
        arr.push("SELECT");
        arr.push(
            this._select
                .map((column) => {
                    if (column && (column[RAW] || column[QUERY])) {
                        return this._buildRawQuery(column);
                    }
                    return column;
                })
                .join(", "),
        );
    }

    
    _applyFrom(arr) {
        arr.push("FROM");
        arr.push(this._buildRawQuery(this._from));
    }

    
    _applyJoin(arr) {
        arr.push(
            this._join
                .map(({ type, table, condition }) => {
                    const arr = [];
                    if (table && table[QUERY]) {
                        table = this._buildRawQuery(table);
                    }
                    arr.push(type, table);
                    if (condition) {
                        arr.push("ON", this._buildCondition(condition));
                    }
                    return arr.join(" ");
                })
                .join(" "),
        );
    }

    
    _applyOn(arr) {
        arr.push(
            this._on
                .map(({ conjunction, type, condition }) => {
                    const arr = [];
                    if (conjunction) {
                        arr.push(conjunction);
                    }
                    if (type) {
                        arr.push(type);
                    }
                    arr.push(this._buildCondition(condition));
                    return arr.join(" ");
                })
                .join(" "),
        );
    }

    
    _applyWhere(arr) {
        const str = this._subquery && this._select === null ? "" : "WHERE";
        if (str) {
            arr.push(str);
        }
        arr.push(
            this._where
                .map(({ conjunction, type, condition }) => {
                    const arr = [];
                    if (conjunction) {
                        arr.push(conjunction);
                    }
                    if (type) {
                        arr.push(type);
                    }
                    arr.push(this._buildCondition(condition));
                    return arr.join(" ");
                })
                .join(" "),
        );
    }

    
    _applyGroupBy(arr) {
        arr.push("GROUP BY");
        arr.push(this._groupBy.join(", "));
    }

    
    _applyHaving(arr) {
        const str = this._subquery && this._select === null ? "" : "HAVING";
        if (str) {
            arr.push(str);
        }
        arr.push(
            this._having
                .map(({ conjunction, type, condition }) => {
                    const arr = [];
                    if (conjunction) {
                        arr.push(conjunction);
                    }
                    if (type) {
                        arr.push(type);
                    }
                    arr.push(this._buildCondition(condition));
                    return arr.join(" ");
                })
                .join(" "),
        );
    }

    
    _applyOrderBy(arr) {
        arr.push("ORDER BY");
        arr.push(
            this._orderBy
                .map(({ column, direction }) => {
                    const arr = [];
                    arr.push(this._buildRawQuery(column));
                    if (direction) {
                        arr.push(direction);
                    }
                    return arr.join(" ");
                })
                .join(", "),
        );
    }

    
    _applyUnion(arr) {
        arr.push(
            this._union
                .map(({ type, query }) => {
                    const arr = [];
                    arr.push(type);
                    arr.push(this._buildRawQuery(query));
                    return arr.join(" ");
                })
                .join(" "),
        );
    }

    
    _applyLimit(arr) {
        arr.push("LIMIT");
        const raw = this.client.raw("?", [this._limit]);
        arr.push(this._buildRawQuery(raw));
    }

    
    _applyOffset(arr) {
        arr.push("OFFSET");
        const raw = this.client.raw("?", [this._offset]);
        arr.push(this._buildRawQuery(raw));
    }

    
    _applyReturning(arr) {
        arr.push("RETURNING");
        arr.push(this._returning.map((column) => column).join(", "));
    }

    
    _buildStatement(arr) {
        let query = arr.join(" ");
        if (this._subquery) {
            query = `(${query})`;
            if (this._as !== null) {
                query = `${query} AS ${this._as}`;
            }
        }
        if (this._subquery === null && this._reference === null) {
            query = `${query};`;
        }
        return query;
    }

    build() {
        if (this.used) {
            return [];
        }
        this.used = true;

        const arr = [];

        if (this._with.length) this._applyWith(arr);
        if (this._withRecursive.length) this._applyWithRecursive(arr);

        if (this._insert !== null) this._applyInsert(arr);
        if (this._update !== null) this._applyUpdate(arr);
        if (this._delete !== null) this._applyDelete(arr);

        if (this._select !== null) this._applySelect(arr);
        if (this._from !== null) this._applyFrom(arr);
        if (this._join.length) this._applyJoin(arr);
        if (this._on.length) this._applyOn(arr);
        if (this._where.length) this._applyWhere(arr);
        if (this._groupBy.length) this._applyGroupBy(arr);
        if (this._having.length) this._applyHaving(arr);
        if (this._union.length) this._applyUnion(arr);
        if (this._orderBy.length) this._applyOrderBy(arr);
        if (this._limit !== null) this._applyLimit(arr);
        if (this._offset !== null) this._applyOffset(arr);

        if (this._returning !== null) this._applyReturning(arr);

        const query = this._buildStatement(arr);
        const params = this.params;

        return { query, params };
    }
}

module.exports = Query;
