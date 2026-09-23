export = TSQLQuery;
import Query = require("../query.js");
declare class TSQLQuery extends Query {
    _applyInsert(arr: any): void;
    _applyTop(arr: any): void;
    _applyUpdate(arr: any): void;
    _applySelect(arr: any): void;
    _applyFrom(arr: any): void;
    _applyWhere(arr: any): void;
    _applyOffset(arr: any): void;
    _applyLimit(arr: any): void;
    _applyReturning(arr: any): void;
    build(): {
        query: any;
        params: null;
    };
}
