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
};
