const Constraint = require("./constraint.js");
const PLpgSQLTypes = require("./types/plpgsql.js");
const SQLiteSQLTypes = require("./types/sqlitesql.js");
const TSQLTypes = require("./types/tsql.js");

const Types = {
    sqlitesql: SQLiteSQLTypes,
    plpgsql: PLpgSQLTypes,
    tsql: TSQLTypes,
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

class Column {
    /**@private*/ _table = null;
    /**@private*/ _method = null;
    /**@private*/ _name = null;
    /**@private*/ _constraint = null;
    /**@private*/ _type = null;
    /**@private*/ _null = null;
    /**@private*/ _notNull = null;
    /**@private*/ _identity = null;

    /**@type {Constraint[]}*/
    constraints = [];

    constructor(table = null, method = null, name = null, dialect) {
        this._table = table;
        this._method = method;
        this._name = name;
        this.dialect = dialect;
        this._constraint = new Constraint(this._table, this._name, null, null);
        this.constraints = [this._constraint];

        const types = Types[this.dialect] ?? PLpgSQLTypes;

        for (const type in types) {
            Object.defineProperty(this, type, {
                value: function () {
                    this._type = types[type](...arguments);
                    return this;
                },
                configurable: true,
                enumerable: false,
                writable: true,
            });
        }
    }

    type(type, params = []) {
        this._type = { type };
        for (let i = 1; i <= params.length; i++) {
            const p = params[i];
            this._type["p" + i] = p;
        }
        return this;
    }

    null() {
        this._null = true;
        return this;
    }

    notNull() {
        this._notNull = true;
        return this;
    }

    identity(seed = 1, increment = 1) {
        this._identity = { seed, increment };
        return this;
    }

    constraint(name = true) {
        this._constraint = new Constraint(this._table, this._name, null, name);
        this.constraints.push(this._constraint);
        return this;
    }

    unique() {
        this._constraint.unique(this._name);
        return this;
    }

    primaryKey() {
        this._constraint.primaryKey(this._name);
        return this;
    }

    default(value) {
        this._constraint.default(value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    check(column, operator, value) {
        this._constraint.check(column, operator, value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    checkNot(column, operator, value) {
        this._constraint.checkNot(column, operator, value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheck(column, operator, value) {
        this._constraint.orCheck(column, operator, value);
        return this;
    }

    /**
     * @param {String|Constraint.ConstraintCallback} column
     * @param {String} operator
     * @param {String|Constraint.ConstraintCallback} value
     * @returns {this}
     */
    orCheckNot(column, operator, value) {
        this._constraint.orCheckNot(column, operator, value);
        return this;
    }

    references(table, ...columns) {
        this._constraint.references(table, ...columns);
        return this;
    }
}

module.exports = Column;
