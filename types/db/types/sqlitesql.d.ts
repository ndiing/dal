/**@typedef {import("../column.js").ColumnTypes} Column*/
export = SQLiteSQLTypes;
export type Column = import("../column.js").ColumnTypes;
declare const SQLiteSQLTypes: {
    /**@returns {Column}*/ int: () => Column;
    /**@returns {Column}*/ tinyInt: () => Column;
    /**@returns {Column}*/ smallInt: () => Column;
    /**@returns {Column}*/ mediumint: () => Column;
    /**@returns {Column}*/ bigInt: () => Column;
    /**@returns {Column}*/ unsignedBigInt: () => Column;
    /**@returns {Column}*/ int2: () => Column;
    /**@returns {Column}*/ int8: () => Column;
    /**@returns {Column}*/ character: (n: any) => Column;
    /**@returns {Column}*/ varChar: (n: any) => Column;
    /**@returns {Column}*/ varyingCharacter: (n: any) => Column;
    /**@returns {Column}*/ nChar: (n: any) => Column;
    /**@returns {Column}*/ nativeCharacter: (n: any) => Column;
    /**@returns {Column}*/ nVarChar: (n: any) => Column;
    /**@returns {Column}*/ clob: () => Column;
    /**@returns {Column}*/ double: () => Column;
    /**@returns {Column}*/ doublePrecision: () => Column;
    /**@returns {Column}*/ float: () => Column;
    /**@returns {Column}*/ decimal: (p: any, s: any) => Column;
    /**@returns {Column}*/ boolean: () => Column;
    /**@returns {Column}*/ date: () => Column;
    /**@returns {Column}*/ dateTime: () => Column;
    /**@returns {Column}*/ integer: () => Column;
    /**@returns {Column}*/ text: () => Column;
    /**@returns {Column}*/ blob: () => Column;
    /**@returns {Column}*/ real: () => Column;
    /**@returns {Column}*/ numeric: () => Column;
};
//# sourceMappingURL=sqlitesql.d.ts.map
