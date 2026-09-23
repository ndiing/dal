const Database = require("../src/db/database.js");

const db = new Database({
    client: "better-sqlite3",
    connection: {
        database: "./test.db",
    },
});

describe("migration-sqlitesql", () => {
    test("migrate", async () => {
        await db.migrate();
    });
    test("rollback", async () => {
        await db.rollback();
    });
});
