const Column = require("./column.js");
const Constraint = require("./constraint.js");
const Index = require("./index.js");

class Table {
    /**@private*/ _method = null;
    /**@private*/ _name = null;
    /**@private*/ _constraint = null;

    /**@type {Column[]}*/
    columns = [];
    /**@type {Constraint[]}*/
    constraints = [];
    /**@type {Index[]}*/
    indexes = [];

    constructor(method = null, name = null, dialect) {
        this._method = method;
        this._name = name;
        this.dialect = dialect;
        this._constraint = new Constraint(this._name, null, null, null);
        this.constraints = [this._constraint];
    }

    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    addColumn(name) {
        const method = this._method === "CREATE" ? null : "ADD";
        const column = new Column(this._name, method, name, this.dialect);
        this.columns.push(column);
        return column;
    }

    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    column(name) {
        return this.addColumn(name);
    }

    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    alterColumn(name) {
        const column = new Column(this._name, "ALTER", name, this.dialect);
        this.columns.push(column);
        return column;
    }

    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    dropColumn(name) {
        const column = new Column(this._name, "DROP", name, this.dialect);
        this.columns.push(column);
        return column;
    }

    addConstraint(name = true) {
        const method = this._method === "CREATE" ? null : "ADD";
        this._constraint = new Constraint(this._name, null, method, name);
        this.constraints.push(this._constraint);
        return this;
    }

    constraint(name = true) {
        return this.addConstraint(name);
    }

    dropConstraint(name = true) {
        this._constraint = new Constraint(this._name, null, "DROP", name);
        this.constraints.push(this._constraint);
        return this;
    }

    unique(...columns) {
        this._constraint.unique(...columns);
        return this;
    }

    primaryKey(...columns) {
        this._constraint.primaryKey(...columns);
        return this;
    }

    default(value) {
        this._constraint.default(value);
        return this;
    }

    for(column) {
        this._constraint.for(column);
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

    foreignKey(...columns) {
        this._constraint.foreignKey(...columns);
        return this;
    }

    references(table, ...columns) {
        this._constraint.references(table, ...columns);
        return this;
    }

    createIndex(name = true) {
        const index = new Index(this._name, "CREATE", name);
        this.indexes.push(index);
        return index;
    }

    index(name) {
        return this.createIndex(name);
    }

    dropIndex(name = true) {
        const index = new Index(this._name, "DROP", name);
        this.indexes.push(index);
        return index;
    }
}

module.exports = Table;
