declare const _exports: {
    isObject: typeof isObject;
    isPlainObject: typeof isPlainObject;
    isArray: typeof isArray;
    isFunction: typeof isFunction;
    isString: typeof isString;
    isBoolean: typeof isBoolean;
    isNumber: typeof isNumber;
    isEmpty: typeof isEmpty;
    isAsyncFunction: typeof isAsyncFunction;
    QUERY: symbol;
    RAW: symbol;
    CONSTRAINT: symbol;
    requireDriver: typeof requireDriver;
};
export = _exports;
declare const isObject: (any: any) => boolean;
declare const isArray: (any: any) => boolean;
declare const isFunction: (any: any) => boolean;
declare const isString: (any: any) => boolean;
declare const isBoolean: (any: any) => boolean;
declare const isNumber: (any: any) => boolean;
declare const isEmpty: (any: any) => boolean;
declare const isPlainObject: (obj: any) => boolean;
declare const isAsyncFunction: (any: any) => boolean;
declare const DRIVERS: {
    "better-sqlite3": () => any;
    mssql: () => any;
    pg: () => any;
};
/**
 * @param {keyof typeof DRIVERS} driver
 * @returns {ReturnType<typeof DRIVERS[keyof typeof DRIVERS]>}
 */
declare const requireDriver: (driver: keyof typeof DRIVERS) => ReturnType<typeof DRIVERS[keyof typeof DRIVERS]>;
