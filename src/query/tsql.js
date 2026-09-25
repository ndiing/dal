const Query = require("../query.js");
const Raw = require("../raw.js");
const { RAW, QUERY } = require("../util.js");

class TSQLQuery extends Query {
    _applyInsert(arr) {
        let query;
        if (this._placeholders !== null) {
            const raw = this.client.raw(this._placeholders.map((value) => `(${(this._columns ? this._columns.map((column) => `?${column}`) : value.map((_value) => "?")).join(", ")})`).join(", "), this._values);
            query = this._buildRawQuery(raw);
        }
        if (this._onConflict !== null) {
            const _onConflict = this._onConflict !== null ? this._onConflict : this._columns;
            const _doUpdate = this._doUpdate !== null ? this._doUpdate : this._columns;
            arr.push(`MERGE INTO ${this._insert} WITH (HOLDLOCK) AS target`);
            arr.push(`USING (VALUES ${query}) AS source (${this._columns.join(", ")})`);
            arr.push(`ON ${_onConflict.map((column) => [`target.${column}`, `source.${column}`].join(" = ")).join(" AND ")}`);
            if (this._doUpdate !== null) {
                arr.push(`WHEN MATCHED`);
                if (this._where.length) this._applyWhere(arr);
                arr.push(`THEN`);
                arr.push(`UPDATE SET ${_doUpdate.map((column) => [`target.${column}`, `source.${column}`].join(" = ")).join(", ")}`);
            }
            arr.push(`WHEN NOT MATCHED THEN`);
            arr.push("INSERT");
            arr.push(`(${this._columns.map((column) => column).join(", ")})`);
            arr.push("VALUES");
            arr.push(`(${this._columns.map((column) => `source.${column}`).join(", ")})`);
            if (this._returning !== null) this._applyReturning(arr);
        } else {
            arr.push("INSERT");
            arr.push("INTO");
            arr.push(this._insert);
            if (this._columns !== null) {
                arr.push(`(${this._columns.map((column) => column).join(", ")})`);
            }
            if (this._returning !== null) this._applyReturning(arr);
            if (this._default !== null) {
                arr.push("DEFAULT");
                arr.push("VALUES");
            }
            if (this._placeholders !== null) {
                arr.push("VALUES");
                arr.push(query);
            }
        }
    }

    _applyTop(arr) {
        const raw = this.client.raw("TOP (?limit)", [this._limit]);
        arr.push(this._buildRawQuery(raw));
    }

    _applyUpdate(arr) {
        arr.push("UPDATE");
        if (this._limit !== null && this._offset === null) {
            this._applyTop(arr);
        }
        arr.push(this._update, "SET");
        const raw = this.client.raw(
            this._columns
                .map((column, index) => {
                    const value = this._values[index];
                    let placeholder = "?" + column;
                    if (value && (value[RAW] || value[QUERY])) {
                        placeholder = this._buildRawQuery(value);
                    }

                    return [column, placeholder].join(" = ");
                })
                .join(", "),
            this._values,
        );
        arr.push(this._buildRawQuery(raw));
        if (this._returning !== null) this._applyReturning(arr);
    }

    _applySelect(arr) {
        arr.push("SELECT");
        if (this._limit !== null && this._offset === null) {
            this._applyTop(arr);
        }
        arr.push(
            this._select
                .map((column) => {
                    if (column && (column[RAW] || column[QUERY])) {
                        return this._buildRawQuery(column);
                    }
                    return column;
                })
                .join(", "),
        );
    }

    _applyFrom(arr) {
        arr.push("FROM");
        arr.push(this._buildRawQuery(this._from));
        if (this._delete !== null && this._returning !== null) {
            this._applyReturning(arr);
        }
    }

    _applyWhere(arr) {
        const str = this._subquery && this._select === null ? "" : this._onConflict !== null ? "AND" : "WHERE";
        if (str) {
            arr.push(str);
        }
        arr.push(
            this._where
                .map(({ conjunction, type, condition }) => {
                    const arr = [];
                    if (conjunction) {
                        arr.push(conjunction);
                    }
                    if (type) {
                        arr.push(type);
                    }
                    arr.push(this._buildCondition(condition));
                    return arr.join(" ");
                })
                .join(" "),
        );
    }

    _applyOffset(arr) {
        const raw = this.client.raw("OFFSET ?offset ROWS", [this._offset]);
        arr.push(this._buildRawQuery(raw));
    }

    _applyLimit(arr) {
        const raw = this.client.raw("FETCH NEXT ?limit ROWS ONLY", [this._limit]);
        arr.push(this._buildRawQuery(raw));
    }

    _applyReturning(arr) {
        arr.push("OUTPUT");

        let virtual;
        if (this._insert) {
            virtual = ["INSERTED"];
        } else if (this._update || this._onConflict) {
            virtual = ["INSERTED", "DELETED"];
        } else if (this._delete) {
            virtual = ["DELETED"];
        }

        arr.push(this._returning.map((column) => virtual.map((table) => [table, column].join("."))).join(", "));
    }

    build() {
        const arr = [];

        if (this._with.length) this._applyWith(arr);
        if (this._withRecursive.length) this._applyWithRecursive(arr);

        if (this._insert !== null) this._applyInsert(arr);
        if (this._update !== null) this._applyUpdate(arr);
        if (this._delete !== null) this._applyDelete(arr);

        if (this._select !== null) this._applySelect(arr);
        if (this._from !== null) this._applyFrom(arr);
        if (this._join.length) this._applyJoin(arr);
        if (this._on.length) this._applyOn(arr);
        if (this._where.length && this._onConflict === null) this._applyWhere(arr);
        if (this._groupBy.length) this._applyGroupBy(arr);
        if (this._having.length) this._applyHaving(arr);
        if (this._union.length) this._applyUnion(arr);

        if (this._offset !== null && !this._orderBy.length) {
            this.orderBy("(SELECT NULL)");
        }
        if (this._orderBy.length) this._applyOrderBy(arr);

        if (this._offset !== null) this._applyOffset(arr);
        if (this._offset !== null && this._limit !== null) this._applyLimit(arr);

        const query = this._buildStatement(arr);
        const params = this.params;

        return { query, params };
    }
}

module.exports = TSQLQuery;
