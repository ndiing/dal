const Raw = require("./raw.js");
const Query = require("./query.js");
const Schema = require("./schema.js");

/**
 * @callback TransactionCallback
 * @param {Client} client
 */

class Client {
    pool = null;
    dialect = null;
    debug = null;

    constructor(config = {}, dialect, debug) {
        this.config = config;
        this.dialect = dialect;
        this.debug = debug;
    }

    escapeLike(value) {
        return String(value).replace(/[\\%_]/g, "\\$&");
    }

    escapeGlob(value) {
        return String(value).replace(/\[/g, "[[]").replace(/\]/g, "[]]").replace(/\*/g, "[*]").replace(/\?/g, "[?]");
    }

    escapeIdentifier(value) {
        return `"${String(value).replace(/"/g, '""')}"`;
    }

    escapeLiteral(value) {
        return `'${String(value).replace(/'/g, "''")}'`;
    }

    defaultParams() {
        return {};
    }

    defaultPlaceholder(name) {
        return name ?? "param";
    }

    formatPlaceholder(name) {
        return `@${name}`;
    }

    /**@returns {import("./raw.js")} */
    raw() {
        return new Raw(this).set(...arguments);
    }

    /**@returns {import("./query.js")} */
    query() {
        return new Query(this);
    }

    
    /**
     * Description placeholder
     *
     * @returns {Schema<string | number | symbol>} 
     */
    schema() {
        return new Schema(this);
    }

    async connect() {
        throw new Error("Method 'connect()' must be implemented.");
    }

    async close() {
        throw new Error("Method 'close()' must be implemented.");
    }

    async isReader() {
        throw new Error("Method 'isReader()' must be implemented.");
    }

    async execute(query, params) {
        throw new Error("Method 'execute(query, params)' must be implemented.");
    }

    async begin() {
        throw new Error("Method 'begin()' must be implemented.");
    }

    async commit() {
        throw new Error("Method 'commit()' must be implemented.");
    }

    async rollback() {
        throw new Error("Method 'rollback()' must be implemented.");
    }

    /**
     * @param {TransactionCallback} callback
     * @returns {Client}
     */
    async transaction(callback) {
        throw new Error("Method 'transaction(callback)' must be implemented.");
    }
}

module.exports = Client;
