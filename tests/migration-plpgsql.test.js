const Database = require("../src/database.js");
const Migration = require("../src/migration.js");

const db = new Database({
    client: "pg",
    connection: {
        database: "test",
        user: "postgres",
        password: "postgres",
    },
});

describe("migration-plpgsql", () => {
    test("migrate", async () => {
        await db.migrate();
    });
    test("rollback", async () => {
        await db.rollback();
    });
});
