/**@typedef {import("../column.js").ColumnTypes} Column*/

const SQLiteSQLTypes = {
    /**@returns {Column}*/ int: () => ({ type: "INT" }),
    /**@returns {Column}*/ tinyInt: () => ({ type: "TINYINT" }),
    /**@returns {Column}*/ smallInt: () => ({ type: "SMALLINT" }),
    /**@returns {Column}*/ mediumint: () => ({ type: "MEDIUMINT" }),
    /**@returns {Column}*/ bigInt: () => ({ type: "BIGINT" }),
    /**@returns {Column}*/ unsignedBigInt: () => ({ type: "UNSIGNED BIG INT" }),
    /**@returns {Column}*/ int2: () => ({ type: "INT2" }),
    /**@returns {Column}*/ int8: () => ({ type: "INT8" }),

    /**@returns {Column}*/ character: (n) => ({ type: "CHARACTER", n }),
    /**@returns {Column}*/ varChar: (n) => ({ type: "VARCHAR", n }),
    /**@returns {Column}*/ varyingCharacter: (n) => ({ type: "VARYING CHARACTER", n }),
    /**@returns {Column}*/ nChar: (n) => ({ type: "NCHAR", n }),
    /**@returns {Column}*/ nativeCharacter: (n) => ({ type: "NATIVE CHARACTER", n }),
    /**@returns {Column}*/ nVarChar: (n) => ({ type: "NVARCHAR", n }),
    /**@returns {Column}*/ clob: () => ({ type: "CLOB" }),

    /**@returns {Column}*/ double: () => ({ type: "DOUBLE" }),
    /**@returns {Column}*/ doublePrecision: () => ({ type: "DOUBLE PRECISION" }),
    /**@returns {Column}*/ float: () => ({ type: "FLOAT" }),

    /**@returns {Column}*/ decimal: (p, s) => ({ type: "DECIMAL", p, s }),
    /**@returns {Column}*/ boolean: () => ({ type: "BOOLEAN" }),
    /**@returns {Column}*/ date: () => ({ type: "DATE" }),
    /**@returns {Column}*/ dateTime: () => ({ type: "DATETIME" }),

    /**@returns {Column}*/ integer: () => ({ type: "INTEGER" }),
    /**@returns {Column}*/ text: () => ({ type: "TEXT" }),
    /**@returns {Column}*/ blob: () => ({ type: "BLOB" }),
    /**@returns {Column}*/ real: () => ({ type: "REAL" }),
    /**@returns {Column}*/ numeric: () => ({ type: "NUMERIC" }),
};
module.exports = SQLiteSQLTypes;
