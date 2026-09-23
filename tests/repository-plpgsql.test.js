const Database = require("../src/db/database.js");
const Repository = require("../src/db/repository.js");

const db = new Database({
    client: "pg",
    connection: {
        database: "test",
        user: "postgres",
        password: "postgres",
    },
});

class UserRepository extends Repository {
    table = "users";
    columns = {
        id: { type: "integer", primary: true, identity: true },
        name: { type: "text", nullable: true },
        email: { type: "text", nullable: true },
        age: { type: "int", nullable: true },
        is_active: { type: "int", nullable: true },
        created_at: { type: "datetime" },
        updated_at: { type: "datetime" },
        is_deleted: { type: "int" },
    };
    primaryKey = "id";
    searchableColumns = ["name", "email"];
    softDelete = "is_deleted";
}

const userRepo = new UserRepository(db);

describe("repository-plpgsql", () => {
    test("at least one test", () => {});

    beforeAll(async () => {
        const exists = await db.query().select().from("information_schema.tables ").where("table_name", "users").limit(1).exists();

        if (exists) {
            await db.schema().dropTable("users");
        }

        await db.schema().createTable("users", (table) => {
            table.column("id").int().primaryKey().identity();
            table.column("name").varChar(100).notNull();
            table.column("email").varChar(100).notNull().unique();
            table.column("age").int().notNull();
            table.column("is_active").int().notNull().default(1);
            table.column("created_at").timestamptz().default(db.raw("CURRENT_TIMESTAMP"));
            table.column("updated_at").timestamptz().default(db.raw("CURRENT_TIMESTAMP"));
            table.column("is_deleted").int().default(0).check("is_deleted", "IN", [0, 1]);

            table.index().on("is_deleted");
        });
    });

    afterAll(async () => {});

    test("create", async () => {
        const result = await userRepo.create({
            name: "user",
            email: "user@mail.com",
            age: 30,
        });
        expect(result.length).toBe(1);
    });
    test("read", async () => {
        const result = await userRepo.get(1);
        expect(!!result).toBe(true);
    });
    test("update", async () => {
        const result = await userRepo.update(1, {
            name: "user",
            email: "user@mail.com",
            age: 30,
        });
        expect(result.length).toBe(1);
    });
    test("delete", async () => {
        const result = await userRepo.delete(1);
        expect(result.length).toBe(1);
    });
    test("restore", async () => {
        const result = await userRepo.restore(1);
        expect(result.length).toBe(1);
    });
    test("create many", async () => {
        const result = await userRepo.createMany(
            Array.from({ length: 20 }, (v, k) => ({
                name: `user${k + 1}`,
                email: `user${k + 1}@mail.com`,
                age: (k + 1) * 5,
                is_active: 1,
                is_deleted: 0,
            })),
        );
        expect(result.length).toBe(20);
    });
    test("read all", async () => {
        const result = await userRepo.getAll();
        expect(result.rows.length).toBe(10);
    });
    test("update by", async () => {
        const result = await userRepo.updateBy(
            {
                age: {
                    ">=": 40,
                    "<=": 50,
                },
            },
            {
                is_active: 0,
            },
        );
        expect(result.length).toBe(3);
    });
    test("delete by", async () => {
        const result = await userRepo.deleteBy({
            is_active: 0,
        });
        expect(result.length).toBe(3);
    });
    test("restore by", async () => {
        const result = await userRepo.restoreBy({
            is_active: 0,
        });
        expect(result.length).toBe(3);
    });
    test("read all with options", async () => {
        const result = await userRepo.getAll({
            search: 1,
            filters: {
                age: { ">=": 20 },
            },
            sorters: {
                age: "DESC",
            },
            page: 2,
            limit: 3,
        });
        expect(result.rows.length).toBe(3);
    });
});
