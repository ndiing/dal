const Table = require("./table.js");
const Thenable = require("./thenable.js");
const { isString, isBoolean, isNumber, RAW, CONSTRAINT, TABLE } = require("./util.js");

/**@typedef {import("./column.js").Types} Types*/

/**
 * @callback TableCallback
 * @param {Table} table
 */

/**
 * @typedef Condition
 * @param {String|import('./constraint.js').ConstraintCallback} column
 * @param {String} operator
 * @param {String|import('./constraint.js').ConstraintCallback} value
 */


class Schema extends Thenable {
    /**@type {Table[]}*/
    tables = [];

    /**
     * @param {String} name
     * @param {TableCallback} callback
     * @returns {this}
     */
    createTable(name, callback) {
        const table = new Table("CREATE", name, this.client.dialect);
        callback(table);
        this.tables.push(table);
        return this;
    }

    /**
     * @param {String} name
     * @param {TableCallback} callback
     * @returns {this}
     */
    alterTable(name, callback) {
        const table = new Table("ALTER", name, this.client.dialect);
        callback(table);
        this.tables.push(table);
        return this;
    }

    /**
     * @param {String} name
     * @returns {this}
     */
    dropTable(name) {
        const table = new Table("DROP", name, this.client.dialect);
        this.tables.push(table);
        return this;
    }

    /**@private*/
    _buildConstraintName(_name, _computedName) {
        if (isString(_name)) {
            return _name;
        }
        if (isBoolean(_name) && _name) {
            return _computedName;
        }
        return null;
    }

    /**
     * @private
     * @param {Condition} condition
     * @param {Set} columns
     */
    _buildGrouping(constraint, columns) {
        return `(${this._buildConditions(constraint, columns)})`;
    }

    /**
     * @private
     * @param {Condition} condition
     * @param {Set} columns
     */
    _buildCondition({ column, operator, value } = {}, columns) {
        if (Array.isArray(value)) {
            value = value.map((value) => this._buildValue(value));
        } else {
            value = this._buildValue(value);
        }

        if (column && column[CONSTRAINT]) {
            column = this._buildGrouping(column, columns);
        } else {
            columns.add(column);
        }
        if (["IN", "NOT IN"].includes(operator?.toUpperCase())) {
            value = `(${value.join(", ")})`;
        } else if (["BETWEEN", "NOT BETWEEN"].includes(operator?.toUpperCase())) {
            value = value.join(" AND ");
        }

        const part = [];
        if (column !== undefined) {
            part.push(column);
        }
        if (operator !== undefined) {
            part.push(operator);
        }
        if (value !== undefined) {
            part.push(value);
        }
        return part.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Set} columns
     */
    _buildConditions(constraint, columns) {
        return constraint._check
            .map(({ conjunction, type, condition }) => {
                const arr = [];
                if (conjunction) {
                    arr.push(conjunction);
                }
                if (type) {
                    arr.push(type);
                }
                if (condition) {
                    arr.push(this._buildCondition(condition, columns));
                }
                return arr.join(" ");
            })
            .join(" ");
    }

    /**@private*/
    _buildValue(value) {
        if (value && value[RAW]) {
            const result = value.build();
            return result.query;
        }

        if (isString(value)) {
            return this.client.escapeLiteral(value);
        }

        return value;
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    _buildUnique(constraint, block) {
        const arr = [];
        const name = this._buildConstraintName(constraint._name, ["UQ", constraint._table, constraint._unique].flat().join("_"));
        if (name) {
            arr.push("CONSTRAINT", name);
        }
        if (constraint._method === null || constraint._method === "ADD") {
            arr.push("UNIQUE");
            if (block) {
                arr.push(`(${constraint._unique.join(", ")})`);
            }
        }
        return arr.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    _buildPrimaryKey(constraint, block) {
        const arr = [];
        const name = this._buildConstraintName(constraint._name, ["PK", constraint._table, constraint._primaryKey].flat().join("_"));
        if (name) {
            arr.push("CONSTRAINT", name);
        }
        if (constraint._method === null || constraint._method === "ADD") {
            arr.push("PRIMARY KEY");
            if (block) {
                arr.push(`(${constraint._primaryKey.join(", ")})`);
            }
        }
        return arr.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    _buildDefault(constraint, block) {
        const arr = [];
        const name = this._buildConstraintName(constraint._name, ["DF", constraint._table, constraint._for].flat().join("_"));
        if (name) {
            arr.push("CONSTRAINT", name);
        }
        if (constraint._method === null || constraint._method === "ADD") {
            arr.push("DEFAULT", this._buildValue(constraint._default));
            if (block) {
                arr.push("FOR", constraint._for);
            }
        }
        return arr.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    _buildCheck(constraint, block) {
        const arr = [];
        const columns = new Set();
        const str = this._buildConditions(constraint, columns);
        const name = this._buildConstraintName(constraint._name, ["CK", constraint._table, ...columns].flat().join("_"));
        if (name) {
            arr.push("CONSTRAINT", name);
        }
        if (constraint._method === null || constraint._method === "ADD") {
            arr.push("CHECK", `(${str})`);
        }
        return arr.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    _buildForeignKey(constraint, block) {
        const arr = [];
        const name = this._buildConstraintName(constraint._name, ["FK", constraint._table, constraint._foreignKey, Object.values(constraint._references).flat()].flat().join("_"));
        if (name) {
            arr.push("CONSTRAINT", name);
        }
        if (constraint._method === null || constraint._method === "ADD") {
            if (block) {
                arr.push("FOREIGN KEY", `(${constraint._foreignKey.join(", ")})`);
            }
            arr.push("REFERENCES", constraint._references.table, `(${constraint._references.columns.join(", ")})`);

            if (constraint._onUpdate) {
                arr.push("ON UPDATE", constraint._onUpdate);
            }
            if (constraint._onDelete) {
                arr.push("ON DELETE", constraint._onDelete);
            }
        }
        return arr.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {String} str
     */
    _buildConstraint(constraint, str) {
        const arr = [];
        if (constraint._method) {
            arr.push(constraint._method);
        }
        arr.push(str);
        return arr.join(" ");
    }

    /**
     * @private
     * @param {import('./constraint.js')} constraint
     * @param {Boolean} block
     */
    _buildConstraints(constraint, block = false) {
        const arr = [];
        if (constraint._unique !== null) arr.push(this._buildConstraint(constraint, this._buildUnique(constraint, block)));
        if (constraint._primaryKey !== null) arr.push(this._buildConstraint(constraint, this._buildPrimaryKey(constraint, block)));
        if (constraint._default !== null) arr.push(this._buildConstraint(constraint, this._buildDefault(constraint, block)));
        if (constraint._check.length > 0) arr.push(this._buildConstraint(constraint, this._buildCheck(constraint, block)));
        if (constraint._foreignKey !== null) arr.push(this._buildConstraint(constraint, this._buildForeignKey(constraint, block)));
        if (block) {
            return arr.join(", ");
        }
        return arr.join(" ");
    }

    /**@private*/
    _buildType(_type) {
        const { type, fields, ...rest } = _type;
        const arr = [type];
        if (fields) arr.push(fields);
        const params = Object.values(rest).filter(Boolean);
        if (params.length) arr.push(`(${params.join(", ")})`);
        return arr.join("");
    }

    /**@private*/
    _buildIdentity(_identity) {
        return "GENERATED ALWAYS AS IDENTITY";
    }

    /**
     * @private
     * @param {Column} column
     */
    _buildColumn(column) {
        const arr = [];

        if (column._method === "ALTER") {
            const part = [];
            if (column._type) {
                part.push([column._method, "COLUMN", column._name, "TYPE", this._buildType(column._type)].join(" "));
            }
            if (column._notNull) {
                part.push([column._method, "COLUMN", column._name, "SET", "NOT NULL"].join(" "));
            } else if (column._null) {
                part.push([column._method, "COLUMN", column._name, "DROP", "NOT NULL"].join(" "));
            }
            arr.push(part.join(", "));
        } else if (column._method === null || column._method === "ADD" || column._method === "DROP") {
            if (column._method) {
                arr.push(column._method, "COLUMN");
            }
            arr.push(column._name);
            if (column._method === null || column._method === "ADD") {
                if (column._type) {
                    arr.push(this._buildType(column._type));
                }

                if (column._notNull) {
                    arr.push("NOT NULL");
                } else if (column._null) {
                    arr.push("NULL");
                }
            }
            if (column._method === null || column._method === "ADD") {
                for (const constraint of column.constraints) {
                    if (!constraint.used) {
                        continue;
                    }
                    arr.push(this._buildConstraints(constraint, false));
                }

                if (column._identity) {
                    arr.push(this._buildIdentity(column._identity));
                }
            }
        }
        return arr.join(" ");
    }

    /**@private*/
    _buildIndexName(_name, _computedName) {
        if (isString(_name)) {
            return _name;
        }
        if (isBoolean(_name) && _name) {
            return _computedName;
        }
        return null;
    }

    /**
     * @private
     * @param {Index} index
     */
    _buildIndex(index) {
        const arr = [];
        arr.push(index._method, "INDEX");
        const name = this._buildIndexName(index._name, ["IX", index._table, index._on].flat().join("_"));
        if (name) {
            arr.push(name);
        }
        if (index._method === "CREATE") {
            arr.push("ON", index._table, `(${index._on.join(", ")})`);
        }
        return arr.join(" ");
    }

    /**
     * @private
     * @param {Table} table
     * @param {String} str
     */
    _buildCreateTable(table, str) {
        return [table._method, "TABLE", table._name, `(${str})`].join(" ");
    }

    /**
     * @private
     * @param {Table} table
     * @param {String} str
     */
    _buildAlterTable(table, str) {
        return [table._method, "TABLE", table._name, str].join(" ");
    }

    /**
     * @private
     * @param {Table} table
     */
    _buildDropTable(table) {
        return [table._method, "TABLE", table._name].join(" ");
    }

    build() {
        const arr = [];
        for (const table of this.tables) {
            const part = [];
            for (const column of table.columns) {
                part.push(this._buildColumn(column));
            }
            for (const constraint of table.constraints) {
                if (!constraint.used) {
                    continue;
                }
                part.push(this._buildConstraints(constraint, true));
            }
            const str = part.join(", ");

            if (table._method === "CREATE") {
                arr.push({ query: `${this._buildCreateTable(table, str)};` });
            } else if (table._method === "ALTER") {
                arr.push({ query: `${this._buildAlterTable(table, str)};` });
            } else if (table._method === "DROP") {
                arr.push({ query: `${this._buildDropTable(table)};` });
            }

            for (const index of table.indexes) {
                arr.push({ query: `${this._buildIndex(index)};` });
            }
        }
        return arr;
    }

    
    /**
     * Description placeholder
     *
     * @param {*} onfulfilled 
     * @param {*} onrejected 
     * @returns {*} 
     */
    then(onfulfilled, onrejected) {
        return Promise.resolve(
            this.client.transaction(async (client) => {
                const results = [];
                for (const { query } of this.build()) {
                    if (this.client.debug) {
                        console.log({ query });
                    }
                    const result = await client.execute(query);
                    results.push(result);
                }
                return results;
            }),
        ).then(onfulfilled, onrejected);
    }
}

module.exports = Schema;
