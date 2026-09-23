export = Column;
import Constraint = require("./constraint.js");
export type SQLiteSQLTypes = {
    int: () => Column;
    tinyInt: () => Column;
    smallInt: () => Column;
    mediumint: () => Column;
    bigInt: () => Column;
    unsignedBigInt: () => Column;
    int2: () => Column;
    int8: () => Column;
    character: () => Column;
    varChar: () => Column;
    varyingCharacter: () => Column;
    nChar: () => Column;
    nativeCharacter: () => Column;
    nVarChar: () => Column;
    clob: () => Column;
    double: () => Column;
    doublePrecision: () => Column;
    float: () => Column;
    decimal: () => Column;
    boolean: () => Column;
    date: () => Column;
    dateTime: () => Column;
    integer: () => Column;
    text: () => Column;
    blob: () => Column;
    real: () => Column;
    numeric: () => Column;
};
export type PLpgSQLTypes = {
    bigInt: () => Column;
    int8: () => Column;
    bigserial: () => Column;
    serial8: () => Column;
    bit: () => Column;
    bitVarying: () => Column;
    varBit: () => Column;
    boolean: () => Column;
    bool: () => Column;
    box: () => Column;
    bytea: () => Column;
    character: () => Column;
    char: () => Column;
    characterVarying: () => Column;
    varChar: () => Column;
    cidr: () => Column;
    circle: () => Column;
    date: () => Column;
    doublePrecision: () => Column;
    float: () => Column;
    float8: () => Column;
    inet: () => Column;
    integer: () => Column;
    int: () => Column;
    int4: () => Column;
    interval: () => Column;
    intervalYear: () => Column;
    intervalMonth: () => Column;
    intervalDay: () => Column;
    intervalHour: () => Column;
    intervalMinute: () => Column;
    intervalSecond: () => Column;
    intervalYearToMonth: () => Column;
    intervalDayToHour: () => Column;
    intervalDayToMinute: () => Column;
    intervalDayToSecond: () => Column;
    intervalHourToMinute: () => Column;
    intervalHourToSecond: () => Column;
    intervalMinuteToSecond: () => Column;
    json: () => Column;
    jsonb: () => Column;
    line: () => Column;
    lseg: () => Column;
    macaddr: () => Column;
    macaddr8: () => Column;
    money: () => Column;
    numeric: () => Column;
    decimal: () => Column;
    path: () => Column;
    pgLsn: () => Column;
    pgSnapshot: () => Column;
    point: () => Column;
    polygon: () => Column;
    real: () => Column;
    float4: () => Column;
    smallInt: () => Column;
    int2: () => Column;
    smallserial: () => Column;
    serial2: () => Column;
    serial: () => Column;
    serial4: () => Column;
    text: () => Column;
    time: () => Column;
    timeWithTimeZone: () => Column;
    timetz: () => Column;
    timestamp: () => Column;
    timestampWithTimeZone: () => Column;
    timestamptz: () => Column;
    tsquery: () => Column;
    tsvector: () => Column;
    txidSnapshot: () => Column;
    uuid: () => Column;
    xml: () => Column;
};
export type TSQLTypes = {
    varChar: () => Column;
    nVarChar: () => Column;
    text: () => Column;
    int: () => Column;
    bigInt: () => Column;
    tinyInt: () => Column;
    smallInt: () => Column;
    bit: () => Column;
    float: () => Column;
    numeric: () => Column;
    decimal: () => Column;
    real: () => Column;
    date: () => Column;
    dateTime: () => Column;
    dateTime2: () => Column;
    dateTimeOffset: () => Column;
    smallDateTime: () => Column;
    time: () => Column;
    uniqueIdentifier: () => Column;
    smallMoney: () => Column;
    money: () => Column;
    binary: () => Column;
    varBinary: () => Column;
    image: () => Column;
    xml: () => Column;
    char: () => Column;
    nChar: () => Column;
    nText: () => Column;
    tvp: () => Column;
    udt: () => Column;
    geography: () => Column;
    geometry: () => Column;
    variant: () => Column;
};
/**
 * @typedef SQLiteSQLTypes
 * @property {() => Column} int
 * @property {() => Column} tinyInt
 * @property {() => Column} smallInt
 * @property {() => Column} mediumint
 * @property {() => Column} bigInt
 * @property {() => Column} unsignedBigInt
 * @property {() => Column} int2
 * @property {() => Column} int8
 * @property {() => Column} character
 * @property {() => Column} varChar
 * @property {() => Column} varyingCharacter
 * @property {() => Column} nChar
 * @property {() => Column} nativeCharacter
 * @property {() => Column} nVarChar
 * @property {() => Column} clob
 * @property {() => Column} double
 * @property {() => Column} doublePrecision
 * @property {() => Column} float
 * @property {() => Column} decimal
 * @property {() => Column} boolean
 * @property {() => Column} date
 * @property {() => Column} dateTime
 * @property {() => Column} integer
 * @property {() => Column} text
 * @property {() => Column} blob
 * @property {() => Column} real
 * @property {() => Column} numeric
 */
/**
 * @typedef PLpgSQLTypes
 * @property {() => Column} bigInt
 * @property {() => Column} int8
 * @property {() => Column} bigserial
 * @property {() => Column} serial8
 * @property {() => Column} bit
 * @property {() => Column} bitVarying
 * @property {() => Column} varBit
 * @property {() => Column} boolean
 * @property {() => Column} bool
 * @property {() => Column} box
 * @property {() => Column} bytea
 * @property {() => Column} character
 * @property {() => Column} char
 * @property {() => Column} characterVarying
 * @property {() => Column} varChar
 * @property {() => Column} cidr
 * @property {() => Column} circle
 * @property {() => Column} date
 * @property {() => Column} doublePrecision
 * @property {() => Column} float
 * @property {() => Column} float8
 * @property {() => Column} inet
 * @property {() => Column} integer
 * @property {() => Column} int
 * @property {() => Column} int4
 * @property {() => Column} interval
 * @property {() => Column} intervalYear
 * @property {() => Column} intervalMonth
 * @property {() => Column} intervalDay
 * @property {() => Column} intervalHour
 * @property {() => Column} intervalMinute
 * @property {() => Column} intervalSecond
 * @property {() => Column} intervalYearToMonth
 * @property {() => Column} intervalDayToHour
 * @property {() => Column} intervalDayToMinute
 * @property {() => Column} intervalDayToSecond
 * @property {() => Column} intervalHourToMinute
 * @property {() => Column} intervalHourToSecond
 * @property {() => Column} intervalMinuteToSecond
 * @property {() => Column} json
 * @property {() => Column} jsonb
 * @property {() => Column} line
 * @property {() => Column} lseg
 * @property {() => Column} macaddr
 * @property {() => Column} macaddr8
 * @property {() => Column} money
 * @property {() => Column} numeric
 * @property {() => Column} decimal
 * @property {() => Column} path
 * @property {() => Column} pgLsn
 * @property {() => Column} pgSnapshot
 * @property {() => Column} point
 * @property {() => Column} polygon
 * @property {() => Column} real
 * @property {() => Column} float4
 * @property {() => Column} smallInt
 * @property {() => Column} int2
 * @property {() => Column} smallserial
 * @property {() => Column} serial2
 * @property {() => Column} serial
 * @property {() => Column} serial4
 * @property {() => Column} text
 * @property {() => Column} time
 * @property {() => Column} timeWithTimeZone
 * @property {() => Column} timetz
 * @property {() => Column} timestamp
 * @property {() => Column} timestampWithTimeZone
 * @property {() => Column} timestamptz
 * @property {() => Column} tsquery
 * @property {() => Column} tsvector
 * @property {() => Column} txidSnapshot
 * @property {() => Column} uuid
 * @property {() => Column} xml
 */
/**
 * @typedef TSQLTypes
 * @property {() => Column} varChar
 * @property {() => Column} nVarChar
 * @property {() => Column} text
 * @property {() => Column} int
 * @property {() => Column} bigInt
 * @property {() => Column} tinyInt
 * @property {() => Column} smallInt
 * @property {() => Column} bit
 * @property {() => Column} float
 * @property {() => Column} numeric
 * @property {() => Column} decimal
 * @property {() => Column} real
 * @property {() => Column} date
 * @property {() => Column} dateTime
 * @property {() => Column} dateTime2
 * @property {() => Column} dateTimeOffset
 * @property {() => Column} smallDateTime
 * @property {() => Column} time
 * @property {() => Column} uniqueIdentifier
 * @property {() => Column} smallMoney
 * @property {() => Column} money
 * @property {() => Column} binary
 * @property {() => Column} varBinary
 * @property {() => Column} image
 * @property {() => Column} xml
 * @property {() => Column} char
 * @property {() => Column} nChar
 * @property {() => Column} nText
 * @property {() => Column} tvp
 * @property {() => Column} udt
 * @property {() => Column} geography
 * @property {() => Column} geometry
 * @property {() => Column} variant
 */
declare class Column {
    dialect: any;
    /**@private*/ private _table;
    /**@private*/ private _method;
    /**@private*/ private _name;
    /**@private*/ private _constraint;
    /**@private*/ private _type;
    /**@private*/ private _null;
    /**@private*/ private _notNull;
    /**@private*/ private _identity;
    /**@type {Constraint[]}*/
    constraints: Constraint[];
    constructor(table: null | undefined, method: null | undefined, name: null | undefined, dialect: any);
    type(type: any, params?: any[]): this;
    null(): this;
    notNull(): this;
    identity(seed?: number, increment?: number): this;
    constraint(name?: boolean): this;
    unique(): this;
    primaryKey(): this;
    default(value: any): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    check(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    checkNot(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheck(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheckNot(column: string | Constraint.ConstraintCallback, operator: string, value: string | Constraint.ConstraintCallback): this;
    references(table: any, ...columns: any[]): this;
}
//# sourceMappingURL=column.d.ts.map