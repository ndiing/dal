const Database = require("../src/db/database.js");
const Migration = require("../src/db/migration.js");

const db = new Database({
    client: "pg",
    connection: {
        database: "test",
        user: "postgres",
        password: "postgres",
    },
    // debug:true
});

describe("migration-plpgsql", () => {
    test("migrate", async () => {
        // await db.schema().dropTable('users2').then(console.log)
        await db.migrate(); //.then(console.log)
    });
    test("rollback", async () => {
        await db.rollback(); //.then(console.log)
    });
});
