const Client = require("../client.js");
const TSQLQuery = require("../query/tsql.js");
const TSQLSchema = require("../schema/tsql.js");

class MssqlClient extends Client {
    /**@type {import("mssql/msnodesqlv8").ConnectionPool}*/
    pool = null;

    constructor(config, dialect, debug) {
        super(
            {
                user: undefined,
                password: undefined,
                server: "localhost",
                database: undefined,
                options: {
                    trustedConnection: true,
                    trustServerCertificate: true,
                },
                beforeConnect: (conn) => {
                    conn.conn_str = conn.conn_str.replace("SQL Server Native Client 11.0", "ODBC Driver 17 for SQL Server");
                    return conn;
                },
                ...config,
            },
            dialect,
            debug,
        );
    }

    query() {
        return new TSQLQuery(this);
    }

    schema() {
        return new TSQLSchema(this);
    }

    async connect() {
        if (!this.pool) {
            const mssql = require("mssql/msnodesqlv8");
            const pool = new mssql.ConnectionPool(this.config);
            this.pool = await pool.connect();
        }
        return this.pool;
    }

    async close() {
        try {
            await this.pool.close();
        } finally {
            this.pool = null;
        }
    }

    isReader(query) {
        const cleaned = query
            .replace(/--.*$/gm, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .trim();
        if (/^(SELECT|WITH|EXEC|EXECUTE|EXPLAIN)\b/i.test(cleaned)) {
            return true;
        }
        if (/^(INSERT|UPDATE|DELETE|MERGE)\b/i.test(cleaned) && /\bOUTPUT\b/i.test(cleaned)) {
            return true;
        }
        return false;
    }

    async execute(query, params = {}) {
        const pool = await this.connect();
        const request = pool.request();
        for (const name in params) {
            request.input(name, params[name]);
        }
        const { recordset, rowsAffected } = await request.query(query);
        if (this.isReader(query)) {
            return recordset || [];
        }
        return { changes: rowsAffected?.[0] || 0 };
    }

    /**@type {Client['transaction']}*/
    async transaction(callback) {
        if (this.nested) {
            return await callback(this);
        }
        const pool = await this.connect();
        /**@type {import("mssql/msnodesqlv8").Transaction}*/
        const client = pool.transaction(pool);
        /**@type {MssqlClient}*/
        const current = Object.create(this);
        current.pool = client;
        current.nested = true;
        try {
            await client.begin();
            const result = await callback(current);
            await client.commit();
            return result;
        } catch (error) {
            await client.rollback();
            throw error;
        }
    }
}

module.exports = MssqlClient;
