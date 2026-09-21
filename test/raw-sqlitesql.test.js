const Database = require("../src/db/database.js");
const { isArray, isObject } = require("../src/db/util.js");
const db = new Database({
    client: "better-sqlite3",
    connection: {
        database: "./test.db",
    },
});

describe("raw-sqlitesql", () => {
    test("placeholder with array input", () => {
        const result = db.raw("INSERT INTO users (nama, email, umur) VALUES (?, ?, ?);", ["Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES (@param, @param1, @param2);",
            params: { param: "Budi", param1: "budi@mail.com", param2: 25 },
        });
    });

    test("named placeholder with array input", () => {
        const result = db.raw("INSERT INTO users (nama, email, umur) VALUES (?nama, ?email, ?umur);", ["Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES (@nama, @email, @umur);",
            params: { nama: "Budi", email: "budi@mail.com", umur: 25 },
        });
    });

    test("named placeholder with object input", () => {
        const result = db.raw("INSERT INTO users (nama, email, umur) VALUES (?nama, ?email, ?umur);", { email: "budi@mail.com", nama: "Budi", umur: 25 }).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES (@nama, @email, @umur);",
            params: { nama: "Budi", email: "budi@mail.com", umur: 25 },
        });
    });

    test("identifier with array input", () => {
        const result = db.raw("INSERT INTO users (??, ??, ??) VALUES (?, ?, ?);", ["nama", "email", "umur", "Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: 'INSERT INTO users ("nama", "email", "umur") VALUES (@param, @param1, @param2);',
            params: { param: "Budi", param1: "budi@mail.com", param2: 25 },
        });
    });

    test("named identifier with array input", () => {
        const result = db.raw("INSERT INTO users (??column1, ??column2, ??column3) VALUES (?, ?, ?);", ["nama", "email", "umur", "Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: 'INSERT INTO users ("nama", "email", "umur") VALUES (@param, @param1, @param2);',
            params: { param: "Budi", param1: "budi@mail.com", param2: 25 },
        });
    });

    test("named identifier with object input", () => {
        const result = db
            .raw("INSERT INTO users (??column1, ??column2, ??column3) VALUES (?value1, ?value2, ?value3);", {
                column1: "nama",
                column2: "email",
                column3: "umur",
                value1: "Budi",
                value2: "budi@mail.com",
                value3: 25,
            })
            .build();
        expect(result).toEqual({
            query: 'INSERT INTO users ("nama", "email", "umur") VALUES (@value1, @value2, @value3);',
            params: { value1: "Budi", value2: "budi@mail.com", value3: 25 },
        });
    });

    test("another placeholder", () => {
        const result = db.raw(`INSERT INTO users (nama, email, umur) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?);`, ["Budi", "budi@mail.com", 25, "Ani", "ani@mail.com", 23, "Cici", "cici@mail.com", 27]).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES (@param, @param1, @param2), (@param3, @param4, @param5), (@param6, @param7, @param8);",
            params: {
                param: "Budi",
                param1: "budi@mail.com",
                param2: 25,
                param3: "Ani",
                param4: "ani@mail.com",
                param5: 23,
                param6: "Cici",
                param7: "cici@mail.com",
                param8: 27,
            },
        });
    });

    test("simple placeholder", () => {
        const result = db.raw("?", [1]).build();
        expect(result).toEqual({
            query: "@param",
            params: { param: 1 },
        });
    });

    test("simple placeholder 2", () => {
        const result = db.raw("?,?,?", [1, 2, 3]).build();
        expect(result).toEqual({
            query: "@param,@param1,@param2",
            params: { param: 1, param1: 2, param2: 3 },
        });
    });

    test("simple named placeholder", () => {
        const result = db.raw("?value1", [1]).build();
        expect(result).toEqual({
            query: "@value1",
            params: { value1: 1 },
        });
    });

    test("simple identifier", () => {
        const result = db.raw("??", ["column1"]).build();
        expect(result).toEqual({ query: '"column1"', params: {} });
    });

    test("simple identifier 2", () => {
        const result = db.raw("??,??,??", ["column1", "column2", "column3"]).build();
        expect(result).toEqual({
            query: '"column1","column2","column3"',
            params: {},
        });
    });

    test("query in raw", () => {
        const query = db.query().select().from("users").where("is_deleted", db.raw(0));
        const raw = db.raw`CREATE VIEW active_users AS ${query}`.build();

        expect(raw).toEqual({
            query: "CREATE VIEW active_users AS SELECT * FROM users WHERE is_deleted = 0",
            params: {},
        });
    });
});
