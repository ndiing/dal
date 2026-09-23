/**@typedef {Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes} ColumnTypes*/
export = Column;
import Constraint = require("./constraint.js");
export type Types = {
    sqlitesql: SQLiteSQLTypes;
    plpgsql: PLpgSQLTypes;
    tsql: TSQLTypes;
};
/**
 * @typedef Types
 * @property {SQLiteSQLTypes} sqlitesql
 * @property {PLpgSQLTypes} plpgsql
 * @property {TSQLTypes} tsql
 */
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
    references(table: any, ...columns: any[]): this;
}
export type ColumnTypes = Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes;
//# sourceMappingURL=column.d.ts.map