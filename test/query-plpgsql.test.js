const Database = require("../src/db/database.js");

const db = new Database({
    client: "pg",
    connection: {
        database: "test",
    },
});

describe("query-plpgsql", () => {
    test("Basic Insert", () => {
        const result = db.query().insert("users", { nama: "Budi", email: "budi@mail.com", umur: 25 }).build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES ($1, $2, $3);",
            params: ["Budi", "budi@mail.com", 25],
        });
    });
    test("Insert Tanpa Nama Kolom (Hati-hati!)", () => {
        const result = db.query().insert("users", null, [null, "Budi", "budi@mail.com", 25]).build();
        expect(result).toEqual({
            query: "INSERT INTO users VALUES ($1, $2, $3, $4);",
            params: [null, "Budi", "budi@mail.com", 25],
        });
    });
    test("Multi-Row Insert (SQLite 3.7.11+)", () => {
        const result = db
            .query()
            .insert("users", [
                { nama: "Budi", email: "budi@mail.com", umur: 25 },
                { nama: "Ani", email: "ani@mail.com", umur: 23 },
                { nama: "Cici", email: "cici@mail.com", umur: 27 },
            ])
            .build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email, umur) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9);",
            params: ["Budi", "budi@mail.com", 25, "Ani", "ani@mail.com", 23, "Cici", "cici@mail.com", 27],
        });
    });
    /**@deprecated*/
    // test("INSERT OR IGNORE", () => {
    //     const result = db.query().insert("users", { nama: "Budi", email: "budi@mail.com" }).orIgnore().build();
    //     expect(result).toEqual({
    //         query: "INSERT OR IGNORE INTO users (nama, email) VALUES ($1, $2);",
    //         params: ["Budi", "budi@mail.com"],
    //     });
    // });
    /**@deprecated*/
    // test("INSERT OR REPLACE", () => {
    //     const result = db.query().insert("users", { id: 1, nama: "Budi", email: "budi@mail.com" }).orReplace().build();
    //     expect(result).toEqual({
    //         query: "INSERT OR REPLACE INTO users (id, nama, email) VALUES ($1, $2, $3);",
    //         params: [1, "Budi", "budi@mail.com"],
    //     });
    // });
    test("UPSERT (SQLite 3.24+) - Yang Bener", () => {
        const result = db
            .query()
            .insert("users", {
                id: 1,
                nama: "Budi",
                email: "budi@mail.com",
                umur: 26,
            })
            .onConflict("id")
            .doUpdate()
            .build();
        expect(result).toEqual({
            query: "INSERT INTO users (id, nama, email, umur) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET nama = excluded.nama, email = excluded.email, umur = excluded.umur;",
            params: [1, "Budi", "budi@mail.com", 26],
        });
    });
    test("mirip INSERT OR IGNORE", () => {
        const result = db
            .query()
            .insert("users", {
                id: 1,
                nama: "Budi",
                email: "budi@mail.com",
                umur: 26,
            })
            .onConflict("id")
            .doNothing()
            .build();
        expect(result).toEqual({
            query: "INSERT INTO users (id, nama, email, umur) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;",
            params: [1, "Budi", "budi@mail.com", 26],
        });
    });
    test("Conditional update", () => {
        const result = db.query().insert("users", { email: "budi@mail.com", umur: 26 }).onConflict("email").doUpdate().where("excluded.umur", ">", db.raw("users.umur")).build();
        expect(result).toEqual({
            query: "INSERT INTO users (email, umur) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET umur = excluded.umur WHERE excluded.umur > users.umur;",
            params: ["budi@mail.com", 26],
        });
    });
    test("RETURNING (SQLite 3.35+)", () => {
        const result = db.query().insert("users", { nama: "Dodi", email: "dodi@mail.com" }).returning("id", "nama", "created_at").build();
        expect(result).toEqual({
            query: "INSERT INTO users (nama, email) VALUES ($1, $2) RETURNING id, nama, created_at;",
            params: ["Dodi", "dodi@mail.com"],
        });
    });
    test("INSERT ... SELECT", () => {
        const result = db.query().insert("users_archive", ["nama", "email", "umur"]).select("nama", "email", "umur").from("users").where("umur", ">", 60).build();
        expect(result).toEqual({
            query: "INSERT INTO users_archive (nama, email, umur) SELECT nama, email, umur FROM users WHERE umur > $1;",
            params: [60],
        });
    });
    test("DEFAULT VALUES", () => {
        const result = db.query().insert("users").default().build();
        expect(result).toEqual({
            query: "INSERT INTO users DEFAULT VALUES;",
            params: [],
        });
    });
    test("Perbandingan", () => {
        const result = db.query().select().from("users").where("umur", ">", 20).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE umur > $1;",
            params: [20],
        });
    });
    test("Perbandingan", () => {
        const result = db.query().select().from("users").where("umur", "BETWEEN", [20, 30]).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE umur BETWEEN $1 AND $2;",
            params: [20, 30],
        });
    });
    test("Perbandingan", () => {
        const result = db.query().select().from("users").where("umur", "IN", ["Budi", "Ani", "Cici"]).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE umur IN ($1, $2, $3);",
            params: ["Budi", "Ani", "Cici"],
        });
    });
    test("Perbandingan", () => {
        const result = db.query().select().from("users").where("umur", "IN", []).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE 1 = 0;",
            params: [],
        });
    });
    test("Perbandingan", () => {
        const result = db.query().select().from("users").where("umur", "NOT IN", ["Budi"]).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE umur NOT IN ($1);",
            params: ["Budi"],
        });
    });
    test("LIKE case-insensitive untuk ASCII", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("nama", "LIKE", `${db.escapeLike("Bu")}%`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE nama LIKE $1;",
            params: ["Bu%"],
        });
    });
    test("LIKE case-insensitive untuk ASCII", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("nama", "LIKE", `%${db.escapeLike("di")}`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE nama LIKE $1;",
            params: ["%di"],
        });
    });
    test("LIKE case-insensitive untuk ASCII", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("nama", "LIKE", `%${db.escapeLike("ud")}%`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE nama LIKE $1;",
            params: ["%ud%"],
        });
    });
    test("LIKE case-insensitive untuk ASCII", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("nama", "LIKE", `_${db.escapeLike("udi")}`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE nama LIKE $1;",
            params: ["_udi"],
        });
    });
    test("case-sensitive, pakai wildcard Unix", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("nama", "GLOB", `${db.escapeGlob("Bu")}*`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE nama GLOB $1;",
            params: ["Bu*"],
        });
    });
    test("case-sensitive, pakai wildcard Unix", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("nama", "GLOB", `[AB]${db.escapeGlob("udi")}`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE nama GLOB $1;",
            params: ["[AB]udi"],
        });
    });
    test("NULL handling", () => {
        const result = db.query().select().from("users").where("email", "IS", db.raw("NULL")).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE email IS NULL;",
            params: [],
        });
    });
    test("NULL handling", () => {
        const result = db.query().select().from("users").where("email", "IS NOT", db.raw("NULL")).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE email IS NOT NULL;",
            params: [],
        });
    });
    test("Logika", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("umur", ">", 20)
            .where("nama", "LIKE", `${db.escapeLike("B")}%`)
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE umur > $1 AND nama LIKE $2;",
            params: [20, "B%"],
        });
    });
    test("Logika", () => {
        const result = db.query().select().from("users").where("umur", "<", 20).orWhere("umur", ">", 60).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE umur < $1 OR umur > $2;",
            params: [20, 60],
        });
    });
    test("Logika", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .whereNot((query) => {
                query.where("umur", ">", 20);
            })
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE NOT (umur > $1);",
            params: [20],
        });
    });
    test("ascending (default)", () => {
        const result = db.query().select().from("users").orderBy("umur", "ASC").build();
        expect(result).toEqual({
            query: "SELECT * FROM users ORDER BY umur ASC;",
            params: [],
        });
    });
    test("descending", () => {
        const result = db.query().select().from("users").orderBy("umur", "DESC").build();
        expect(result).toEqual({
            query: "SELECT * FROM users ORDER BY umur DESC;",
            params: [],
        });
    });
    test("multi-kolom", () => {
        const result = db.query().select().from("users").orderBy("umur", "DESC").orderBy("nama", "ASC").build();
        expect(result).toEqual({
            query: "SELECT * FROM users ORDER BY umur DESC, nama ASC;",
            params: [],
        });
    });
    test("pakai posisi kolom (kurang bagus, hindari)", () => {
        const result = db.query().select().from("users").orderBy(db.raw("2"), "DESC").build();
        expect(result).toEqual({
            query: "SELECT * FROM users ORDER BY 2 DESC;",
            params: [],
        });
    });
    test("SQLite 3.30+", () => {
        const result = db.query().select().from("users").orderBy("umur", "DESC NULLS LAST").build();
        expect(result).toEqual({
            query: "SELECT * FROM users ORDER BY umur DESC NULLS LAST;",
            params: [],
        });
    });
    test("10 baris pertama", () => {
        const result = db.query().select().from("users").limit(10).build();
        expect(result).toEqual({
            query: "SELECT * FROM users LIMIT $1;",
            params: [10],
        });
    });
    test("skip 20, ambil 10", () => {
        const result = db.query().select().from("users").limit(10).offset(20).build();
        expect(result).toEqual({
            query: "SELECT * FROM users LIMIT $1 OFFSET $2;",
            params: [10, 20],
        });
    });
    /**@deprecated*/
    // test("sintaks alternatif (offset, limit)", () => {
    //     const result = db.query().select().from("users").limit(20, 10).build();
    //     expect(result).toEqual({ query: "SELECT * FROM users LIMIT $1, $2;", params: [20, 10] });
    // });
    test("Daripada: LIMIT 10 OFFSET 100000", () => {
        const result = db.query().select().from("users").where("id", ">", 100000).orderBy("id").limit(10).build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE id > $1 ORDER BY id LIMIT $2;",
            params: [100000, 10],
        });
    });
    test("unique values", () => {
        const result = db.query().select("DISTINCT kota").from("users").build();
        expect(result).toEqual({
            query: "SELECT DISTINCT kota FROM users;",
            params: [],
        });
    });
    test("hitung unique", () => {
        const result = db.query().select("COUNT(DISTINCT kota)").from("users").build();
        expect(result).toEqual({
            query: "SELECT COUNT(DISTINCT kota) FROM users;",
            params: [],
        });
    });
    test("Aggregate Functions", () => {
        const result = db.query().select("COUNT(*) AS total", "COUNT(email) AS punya_email", "SUM(umur) AS total_umur", "AVG(umur) AS rata_umur", "MIN(umur) AS termuda", "MAX(umur) AS tertua").from("users").build();
        expect(result).toEqual({
            query: "SELECT COUNT(*) AS total, COUNT(email) AS punya_email, SUM(umur) AS total_umur, AVG(umur) AS rata_umur, MIN(umur) AS termuda, MAX(umur) AS tertua FROM users;",
            params: [],
        });
    });
    test("GROUP BY & HAVING", () => {
        const result = db.query().select("kota", "COUNT(*) AS jumlah", "AVG(umur) AS rata").from("users").groupBy("kota").having("jumlah", ">", 5).orderBy("jumlah", "DESC").build();
        expect(result).toEqual({
            query: "SELECT kota, COUNT(*) AS jumlah, AVG(umur) AS rata FROM users GROUP BY kota HAVING jumlah > $1 ORDER BY jumlah DESC;",
            params: [5],
        });
    });
    test("CASE Expression", () => {
        const result = db.query().select("nama", "umur", db.raw("CASE WHEN umur < 18 THEN 'Anak' WHEN umur < 60 THEN 'Dewasa' ELSE 'Senior' END AS kategori")).from("users").build();
        expect(result).toEqual({
            query: "SELECT nama, umur, CASE WHEN umur < 18 THEN 'Anak' WHEN umur < 60 THEN 'Dewasa' ELSE 'Senior' END AS kategori FROM users;",
            params: [],
        });
    });
    test("Scalar subquery", () => {
        const result = db
            .query()
            .select("nama", (query) => {
                query.select("COUNT(*)").from("orders").where("user_id", db.raw("users.id")).as("total_order");
            })
            .from("users")
            .build();
        expect(result).toEqual({
            query: "SELECT nama, (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS total_order FROM users;",
            params: [],
        });
    });
    test("IN subquery", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .where("id", "IN", (query) => {
                query.select("user_id").from("orders").where("total", ">", 100);
            })
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > $1);",
            params: [100],
        });
    });
    test("EXISTS (sering lebih cepat dari IN)", () => {
        const result = db
            .query()
            .select()
            .from("users")
            .whereExists((query) => {
                query.select("1").from("orders o").where("o.user_id", db.raw("u.id"));
            })
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);",
            params: [],
        });
    });
    test("Correlated subquery", () => {
        const result = db
            .query()
            .select()
            .from("users u")
            .where("umur", ">", (query) => {
                query.select("AVG(umur)").from("users").where("kota", db.raw("u.kota"));
            })
            .build();
        expect(result).toEqual({
            query: "SELECT * FROM users u WHERE umur > (SELECT AVG(umur) FROM users WHERE kota = u.kota);",
            params: [],
        });
    });
    test("CTE (Common Table Expression) - SQLite 3.8.3+", () => {
        const result = db
            .query()
            .with("user_stats", (query) => {
                query.select("user_id", "COUNT(*) AS total", "SUM(amount) AS revenue").from("orders").groupBy("user_id");
            })
            .select("u.nama", "s.total", "s.revenue")
            .from("users u")
            .join("user_stats s", "s.user_id", "u.id")
            .where("s.revenue", ">", 1000)
            .build();
        expect(result).toEqual({
            query: "WITH user_stats AS (SELECT user_id, COUNT(*) AS total, SUM(amount) AS revenue FROM orders GROUP BY user_id) SELECT u.nama, s.total, s.revenue FROM users u JOIN user_stats s ON s.user_id = u.id WHERE s.revenue > $1;",
            params: [1000],
        });
    });
    test("Recursive CTE - buat hierarchical data", () => {
        const result = db
            .query()
            .withRecursive("karyawan_tree", (query) => {
                query
                    .select("id", "nama", "atasan_id", "1 AS level")
                    .from("karyawan")
                    .where("atasan_id", "IS", db.raw("NULL"))
                    .unionAll((query) => {
                        query.select("k.id", "k.nama", "k.atasan_id", "kt.level + 1").from("karyawan k").join("karyawan_tree kt", "k.atasan_id ", "kt.id");
                    });
            })
            .select()
            .from("karyawan_tree")
            .orderBy("level")
            .build();
        expect(result).toEqual({
            query: "WITH RECURSIVE karyawan_tree AS (SELECT id, nama, atasan_id, 1 AS level FROM karyawan WHERE atasan_id IS NULL UNION ALL SELECT k.id, k.nama, k.atasan_id, kt.level + 1 FROM karyawan k JOIN karyawan_tree kt ON k.atasan_id  = kt.id) SELECT * FROM karyawan_tree ORDER BY level;",
            params: [],
        });
    });
    test("Window Functions - SQLite 3.25+", () => {
        const result = db.query().select("nama", "kota", "umur", "ROW_NUMBER() OVER (ORDER BY umur DESC) AS ranking", "RANK() OVER (PARTITION BY kota ORDER BY umur DESC) AS rank_per_kota", "AVG(umur) OVER (PARTITION BY kota) AS rata_kota", "SUM(umur) OVER (ORDER BY id) AS running_total").from("users").build();
        expect(result).toEqual({
            query: "SELECT nama, kota, umur, ROW_NUMBER() OVER (ORDER BY umur DESC) AS ranking, RANK() OVER (PARTITION BY kota ORDER BY umur DESC) AS rank_per_kota, AVG(umur) OVER (PARTITION BY kota) AS rata_kota, SUM(umur) OVER (ORDER BY id) AS running_total FROM users;",
            params: [],
        });
    });
    test("Contoh LAG/LEAD", () => {
        const result = db.query().select("tanggal", "harga", "LAG(harga) OVER (ORDER BY tanggal) AS harga_kemarin", "harga - LAG(harga) OVER (ORDER BY tanggal) AS selisih").from("saham").build();
        expect(result).toEqual({
            query: "SELECT tanggal, harga, LAG(harga) OVER (ORDER BY tanggal) AS harga_kemarin, harga - LAG(harga) OVER (ORDER BY tanggal) AS selisih FROM saham;",
            params: [],
        });
    });
    test("INNER JOIN (default)", () => {
        const result = db.query().select("u.nama", "o.total").from("users u").innerJoin("orders o", "o.user_id", "u.id").build();
        expect(result).toEqual({
            query: "SELECT u.nama, o.total FROM users u INNER JOIN orders o ON o.user_id = u.id;",
            params: [],
        });
    });
    test("LEFT JOIN (semua user, termasuk yang nggak punya order)", () => {
        const result = db.query().select("u.nama", "o.total").from("users u").leftJoin("orders o", "o.user_id", "u.id").build();
        expect(result).toEqual({
            query: "SELECT u.nama, o.total FROM users u LEFT JOIN orders o ON o.user_id = u.id;",
            params: [],
        });
    });
    test("CROSS JOIN (kartesian)", () => {
        const result = db.query().select().from("warna").crossJoin("ukuran").build();
        expect(result).toEqual({
            query: "SELECT * FROM warna CROSS JOIN ukuran;",
            params: [],
        });
    });
    test("Self join", () => {
        const result = db.query().select("a.nama AS karyawan", "b.nama AS atasan").from("karyawan a").leftJoin("karyawan b", "a.atasan_id", "b.id").build();
        expect(result).toEqual({
            query: "SELECT a.nama AS karyawan, b.nama AS atasan FROM karyawan a LEFT JOIN karyawan b ON a.atasan_id = b.id;",
            params: [],
        });
    });
    /**@deprecated*/
    // test("USING (shortcut kalau nama kolom sama)", () => {
    //     const result = db
    //         .query()
    //         .select()
    //         .from("users")
    //         .join("orders", (query) => query.using("user_id"))
    //         .build();
    //     expect(result).toEqual({
    //         query: "SELECT * FROM users JOIN orders USING (user_id);",
    //         params: [],
    //     });
    // });
    test("UNION: hilangin duplikat (lebih lambat, ada sorting)", () => {
        const result = db
            .query()
            .select("nama")
            .from("users")
            .union((query) => {
                query.select("nama").from("karyawan");
            })
            .build();
        expect(result).toEqual({
            query: "SELECT nama FROM users UNION SELECT nama FROM karyawan;",
            params: [],
        });
    });
    test("UNION ALL: pertahankan semua (lebih cepat)", () => {
        const result = db
            .query()
            .select("nama")
            .from("users")
            .unionAll((query) => {
                query.select("nama").from("karyawan");
            })
            .build();
        expect(result).toEqual({
            query: "SELECT nama FROM users UNION ALL SELECT nama FROM karyawan;",
            params: [],
        });
    });
    test("COALESCE: nilai pertama yang non-NULL", () => {
        const result = db.query().select("COALESCE(email, telepon, 'tidak ada') AS kontak").from("users").build();
        expect(result).toEqual({
            query: "SELECT COALESCE(email, telepon, 'tidak ada') AS kontak FROM users;",
            params: [],
        });
    });
    test("NULLIF: return NULL kalau dua nilai sama", () => {
        const result = db.query().select("NULLIF(jumlah, 0)").from("users").build();
        expect(result).toEqual({
            query: "SELECT NULLIF(jumlah, 0) FROM users;",
            params: [],
        });
    });
    test("IIF (SQLite 3.32+)", () => {
        const result = db.query().select("nama", "IIF(umur >= 18, 'Dewasa', 'Anak')").from("users").build();
        expect(result).toEqual({
            query: "SELECT nama, IIF(umur >= 18, 'Dewasa', 'Anak') FROM users;",
            params: [],
        });
    });
    test("CAST", () => {
        const result = db.query().select("CAST('123' AS INTEGER)").build();
        expect(result).toEqual({
            query: "SELECT CAST('123' AS INTEGER);",
            params: [],
        });
    });
    test("CAST", () => {
        const result = db.query().select("CAST(umur AS TEXT)").build();
        expect(result).toEqual({
            query: "SELECT CAST(umur AS TEXT);",
            params: [],
        });
    });
    test("String functions", () => {
        const result = db.query().select("LENGTH(nama)", "UPPER(nama)", "LOWER(nama)", "SUBSTR(nama, 1, 3)", "TRIM(nama)", "REPLACE(nama, 'a', 'o')", "nama || ' - ' || kota AS label").build();
        expect(result).toEqual({
            query: "SELECT LENGTH(nama), UPPER(nama), LOWER(nama), SUBSTR(nama, 1, 3), TRIM(nama), REPLACE(nama, 'a', 'o'), nama || ' - ' || kota AS label;",
            params: [],
        });
    });
    test("Basic Update", () => {
        const result = db.query().update("users", { umur: 26 }).where("id", 1).build();
        expect(result).toEqual({
            query: "UPDATE users SET umur = $1 WHERE id = $2;",
            params: [26, 1],
        });
    });
    test("Multi-Kolom", () => {
        const result = db
            .query()
            .update("users", {
                umur: 26,
                kota: "Jakarta",
                updated_at: db.raw("CURRENT_TIMESTAMP"),
            })
            .where("id", 1)
            .build();
        expect(result).toEqual({
            query: "UPDATE users SET umur = $1, kota = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3;",
            params: [26, "Jakarta", 1],
        });
    });
    test("Update dari Subquery", () => {
        const result = db
            .query()
            .update("users", {
                total_order: (query) => {
                    query.select("COUNT(*)").from("orders").where("user_id", db.raw("users.id"));
                },
            })
            .build();
        expect(result).toEqual({
            query: "UPDATE users SET total_order = (SELECT COUNT(*) FROM orders WHERE user_id = users.id);",
            params: [],
        });
    });
    test("Update dengan CASE", () => {
        const result = db
            .query()
            .update("users", {
                status: db.raw(`CASE WHEN umur < 18 THEN 'minor' WHEN umur < 60 THEN 'aktif' ELSE 'senior' END`),
            })
            .build();
        expect(result).toEqual({
            query: "UPDATE users SET status = CASE WHEN umur < 18 THEN 'minor' WHEN umur < 60 THEN 'aktif' ELSE 'senior' END;",
            params: [],
        });
    });
    test("UPDATE ... FROM (SQLite 3.33+)", () => {
        const result = db
            .query()
            .update("users", { total_order: db.raw("o.jumlah") })
            .from((query) => {
                query.select("user_id", "COUNT(*) AS jumlah").from("orders").groupBy("user_id").as("o");
            })
            .where("users.id", db.raw("o.user_id"))
            .build();
        expect(result).toEqual({
            query: "UPDATE users SET total_order = o.jumlah FROM (SELECT user_id, COUNT(*) AS jumlah FROM orders GROUP BY user_id) AS o WHERE users.id = o.user_id;",
            params: [],
        });
    });
    test("UPDATE ... RETURNING", () => {
        const result = db
            .query()
            .update("users", { umur: db.raw("umur + 1") })
            .where("kota", "Jakarta")
            .returning("id", "nama", "umur")
            .build();
        expect(result).toEqual({
            query: "UPDATE users SET umur = umur + 1 WHERE kota = $1 RETURNING id, nama, umur;",
            params: ["Jakarta"],
        });
    });
    test("UPDATE dengan LIMIT (Perlu Compile Option)", () => {
        const result = db.query().update("users", { status: "inactive" }).where("umur", "<", 18).orderBy("id").limit(100).build();
        expect(result).toEqual({
            query: "UPDATE users SET status = $1 WHERE umur < $2 ORDER BY id LIMIT $3;",
            params: ["inactive", 18, 100],
        });
    });
    test("Basic Delete", () => {
        const result = db.query().delete("users").where("id", 1).build();
        expect(result).toEqual({
            query: "DELETE FROM users WHERE id = $1;",
            params: [1],
        });
    });
    test("Basic Delete", () => {
        const result = db.query().delete("users").where("umur", "<", 18).build();
        expect(result).toEqual({
            query: "DELETE FROM users WHERE umur < $1;",
            params: [18],
        });
    });
    test("Basic Delete", () => {
        const result = db.query().delete("users").build();
        expect(result).toEqual({ query: "DELETE FROM users;", params: [] });
    });
    test("Delete dengan Subquery", () => {
        const result = db
            .query()
            .delete("users")
            .where("id", "IN", (query) => {
                query.select("user_id").from("orders").where("total", 0);
            })
            .build();
        expect(result).toEqual({
            query: "DELETE FROM users WHERE id IN (SELECT user_id FROM orders WHERE total = $1);",
            params: [0],
        });
    });
    test("Delete dengan EXISTS", () => {
        const result = db
            .query()
            .delete("users u")
            .whereNotExists((query) => {
                query.select("1").from("orders o").where("o.user_id", db.raw("u.id"));
            })
            .build();
        expect(result).toEqual({
            query: "DELETE FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);",
            params: [],
        });
    });
    test("DELETE ... RETURNING", () => {
        const result = db.query().delete("users").where("umur", ">", 100).returning("id", "nama").build();
        expect(result).toEqual({
            query: "DELETE FROM users WHERE umur > $1 RETURNING id, nama;",
            params: [100],
        });
    });
    test("INNER JOIN", () => {
        const result = db.query().select("e.name AS employee", "d.name AS department", "e.salary").from("employees e").innerJoin("departments d", "e.department_id", "d.id").build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department, e.salary FROM employees e INNER JOIN departments d ON e.department_id = d.id;",
            params: [],
        });
    });
    test("LEFT JOIN (LEFT OUTER JOIN)", () => {
        const result = db.query().select("e.name AS employee", "d.name AS department", "e.salary").from("employees e").leftJoin("departments d", "e.department_id", "d.id").build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department, e.salary FROM employees e LEFT JOIN departments d ON e.department_id = d.id;",
            params: [],
        });
    });
    test("RIGHT JOIN (RIGHT OUTER JOIN)", () => {
        const result = db.query().select("e.name AS employee", "d.name AS department", "e.salary").from("employees e").rightJoin("departments d", "e.department_id", "d.id").build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department, e.salary FROM employees e RIGHT JOIN departments d ON e.department_id = d.id;",
            params: [],
        });
    });
    test("FULL OUTER JOIN", () => {
        const result = db.query().select("e.name AS employee", "d.name AS department", "e.salary").from("employees e").fullOuterJoin("departments d", "e.department_id", "d.id").build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department, e.salary FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.id;",
            params: [],
        });
    });
    test("CROSS JOIN", () => {
        const result = db.query().select("e.name AS employee", "d.name AS department").from("employees e").crossJoin("departments d").build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department FROM employees e CROSS JOIN departments d;",
            params: [],
        });
    });
    test("Self JOIN (Join dengan table yang sama)", () => {
        const result = db
            .query()
            .select("e1.name AS employee", "e1.salary", "e2.name AS higher_than", "e2.salary AS lower_salary")
            .from("employees e1")
            .join("employees e2", (query) => {
                query.on("e1.department_id", "e2.department_id").on("e1.salary", ">", "e2.salary");
            })
            .build();
        expect(result).toEqual({
            query: "SELECT e1.name AS employee, e1.salary, e2.name AS higher_than, e2.salary AS lower_salary FROM employees e1 JOIN employees e2 ON e1.department_id = e2.department_id AND e1.salary > e2.salary;",
            params: [],
        });
    });
    test("Multiple JOIN + WHERE + Aggregate", () => {
        const result = db.query().select("d.name AS department", "COUNT(e.id) AS total_employee", "AVG(e.salary) AS avg_salary").from("departments d").leftJoin("employees e", "d.id", "e.department_id").groupBy("d.name").orderBy("total_employee", "DESC").build();
        expect(result).toEqual({
            query: "SELECT d.name AS department, COUNT(e.id) AS total_employee, AVG(e.salary) AS avg_salary FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.name ORDER BY total_employee DESC;",
            params: [],
        });
    });
    test("Subquery sebagai Derived Table (paling umum)", () => {
        const result = db
            .query()
            .select("e.name AS employee", "e.salary", "d.name AS department", "dept_avg.avg_salary")
            .from("employees e")
            .join("departments d", "e.department_id", "d.id")
            .join(
                (query) => {
                    query.select("department_id", "AVG(salary) AS avg_salary").from("employees").groupBy("department_id").as("dept_avg");
                },
                "e.department_id",
                "dept_avg.department_id",
            )
            .build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, e.salary, d.name AS department, dept_avg.avg_salary FROM employees e JOIN departments d ON e.department_id = d.id JOIN (SELECT department_id, AVG(salary) AS avg_salary FROM employees GROUP BY department_id) AS dept_avg ON e.department_id = dept_avg.department_id;",
            params: [],
        });
    });
    test("Subquery di ON Clause", () => {
        const result = db
            .query()
            .select("e.name", "e.salary", "d.name AS department")
            .from("employees e")
            .join("departments d", "e.department_id", "d.id")
            .where("e.salary", ">", (query) => {
                query.select("AVG(salary)").from("employees").where("department_id", db.raw("e.department_id"));
            })
            .build();
        expect(result).toEqual({
            query: "SELECT e.name, e.salary, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);",
            params: [],
        });
    });
    test("Atau versi pure JOIN + subquery", () => {
        const result = db
            .query()
            .select("e.name", "e.salary", "d.name AS department", "avg_sal.avg_salary")
            .from("employees e")
            .join("departments d", "e.department_id", "d.id")
            .join(
                (query) => {
                    query.select("department_id", "AVG(salary) AS avg_salary").from("employees").groupBy("department_id").as("avg_sal");
                },
                "e.department_id",
                "avg_sal.department_id",
            )
            .where("e.salary", ">", db.raw("avg_sal.avg_salary"))
            .build();
        expect(result).toEqual({
            query: "SELECT e.name, e.salary, d.name AS department, avg_sal.avg_salary FROM employees e JOIN departments d ON e.department_id = d.id JOIN (SELECT department_id, AVG(salary) AS avg_salary FROM employees GROUP BY department_id) AS avg_sal ON e.department_id = avg_sal.department_id WHERE e.salary > avg_sal.avg_salary;",
            params: [],
        });
    });
    test("Subquery di ON pakai AND", () => {
        const result = db
            .query()
            .select("e.name AS employee", "d.name AS department", "e.salary")
            .from("employees e")
            .join("departments d", (query) => {
                query.on("e.department_id", "d.id").on("e.salary", ">", (query) => {
                    query.select("AVG(salary)").from("employees").where("department_id", db.raw("d.id"));
                });
            })
            .build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department, e.salary FROM employees e JOIN departments d ON e.department_id = d.id AND e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = d.id);",
            params: [],
        });
    });
    test("Subquery di ON pakai OR", () => {
        const result = db
            .query()
            .select("e.name AS employee", "d.name AS department")
            .from("employees e")
            .join("departments d", (query) => {
                query.on("e.department_id", "d.id").orOn("e.salary", ">", (query) => {
                    query.select("MAX(salary)").from("employees").where("department_id", 1);
                });
            })
            .build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id OR e.salary > (SELECT MAX(salary) FROM employees WHERE department_id = $1);",
            params: [1],
        });
    });
    test("Lebih kompleks (AND + OR sekaligus)", () => {
        const result = db
            .query()
            .select("e.name", "d.name AS department", "e.salary")
            .from("employees e")
            .join("departments d", (query) => {
                query
                    .on((query) => {
                        query.on("e.department_id", "d.id").on("e.salary", ">=", (query) => {
                            query.select("AVG(salary)").from("employees").where("department_id", db.raw("d.id"));
                        });
                    })
                    .orOn((query) => {
                        query.on("d.name", db.raw("?", ["Finance"])).on("e.salary", ">", (query) => {
                            query.select("MIN(salary)").from("employees");
                        });
                    });
            })
            .build();
        expect(result).toEqual({
            query: "SELECT e.name, d.name AS department, e.salary FROM employees e JOIN departments d ON (e.department_id = d.id AND e.salary >= (SELECT AVG(salary) FROM employees WHERE department_id = d.id)) OR (d.name = $1 AND e.salary > (SELECT MIN(salary) FROM employees));",
            params: ["Finance"],
        });
    });
    test("Versi yang sering dipakai di real project", () => {
        const result = db
            .query()
            .select("e.name AS employee", "d.name AS department")
            .from("employees e")
            .leftJoin("departments d", (query) => {
                query.on("e.department_id", "d.id").onExists((query) => {
                    query.select("1").from("employees e2").where("e2.department_id", db.raw("d.id")).where("e2.salary", ">", 7000000);
                });
            })
            .build();
        expect(result).toEqual({
            query: "SELECT e.name AS employee, d.name AS department FROM employees e LEFT JOIN departments d ON e.department_id = d.id AND EXISTS (SELECT 1 FROM employees e2 WHERE e2.department_id = d.id AND e2.salary > $1);",
            params: [7000000],
        });
    });
    /**@deprecated*/
    // test("Contoh Multiple JOIN pakai USING", () => {
    //     const result = db
    //         .query()
    //         .select("e.name AS employee", "d.name AS department", "param.name AS project", "ep.role")
    //         .from("employees e")
    //         .join("departments d", (query) => query.using("department_id"))
    //         .join("employee_projects ep", (query) => query.using("employee_id"))
    //         .join("projects param", (query) => query.using("project_id"))
    //         .build();
    //     expect(result).toEqual({
    //         query: "SELECT e.name AS employee, d.name AS department, param.name AS project, ep.role FROM employees e JOIN departments d USING (department_id) JOIN employee_projects ep USING (employee_id) JOIN projects param USING (project_id);",
    //         params: [],
    //     });
    // });
    test("on() di luar callback join harus error", () => {
        const result = () => db.query().select().from("users").on("id", 1).build();
        expect(result).toThrow("Invalid usage: on()|onNot()|onExists()|onNotExists()|orOn()|orOnNot()|orOnExists()|orOnNotExists() can only be called inside a join() callback");
    });
    /**@deprecated*/
    // test("using() di luar callback join harus error", () => {
    //     const result = () => db.query().select().from("users").using("id").build();
    //     expect(result).toThrow("Invalid usage: using() can only be called inside a join() callback");
    // });
});
