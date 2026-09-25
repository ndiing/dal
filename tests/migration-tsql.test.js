const Database = require("../src/database.js");

const db = new Database({
    client: "mssql",
    connection: {
        database: "test",
    },
});

describe("migration-tsql", () => {
    test("migrate", async () => {
        await db.migrate();
    });
    test("rollback", async () => {
        await db.rollback();
    });
});
