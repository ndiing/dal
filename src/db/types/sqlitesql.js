const SQLiteSQLTypes = {
    int: () => ({ type: "INT" }),
    tinyInt: () => ({ type: "TINYINT" }),
    smallInt: () => ({ type: "SMALLINT" }),
    mediumint: () => ({ type: "MEDIUMINT" }),
    bigInt: () => ({ type: "BIGINT" }),
    unsignedBigInt: () => ({ type: "UNSIGNED BIG INT" }),
    int2: () => ({ type: "INT2" }),
    int8: () => ({ type: "INT8" }),

    character: (n) => ({ type: "CHARACTER", n }),
    varChar: (n) => ({ type: "VARCHAR", n }),
    varyingCharacter: (n) => ({ type: "VARYING CHARACTER", n }),
    nChar: (n) => ({ type: "NCHAR", n }),
    nativeCharacter: (n) => ({ type: "NATIVE CHARACTER", n }),
    nVarChar: (n) => ({ type: "NVARCHAR", n }),
    clob: () => ({ type: "CLOB" }),

    double: () => ({ type: "DOUBLE" }),
    doublePrecision: () => ({ type: "DOUBLE PRECISION" }),
    float: () => ({ type: "FLOAT" }),

    decimal: (p, s) => ({ type: "DECIMAL", p, s }),
    boolean: () => ({ type: "BOOLEAN" }),
    date: () => ({ type: "DATE" }),
    dateTime: () => ({ type: "DATETIME" }),

    integer: () => ({ type: "INTEGER" }),
    text: () => ({ type: "TEXT" }),
    blob: () => ({ type: "BLOB" }),
    real: () => ({ type: "REAL" }),
    numeric: () => ({ type: "NUMERIC" }),
};
module.exports = SQLiteSQLTypes;
