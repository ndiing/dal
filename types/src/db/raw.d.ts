export = Raw;
import Thenable = require("./thenable.js");
import { isArray, isObject, isPlainObject, RAW, QUERY } from "./util.js";
declare class Raw extends Thenable {
    [RAW]: boolean;
    /**@private*/ private _query;
    /**@private*/ private _params;
    /**@private*/ private _counter;
    query: null;
    params: null;
    used: null;
    constructor(client: any);
    set(query?: null, ...params: any[]): this;
    /**@private*/
    private _setParams;
    _buildRawQuery(value: any): any;
    build(): never[] | {
        query: null;
        params: null;
    };
}
