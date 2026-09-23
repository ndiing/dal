export = Thenable;
declare class Thenable {
    /**@type {import("./client.js")}*/
    client: import("./client.js");
    _transforms: any[];
    constructor(client: any);
    _transform(rows: any): any;
    first(column: any): this;
    count(): this;
    exists(): this;
    pluck(column: any): this;
    /**
     * Description placeholder
     *
     * @param {*} onfulfilled
     * @param {*} onrejected
     * @returns {*}
     */
    then(onfulfilled: any, onrejected: any): any;
    /**
     * Description placeholder
     *
     * @param {*} onrejected
     * @returns {*}
     */
    catch(onrejected: any): any;
    /**
     * Description placeholder
     *
     * @param {*} onfinally
     * @returns {*}
     */
    finally(onfinally: any): any;
}
//# sourceMappingURL=thenable.d.ts.map