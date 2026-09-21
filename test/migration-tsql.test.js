const Database = require("../src/db/database.js");

const db = new Database({
    client: "mssql",
    connection: {
        database: "test",
    },
    // debug:true
});


describe("migration-tsql", () => {
    test("migrate", async () => {
        // await db.schema().dropTable('migrations').then(console.log)
        await db.migrate()//.then(console.log)
    });
    test("rollback", async () => {
        await db.rollback()//.then(console.log)
    });
});

