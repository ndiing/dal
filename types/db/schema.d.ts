export = Schema;
import Table = require("./table.js");
import Thenable = require("./thenable.js");
export type Types = import("./column.js").Types;
export type TableCallback<T extends keyof Types> = (table: Table<T>) => any;
/**@typedef {import("./column.js").Types} Types*/
/**
 * @template {keyof Types} T
 * @callback TableCallback
 * @param {Table<T>} table
 */
/**
 * @typedef Condition
 * @param {String|import('./constraint.js').ConstraintCallback} column
 * @param {String} operator
 * @param {String|import('./constraint.js').ConstraintCallback} value
 */
/**@template {keyof Types} T*/
declare class Schema<T extends keyof Types> extends Thenable {
    tables: any[];
    /**
     * @param {String} name
     * @param {TableCallback<T>} callback
     * @returns {this}
     */
    createTable(name: string, callback: TableCallback<T>): this;
    /**
     * @param {String} name
     * @param {TableCallback<T>} callback
     * @returns {this}
     */
    alterTable(name: string, callback: TableCallback<T>): this;
    /**
     * @param {String} name
     * @returns {this}
     */
    dropTable(name: string): this;
    /**@private*/
    private _buildConstraintName;
    /**
     * @private
     * @param {Condition} condition
     * @param {Set} columns
     */
    private _buildGrouping;
    /**
     * @private
     * @param {Condition} condition
     * @param {Set} columns
     */
    private _buildCondition;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Set} columns
     */
    private _buildConditions;
    /**@private*/
    private _buildValue;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    private _buildUnique;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    private _buildPrimaryKey;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    private _buildDefault;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    private _buildCheck;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    private _buildForeignKey;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {String} str
     */
    private _buildConstraint;
    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    private _buildConstraints;
    /**@private*/
    private _buildType;
    /**@private*/
    private _buildIdentity;
    /**
     * @private
     * @param {Column} column
     */
    private _buildColumn;
    /**@private*/
    private _buildIndexName;
    /**
     * @private
     * @param {Index} index
     */
    private _buildIndex;
    /**
     * @private
     * @param {Table} table
     * @param {String} str
     */
    private _buildCreateTable;
    /**
     * @private
     * @param {Table} table
     * @param {String} str
     */
    private _buildAlterTable;
    /**
     * @private
     * @param {Table} table
     */
    private _buildDropTable;
    build(): {
        query: string;
    }[];
    /**
     * Description placeholder
     *
     * @param {*} onfulfilled
     * @param {*} onrejected
     * @returns {*}
     */
    then(onfulfilled: any, onrejected: any): any;
}
//# sourceMappingURL=schema.d.ts.map