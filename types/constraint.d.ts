export = Constraint;
import { isFunction, CONSTRAINT } from "./util";
export type ConstraintCallback = (constraint: Constraint) => any;
/**
 * @callback ConstraintCallback
 * @param {Constraint} constraint
 */
declare class Constraint {
    [CONSTRAINT]: boolean;
    /**@private*/ private _table;
    /**@private*/ private _column;
    /**@private*/ private _method;
    /**@private*/ private _name;
    /**@private*/ private _unique;
    /**@private*/ private _primaryKey;
    /**@private*/ private _default;
    /**@private*/ private _for;
    /**@private*/ private _check;
    /**@private*/ private _foreignKey;
    /**@private*/ private _references;
    /**@private*/ private _onUpdate;
    /**@private*/ private _onDelete;
    constructor(table?: null, column?: null, method?: null, name?: null);
    get used(): boolean;
    unique(...columns: any[]): this;
    primaryKey(...columns: any[]): this;
    default(value: any): this;
    for(column: any): this;
    /**@private*/
    private _createGrouping;
    /**@private*/
    private _createCondition;
    /**@private*/
    private _setCheck;
    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    check(column: string | ConstraintCallback, operator: string, value: string | ConstraintCallback): this;
    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    checkNot(column: string | ConstraintCallback, operator: string, value: string | ConstraintCallback): this;
    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    orCheck(column: string | ConstraintCallback, operator: string, value: string | ConstraintCallback): this;
    /**
     * @param {String|ConstraintCallback} column
     * @param {String} operator
     * @param {String|ConstraintCallback} value
     * @returns {this}
     */
    orCheckNot(column: string | ConstraintCallback, operator: string, value: string | ConstraintCallback): this;
    foreignKey(...columns: any[]): this;
    references(table: any, ...columns: any[]): this;
    onUpdate(action: any): void;
    onDelete(action: any): void;
}
//# sourceMappingURL=constraint.d.ts.map