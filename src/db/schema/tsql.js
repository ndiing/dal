const Schema = require("../schema");

class TSQLSchema extends Schema {
    /**@type {Schema['_buildConstraint']}*/
    _buildConstraint(constraint, str) {
        const arr = [];
        if (constraint._method && constraint._method !== "ADD") {
            arr.push(constraint._method);
        }
        arr.push(str);
        return arr.join(" ");
    }

    /**@type {Schema['_buildIdentity']}*/
    _buildIdentity(_identity) {
        return `IDENTITY(${Object.values(_identity).join(", ")})`;
    }

    /**@type {Schema['_buildColumn']}*/
    _buildColumn(column) {
        const arr = [];

        if (column._method && column._method !== "ADD") {
            arr.push(column._method, "COLUMN");
        }
        arr.push(column._name);
        if (column._method === null || column._method === "ADD" || column._method === "ALTER") {
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
        return arr.join(" ");
    }

    build() {
        const arr = [];
        for (const table of this.tables) {
            const part = [];
            const addPart = [];
            for (const column of table.columns) {
                if (column._method === "ALTER") {
                    const str = this._buildColumn(column);
                    arr.push({
                        query: `${this._buildAlterTable(table, str)};`,
                    });
                } else if (column._method === "ADD") {
                    const str = this._buildColumn(column);
                    addPart.push(str);
                } else {
                    part.push(this._buildColumn(column));
                }
            }
            for (const constraint of table.constraints) {
                if (!constraint.used) {
                    continue;
                }
                if (constraint._method === "ADD") {
                    const str = [this._buildConstraints(constraint, true)].join(" ");
                    addPart.push(str);
                } else {
                    part.push(this._buildConstraints(constraint, true));
                }
            }

            if (addPart.length) {
                part.push(["ADD", addPart.join(", ")].join(" "));
            }

            const str = part.join(", ");

            if (table._method === "CREATE") {
                arr.push({ query: `${this._buildCreateTable(table, str)};` });
            } else if (table._method === "ALTER" && part.length) {
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
}

module.exports = TSQLSchema;
