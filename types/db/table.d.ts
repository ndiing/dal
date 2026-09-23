export = Table;
import Column = require("./column.js");
import Constraint = require("./constraint.js");
import Index = require("./index.js");
declare class Table {
    dialect: any;
    /**@private*/ private _method;
    /**@private*/ private _name;
    /**
     * @private
     * @type {Constraint}
     */
    private _constraint;
    /**@type {Column[]}*/
    columns: Column[];
    /**@type {Constraint[]}*/
    constraints: Constraint[];
    /**@type {Index[]}*/
    indexes: Index[];
    constructor(method: null | undefined, name: null | undefined, dialect: any);
    /**
     * @param {String} name
     * @returns {Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes}
     */
    addColumn(name: string): Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes;
    /**
     * @param {String} name
     * @returns {Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes}
     */
    column(name: string): Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes;
    /**
     * @param {String} name
     * @returns {Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes}
     */
    alterColumn(name: string): Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes;
    /**
     * @param {String} name
     * @returns {Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes}
     */
    dropColumn(name: string): Column & Column.PLpgSQLTypes & Column.SQLiteSQLTypes & Column.TSQLTypes;
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