const isObject = (any) => toString.call(any) === "[object Object]";
const isArray = (any) => toString.call(any) === "[object Array]";
const isFunction = (any) => toString.call(any) === "[object Function]";
const isString = (any) => toString.call(any) === "[object String]";
const isBoolean = (any) => toString.call(any) === "[object Boolean]";
const isNumber = (any) => toString.call(any) === "[object Number]";
const isEmpty = (any) => any == null || (typeof any === "string" && any.trim() === "");
const isPlainObject = (obj) => {
    if (obj === null || typeof obj !== "object") {
        return false;
    }
    const proto = Object.getPrototypeOf(obj);
    return proto === Object.prototype || proto === null;
};
const isAsyncFunction = (any) => toString.call(any) === "[object AsyncFunction]";

const QUERY = Symbol.for("Query");
const RAW = Symbol.for("Raw");
const CONSTRAINT = Symbol.for("Constraint");

const DRIVERS = {
    "better-sqlite3": () => require("better-sqlite3"),
    mssql: () => require("mssql/msnodesqlv8"),
    pg: () => require("pg"),
};
const driverMap = new Map();
/**
 * @param {keyof typeof DRIVERS} driver
 * @returns {ReturnType<typeof DRIVERS[keyof typeof DRIVERS]>}
 */
const requireDriver = (driver) => {
    if (!driverMap.has(driver)) {
        driverMap.set(driver, DRIVERS[driver]());
    }
    return driverMap.get(driver);
};

module.exports = {
    isObject,
    isPlainObject,
    isArray,
    isFunction,
    isString,
    isBoolean,
    isNumber,
    isEmpty,
    isAsyncFunction,

    QUERY,
    RAW,
    CONSTRAINT,

    requireDriver,
};
