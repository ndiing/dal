export = Table;
import Column = require("./column.js");
import Constraint = require("./constraint.js");
import Index = require("./index.js");
declare class Table {
    dialect: any;
    /**@private*/ private _method;
    /**@private*/ private _name;
    /**@private*/ private _constraint;
    /**@type {Column[]}*/
    columns: Column[];
    /**@type {Constraint[]}*/
    constraints: Constraint[];
    /**@type {Index[]}*/
    indexes: Index[];
    constructor(method: null | undefined, name: null | undefined, dialect: any);
    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    addColumn(name: string): import("./column.js").ColumnTypes;
    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    column(name: string): import("./column.js").ColumnTypes;
    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    alterColumn(name: string): import("./column.js").ColumnTypes;
    /**
     *
     * @param {String} name
     * @returns {import('./column.js').ColumnTypes}
     */
    dropColumn(name: string): import("./column.js").ColumnTypes;
    addConstraint(name?: boolean): this;
    constraint(name?: boolean): this;
    dropConstraint(name?: boolean): this;
    unique(...columns: any[]): this;
    primaryKey(...columns: any[]): this;
    default(value: any): this;
    for(column: any): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    check(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    checkNot(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheck(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheckNot(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    foreignKey(...columns: any[]): this;
    references(table: any, ...columns: any[]): this;
    createIndex(name?: boolean): Index;
    index(name: any): Index;
    dropIndex(name?: boolean): Index;
}
//# sourceMappingURL=table.d.ts.map
