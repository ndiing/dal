const { isFunction, CONSTRAINT } = require("./util");

/**
 * @callback ConstraintCallback
 * @param {Constraint} constraint
 */

class Constraint {
    [CONSTRAINT] = true;
    /**@private*/ _table = null;
    /**@private*/ _column = null;
    /**@private*/ _method = null;
    /**@private*/ _name = null;
    /**@private*/ _unique = null;
    /**@private*/ _primaryKey = null;
    /**@private*/ _default = null;
    /**@private*/ _for = null;
    /**@private*/ _check = [];
    /**@private*/ _foreignKey = null;
    /**@private*/ _references = null;
    /**@private*/ _onUpdate = null;
    /**@private*/ _onDelete = null;

    constructor(table = null, column = null, method = null, name = null) {
        this._table = table;
        this._column = column;
        this._method = method;
        this._name = name;
    }

    get used() {
        return this._unique !== null || this._primaryKey !== null || this._default !== null || this._check.length > 0 || this._foreignKey !== null;
    }

    unique(...columns) {
        this._unique = columns.flat();
        return this;
    }

    primaryKey(...columns) {
        this._primaryKey = columns.flat();
        return this;
    }

    default(value) {
        this._default = value;
        if (this._for === null) {
            this.for(this._column);
        }
        return this;
    }

    for(column) {
        this._for = column;
        return this;
    }

    /**@private*/
    _createGrouping(callback) {
        if (isFunction(callback)) {
            const constraint = new Constraint(this._table, this._column, this._method, this._name);
            callback(constraint);
            callback = constraint;
        }
        return callback;
    }

    /**@private*/
    _createCondition(column, value, operator) {
        column = this._createGrouping(column);
        if (value === undefined && operator !== undefined) {
            value = operator;
            operator = "=";
        }
        operator = operator?.toUpperCase();
        return { column, operator, value };
    }

    /**@private*/
    _setCheck(conjunction, type, column, operator, value) {
        conjunction = this._check.length ? conjunction : "";
        const condition = this._createCondition(column, value, operator);
        this._check.push({ conjunction, type, condition });
        return this;
    }

    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    check(column, operator, value) {
        this._setCheck("AND", "", column, operator, value);
        return this;
    }

    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    checkNot(column, operator, value) {
        this._setCheck("AND", "NOT", column, operator, value);
        return this;
    }

    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    orCheck(column, operator, value) {
        this._setCheck("OR", "", column, operator, value);
        return this;
    }

    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    orCheckNot(column, operator, value) {
        this._setCheck("OR", "NOT", column, operator, value);
        return this;
    }

    foreignKey(...columns) {
        this._foreignKey = columns;
        return this;
    }

    references(table, ...columns) {
        this._references = { table, columns };
        if (this._foreignKey === null) {
            this.foreignKey(this._column);
        }
        return this;
    }

    onUpdate(action) {
        this._onUpdate = action;
    }

    onDelete(action) {
        this._onDelete = action;
    }
}

module.exports = Constraint;
