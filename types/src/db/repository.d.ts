export = Repository;
export type Column = {
    type: string;
    identity: boolean;
    primary: boolean;
    nullable: boolean;
};
export type Options = {
    search: string;
    filters: Object;
    sorters: Object;
    page?: number;
    limit?: number;
};
/**@template {keyof import("./database.js").Driver} D*/
declare class Repository<D extends keyof import("./database.js").Driver> {
    /**@type {import("./database.js")<D>}*/
    db: import("./database.js")<D>;
    /**@type {String}*/
    table: string;
    /**@type {Object.<String, Column>}*/
    columns: Record<string, Column>;
    /**@type {String|Array}*/
    primaryKey: string | any[];
    /**@type {Array}*/
    searchableColumns: any[];
    /**@type {Array}*/
    conflictColumns: any[];
    /**@type {String}*/
    softDelete: string;
    /**
     * @param {import("./database.js")<D>} db
     */
    constructor(db: import("./database.js")<D>);
    /**
     * @param {String|Number|Object} id
     */
    _buildCriteria(id: string | number | Object): {};
    /**
     * @param {import("./query.js")} query
     * @param {Object} criteria
     */
    _applyWhere(query: import("./query.js"), criteria?: Object, softDelete?: boolean): void;
    /**
     * @param {import("./query.js")} query
     * @param {String} search
     */
    _applySearch(query: import("./query.js"), search: string): void;
    /**
     * @param {import("./query.js")} query
     * @param {String} sorters
     */
    _applyOrderBy(query: import("./query.js"), sorters?: string): void;
    create(row: any): Promise<any>;
    createMany(rows: any): Promise<any>;
    upsert(row: any): Promise<any>;
    upsertMany(rows: any): Promise<any>;
    get(id: any): Promise<any>;
    getBy(criteria?: {}): Promise<any>;
    /**
     * @param {Options} options
     * @returns {{rows: Array, meta: Object}}
     */
    getAll(options?: Options): {
        rows: any[];
        meta: Object;
    };
    update(id: any, row: any): Promise<any>;
    updateBy(criteria: {} | undefined, row: any): Promise<any>;
    restore(id: any): Promise<any>;
    restoreBy(criteria?: {}): Promise<any>;
    delete(id: any): Promise<any>;
    deleteBy(criteria?: {}): Promise<any>;
}
