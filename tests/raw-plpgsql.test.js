const Database = require("../src/db/database.js");
const db = new Database({
    client: "pg",
    connection: {
        database: "test",
        user: "postgres",
        password: "postgres",
    },
});

describe("raw-plpgsql", () => {
    test("placeholder with array input", () => {
        const result = db.raw("INSERT INTO users (nama, email, umur) VALUES (?, ?, ?);", ["Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES ($1, $2, $3);",
            params: ["Budi", "budi@mail.com", 25],
        });
    });

    test("named placeholder with array input", () => {
        const result = db.raw("INSERT INTO users (nama, email, umur) VALUES (?nama, ?email, ?umur);", ["Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES ($1, $2, $3);",
            params: ["Budi", "budi@mail.com", 25],
        });
    });

    test("named placeholder with object input", () => {
        const result = db.raw("INSERT INTO users (nama, email, umur) VALUES (?nama, ?email, ?umur);", { email: "budi@mail.com", nama: "Budi", umur: 25 }).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES ($1, $2, $3);",
            params: ["Budi", "budi@mail.com", 25],
        });
    });

    test("identifier with array input", () => {
        const result = db.raw("INSERT INTO users (??, ??, ??) VALUES (?, ?, ?);", ["nama", "email", "umur", "Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: 'INSERT INTO users ("nama", "email", "umur") VALUES ($1, $2, $3);',
            params: ["Budi", "budi@mail.com", 25],
        });
    });

    test("named identifier with array input", () => {
        const result = db.raw("INSERT INTO users (??column1, ??column2, ??column3) VALUES (?, ?, ?);", ["nama", "email", "umur", "Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: 'INSERT INTO users ("nama", "email", "umur") VALUES ($1, $2, $3);',
            params: ["Budi", "budi@mail.com", 25],
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
            query: 'INSERT INTO users ("nama", "email", "umur") VALUES ($1, $2, $3);',
            params: ["Budi", "budi@mail.com", 25],
        });
    });

    test("another placeholder", () => {
        const result = db.raw(`INSERT INTO users (nama, email, umur) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?);`, ["Budi", "budi@mail.com", 25, "Ani", "ani@mail.com", 23, "Cici", "cici@mail.com", 27]).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9);",
            params: ["Budi", "budi@mail.com", 25, "Ani", "ani@mail.com", 23, "Cici", "cici@mail.com", 27],
        });
    });

    test("simple placeholder", () => {
        const result = db.raw("?", [1]).build();
        expect(result).toEqual({
            query: "$1",
            params: [1],
        });
    });

    test("simple placeholder 2", () => {
        const result = db.raw("?,?,?", [1, 2, 3]).build();
        expect(result).toEqual({
            query: "$1,$2,$3",
            params: [1, 2, 3],
        });
    });

    test("simple named placeholder", () => {
        const result = db.raw("?value1", [1]).build();
        expect(result).toEqual({
            query: "$1",
            params: [1],
        });
    });

    test("simple identifier", () => {
        const result = db.raw("??", ["column1"]).build();
        expect(result).toEqual({
            query: '"column1"',
            params: [],
        });
    });

    test("simple identifier 2", () => {
        const result = db.raw("??,??,??", ["column1", "column2", "column3"]).build();
        expect(result).toEqual({
            query: '"column1","column2","column3"',
            params: [],
        });
    });

    test("query in raw", () => {
        const query = db.query().select("col").from("table");
        const raw = db.raw`SELECT col, (${query}) FROM table;`.build();
        expect(raw).toEqual({
            query: "SELECT col, (SELECT col FROM table) FROM table;",
            params: [],
        });
    });
});
