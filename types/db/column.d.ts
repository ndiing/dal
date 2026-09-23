export = Column;
import Constraint = require("./constraint.js");
export type ColumnTypes = Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes;
/**@typedef {Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes} ColumnTypes*/
declare class Column {
    dialect: any;
    /**@private*/ private _table;
    /**@private*/ private _method;
    /**@private*/ private _name;
    /**@private*/ private _constraint;
    /**@private*/ private _type;
    /**@private*/ private _null;
    /**@private*/ private _notNull;
    /**@private*/ private _identity;
    /**@type {Constraint[]}*/
    constraints: Constraint[];
    constructor(table: null | undefined, method: null | undefined, name: null | undefined, dialect: any);
    type(type: any, params?: any[]): this;
    null(): this;
    notNull(): this;
    identity(seed?: number, increment?: number): this;
    constraint(name?: boolean): this;
    unique(): this;
    primaryKey(): this;
    default(value: any): this;
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
    references(table: any, ...columns: any[]): this;
}
//# sourceMappingURL=column.d.ts.map