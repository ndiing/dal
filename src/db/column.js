const Constraint = require("./constraint.js");
const PLpgSQLTypes = require("./types/plpgsql.js");
const SQLiteSQLTypes = require("./types/sqlitesql.js");
const TSQLTypes = require("./types/tsql.js");

const Types = {
    sqlitesql: SQLiteSQLTypes,
    plpgsql: PLpgSQLTypes,
    tsql: TSQLTypes,
};

/**@typedef {Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes} ColumnTypes*/


class Column {
    /**@private*/ _table = null;
    /**@private*/ _method = null;
    /**@private*/ _name = null;
    /**@private*/ _constraint = null;
    /**@private*/ _type = null;
    /**@private*/ _null = null;
    /**@private*/ _notNull = null;
    /**@private*/ _identity = null;

    /**@type {Constraint[]}*/
    constraints = [];

    constructor(table = null, method = null, name = null, dialect) {
        this._table = table;
        this._method = method;
        this._name = name;
        this.dialect = dialect;
        this._constraint = new Constraint(this._table, this._name, null, null);
        this.constraints = [this._constraint];

        const types = Types[this.dialect] ?? PLpgSQLTypes;

        for (const type in types) {
            Object.defineProperty(this, type, {
                value: function () {
                    this._type = types[type](...arguments);
                    return this;
                },
                configurable: true,
                enumerable: false,
                writable: true,
            });
        }
    }

    type(type, params = []) {
        this._type = { type };
        for (let i = 1; i <= params.length; i++) {
            const p = params[i];
            this._type["p" + i] = p;
        }
        return this;
    }

    null() {
        this._null = true;
        return this;
    }

    notNull() {
        this._notNull = true;
        return this;
    }

    identity(seed = 1, increment = 1) {
        this._identity = { seed, increment };
        return this;
    }

    constraint(name = true) {
        this._constraint = new Constraint(this._table, this._name, null, name);
        this.constraints.push(this._constraint);
        return this;
    }

    unique() {
        this._constraint.unique(this._name);
        return this;
    }

    primaryKey() {
        this._constraint.primaryKey(this._name);
        return this;
    }

    default(value) {
        this._constraint.default(value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    check(column, operator, value) {
        this._constraint.check(column, operator, value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    checkNot(column, operator, value) {
        this._constraint.checkNot(column, operator, value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheck(column, operator, value) {
        this._constraint.orCheck(column, operator, value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheckNot(column, operator, value) {
        this._constraint.orCheckNot(column, operator, value);
        return this;
    }

    references(table, ...columns) {
        this._constraint.references(table, ...columns);
        return this;
    }
}

module.exports = Column;
