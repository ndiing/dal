export = Thenable;
declare class Thenable {
    /**@type {import("./client.js")}*/
    client: import("./client.js");
    /**@private*/ private _transforms;
    constructor(client: any);
    /**@private*/
    private _transform;
    first(column: any): this;
    count(): this;
    exists(): this;
    pluck(column: any): this;
    /**
     * @param {*} onfulfilled
     * @param {*} onrejected
     * @returns {*}
     */
    then(onfulfilled: any, onrejected: any): any;
    /**
     * @param {*} onrejected
     * @returns {*}
     */
    catch(onrejected: any): any;
    /**
     * @param {*} onfinally
     * @returns {*}
     */
    finally(onfinally: any): any;
}
//# sourceMappingURL=thenable.d.ts.map