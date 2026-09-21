const { isObject, isEmpty, isArray } = require("./util.js");

/**
 * @typedef Column
 * @property {String} type
 * @property {Boolean} identity
 * @property {Boolean} primary
 * @property {Boolean} nullable
 */

/**
 * @typedef Options
 * @property {String} search
 * @property {Object} filters
 * @property {Object} sorters
 * @property {Number} [page=1]
 * @property {Number} [limit=10]
 */


const OPERATORS = new Set([
    // Comparison
    "=",
    "!=",
    "<>",
    ">",
    "<",
    ">=",
    "<=",

    // Pattern matching
    "LIKE",
    "NOT LIKE",
    "ILIKE",
    "NOT ILIKE", // PG
    "GLOB",
    "NOT GLOB", // SQLite
    "SIMILAR TO",
    "NOT SIMILAR TO", // PG (SQL standard)
    "REGEXP",
    "NOT REGEXP", // MySQL (future)
    "RLIKE",
    "NOT RLIKE", // MySQL (future)

    // Set
    "IN",
    "NOT IN",

    // Range
    "BETWEEN",
    "NOT BETWEEN",

    // Null & Boolean
    "IS",
    "IS NOT",

    // Null-safe (PG)
    "IS DISTINCT FROM",
    "IS NOT DISTINCT FROM",

    // Full-text (PG)
    "@@",
]);

const DIRECTIONS = new Set(["ASC", "DESC"]);

/**@template {keyof import("./database.js").Driver} D*/

class Repository {
    /**@type {import("./database.js")<D>}*/
    db = null;
    /**@type {String}*/
    table = null;
    /**@type {Object.<String, Column>}*/
    columns = null;
    /**@type {String|Array}*/
    primaryKey = "id";
    /**@type {Array}*/
    searchableColumns = null;
    /**@type {Array}*/
    conflictColumns = null;
    /**@type {String}*/
    softDelete = null;

    /**
     * @param {import("./database.js")<D>} db 
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * @param {String|Number|Object} id
     */
    _buildCriteria(id) {
        const criteria = {};
        if (isArray(this.primaryKey)) {
            for (const column of this.primaryKey) {
                criteria[column] = id[column];
            }
        } else {
            criteria[this.primaryKey] = id;
        }

        return criteria;
    }

    /**
     * @param {import("./query.js")} query
     * @param {Object} criteria
     */
    _applyWhere(query, criteria = {}, softDelete = !!this.softDelete) {
        if (this.softDelete) {
            criteria[this.softDelete] = softDelete ? 0 : 1;
        }

        for (const column in criteria) {
            if (!this.columns[column]) {
                throw new Error(`Unknown column "${column}" in criteria`);
            }

            const value = criteria[column];
            if (isObject(value)) {
                for (const operator in value) {
                    const opr = operator.toUpperCase();
                    if (!OPERATORS.has(opr)) {
                        throw new Error(`Unsupported operator "${opr}" for column "${column}"`);
                    }

                    query.where(column, opr, value[operator]);
                }
            } else {
                query.where(column, value);
            }
        }
    }

    /**
     * @param {import("./query.js")} query
     * @param {String} search
     */
    _applySearch(query, search) {
        if (isEmpty(search) || !this.searchableColumns?.length) {
            return;
        }

        const value = `%${this.db.escapeLike(String(search).trim())}%`;

        query.where((query) => {
            for (const column of this.searchableColumns) {
                query.orWhere(column, "LIKE", value);
            }
        });
    }

    /**
     * @param {import("./query.js")} query
     * @param {String} sorters
     */
    _applyOrderBy(query, sorters = {}) {
        for (const column in sorters) {
            if (!this.columns[column]) {
                throw new Error(`Unknown column "${column}" in sorters`);
            }

            const direction = sorters[column]?.toUpperCase();
            if (!DIRECTIONS.has(direction)) {
                throw new Error(`Invalid sort direction "${direction}". Use ASC or DESC`);
            }

            query.orderBy(column, direction);
        }
    }

    async create(row) {
        return this.createMany(row);
    }

    async createMany(rows) {
        const query = this.db.query();

        return await query.insert(this.table, rows).returning();
    }

    async upsert(row) {
        return this.upsertMany(row);
    }

    async upsertMany(rows) {
        if (!this.conflictColumns?.length) {
            throw new Error("Upsert requires conflictColumns to be defined");
        }

        const query = this.db.query();

        return await query.insert(this.table, rows).onConflict(this.conflictColumns).doUpdate().returning();
    }

    async get(id) {
        const criteria = this._buildCriteria(id);

        return this.getBy(criteria);
    }

    async getBy(criteria = {}) {
        const query = this.db.query();

        this._applyWhere(query, criteria);

        return await query.select().from(this.table).limit(1).first();
    }

    /**
     * @param {Options} options
     * @returns {{rows: Array, meta: Object}}
     */
    async getAll(options = {}) {
        let { search = "", filters = {}, sorters = {}, page = 1, limit = 10 } = options;

        page = Math.max(1, parseInt(page, 10) || 1);
        limit = Math.max(1, parseInt(limit, 10) || 10);
        const offset = (page - 1) * limit;

        const query = this.db.query();

        this._applySearch(query, search);
        this._applyWhere(query, filters);
        this._applyOrderBy(query, sorters);

        query.limit(limit + 1);
        query.offset(offset);

        const result = await query.select().from(this.table);

        const rows = result.slice(0, limit);

        return {
            rows,
            meta: {
                page,
                limit,
                offset,
                prev: page > 1,
                next: result.length > limit,
                start: rows.length > 0 ? offset + 1 : 0,
                end: offset + rows.length,
            },
        };
    }

    async update(id, row) {
        const criteria = this._buildCriteria(id);

        return this.updateBy(criteria, row);
    }

    async updateBy(criteria = {}, row) {
        const query = this.db.query();

        this._applyWhere(query, criteria);

        return await query.update(this.table, row).returning();
    }

    async restore(id) {
        const criteria = this._buildCriteria(id);

        return this.restoreBy(criteria);
    }

    async restoreBy(criteria = {}) {
        if (!this.softDelete) {
            throw new Error("Restore operation is only available when softDelete is enabled");
        }

        const query = this.db.query();

        this._applyWhere(query, criteria, false);

        return await query
            .update(this.table, {
                [this.softDelete]: 0,
            })
            .returning();
    }

    async delete(id) {
        const criteria = this._buildCriteria(id);

        return this.deleteBy(criteria);
    }

    async deleteBy(criteria = {}) {
        const query = this.db.query();

        this._applyWhere(query, criteria);

        if (!!this.softDelete) {
            return await query
                .update(this.table, {
                    [this.softDelete]: 1,
                })
                .returning();
        }

        return await query.delete(this.table).returning();
    }
}

module.exports = Repository;
