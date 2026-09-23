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
    then(onfulfilled: any, onrejected: any): Promise<any>;
    catch(onrejected: any): Promise<any>;
    finally(onfinally: any): Promise<any>;
}
