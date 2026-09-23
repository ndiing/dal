export = Table;
import Column = require("./column.js");
import Constraint = require("./constraint.js");
import Index = require("./index.js");
export type Types = Column.Types;
export type PLpgSQLTypes = import('./types/plpgsql.js');
export type SQLiteSQLTypes = import('./types/sqlitesql.js');
export type TSQLTypes = import('./types/tsql.js');
export type ColumnTypes = Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes;
/**@typedef {Column.Types} Types*/
/**@typedef {import('./types/plpgsql.js')} PLpgSQLTypes*/
/**@typedef {import('./types/sqlitesql.js')} SQLiteSQLTypes*/
/**@typedef {import('./types/tsql.js')} TSQLTypes*/
/**@typedef {Column & PLpgSQLTypes & SQLiteSQLTypes & TSQLTypes} ColumnTypes*/
/**@template {keyof Types} T*/
declare class Table<T extends keyof Types> {
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
     * @returns {ColumnTypes}
     */
    addColumn(name: string): ColumnTypes;
    /**
     *
     * @param {String} name
     * @returns {ColumnTypes}
     */
    column(name: string): ColumnTypes;
    /**
     *
     * @param {String} name
     * @returns {ColumnTypes}
     */
    alterColumn(name: string): ColumnTypes;
    /**
     *
     * @param {String} name
     * @returns {ColumnTypes}
     */
    dropColumn(name: string): ColumnTypes;
    addConstraint(name?: boolean): this;
    constraint(name?: boolean): this;
    dropConstraint(name?: boolean): this;
    unique(...columns: any[]): this;
    primaryKey(...columns: any[]): this;
    default(value: any): this;
    for(column: any): this;
    foreignKey(...columns: any[]): this;
    references(table: any, ...columns: any[]): this;
    createIndex(name?: boolean): Index;
    index(name: any): Index;
    dropIndex(name?: boolean): Index;
}
