const Database = require("../src/db/database.js");

const db = new Database({
    client: "mssql",
    connection: {
        database: "test",
    },
});

describe("schema-tsql", () => {
    test("inline constraint", () => {
        const result = db
            .schema()
            .createTable("kategori", (table) => {
                table.column("id_kategori").int().primaryKey().identity();
                table.column("nama_kategori").varChar(50).notNull();
            })
            .createTable("produk", (table) => {
                table.column("id_produk").int().notNull().primaryKey();
                table.column("kode_sku").varChar(20).notNull().unique();
                table.column("nama_produk").varChar(100).notNull();
                table.column("harga").decimal(10, 2).default(0.0);
                table.column("stok").int().check("stok", ">=", 0);
                table.column("id_kategori").int().references("kategori", "id_kategori");
                table.index().on("id_kategori");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE kategori (id_kategori INT PRIMARY KEY IDENTITY(1, 1), nama_kategori VARCHAR(50) NOT NULL);",
            },
            {
                query: "CREATE TABLE produk (id_produk INT NOT NULL PRIMARY KEY, kode_sku VARCHAR(20) NOT NULL UNIQUE, nama_produk VARCHAR(100) NOT NULL, harga DECIMAL(10, 2) DEFAULT 0, stok INT CHECK (stok >= 0), id_kategori INT REFERENCES kategori (id_kategori));",
            },
            {
                query: "CREATE INDEX IX_produk_id_kategori ON produk (id_kategori);",
            },
        ]);
    });

    test("inline auto named constraint", () => {
        const result = db
            .schema()
            .createTable("kategori", (table) => {
                table.column("id_kategori").int().constraint().primaryKey();
                table.column("nama_kategori").varChar(50).notNull();
            })
            .createTable("produk", (table) => {
                table.column("id_produk").int().notNull().constraint().primaryKey();
                table.column("kode_sku").varChar(20).notNull().constraint().unique();
                table.column("nama_produk").varChar(100).notNull();
                table.column("harga").decimal(10, 2).constraint().default(0.0);
                table.column("stok").int().constraint().check("stok", ">=", 0);
                table.column("id_kategori").int().constraint().references("kategori", "id_kategori");
                table.index(true).on("id_kategori");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE kategori (id_kategori INT CONSTRAINT PK_kategori_id_kategori PRIMARY KEY, nama_kategori VARCHAR(50) NOT NULL);",
            },
            {
                query: "CREATE TABLE produk (id_produk INT NOT NULL CONSTRAINT PK_produk_id_produk PRIMARY KEY, kode_sku VARCHAR(20) NOT NULL CONSTRAINT UQ_produk_kode_sku UNIQUE, nama_produk VARCHAR(100) NOT NULL, harga DECIMAL(10, 2) CONSTRAINT DF_produk_harga DEFAULT 0, stok INT CONSTRAINT CK_produk_stok CHECK (stok >= 0), id_kategori INT CONSTRAINT FK_produk_id_kategori_kategori_id_kategori REFERENCES kategori (id_kategori));",
            },
            {
                query: "CREATE INDEX IX_produk_id_kategori ON produk (id_kategori);",
            },
        ]);
    });

    test("inline named constraint", () => {
        const result = db
            .schema()
            .createTable("kategori", (table) => {
                table.column("id_kategori").int().constraint("PK_name").primaryKey();
                table.column("nama_kategori").varChar(50).notNull();
            })
            .createTable("produk", (table) => {
                table.column("id_produk").int().notNull().constraint("PK_name").primaryKey();
                table.column("kode_sku").varChar(20).notNull().constraint("UQ_name").unique();
                table.column("nama_produk").varChar(100).notNull();
                table.column("harga").decimal(10, 2).constraint("DF_name").default(0.0);
                table.column("stok").int().constraint("CK_name").check("stok", ">=", 0);
                table.column("id_kategori").int().constraint("FK_name").references("kategori", "id_kategori");
                table.index("IX_name").on("id_kategori");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE kategori (id_kategori INT CONSTRAINT PK_name PRIMARY KEY, nama_kategori VARCHAR(50) NOT NULL);",
            },
            {
                query: "CREATE TABLE produk (id_produk INT NOT NULL CONSTRAINT PK_name PRIMARY KEY, kode_sku VARCHAR(20) NOT NULL CONSTRAINT UQ_name UNIQUE, nama_produk VARCHAR(100) NOT NULL, harga DECIMAL(10, 2) CONSTRAINT DF_name DEFAULT 0, stok INT CONSTRAINT CK_name CHECK (stok >= 0), id_kategori INT CONSTRAINT FK_name REFERENCES kategori (id_kategori));",
            },
            { query: "CREATE INDEX IX_name ON produk (id_kategori);" },
        ]);
    });

    test("multiple inline constraint", () => {
        const result = db
            .schema()
            .createTable("akun_induk", (table) => {
                table.column("email_induk").varChar(100).primaryKey();
            })
            .createTable("profil_pengguna", (table) => {
                table.column("email").varChar(100).primaryKey().unique().default("system@company.com").check("email", "LIKE", "%@%.%").references("akun_induk", "email_induk");
                table.column("nama_lengkap").varChar(100);
                table.index().on("email");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE akun_induk (email_induk VARCHAR(100) PRIMARY KEY);",
            },
            {
                query: "CREATE TABLE profil_pengguna (email VARCHAR(100) UNIQUE PRIMARY KEY DEFAULT 'system@company.com' CHECK (email LIKE '%@%.%') REFERENCES akun_induk (email_induk), nama_lengkap VARCHAR(100));",
            },
            {
                query: "CREATE INDEX IX_profil_pengguna_email ON profil_pengguna (email);",
            },
        ]);
    });

    test("multiple inline auto named constraint", () => {
        const result = db
            .schema()
            .createTable("akun_induk", (table) => {
                table.column("email_induk").varChar(100).constraint().primaryKey();
            })
            .createTable("profil_pengguna", (table) => {
                table.column("email").varChar(100).constraint().primaryKey().constraint().unique().constraint().default("system@company.com").constraint().check("email", "LIKE", "%@%.%").constraint().references("akun_induk", "email_induk");
                table.column("nama_lengkap").varChar(100);
                table.index(true).on("email");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE akun_induk (email_induk VARCHAR(100) CONSTRAINT PK_akun_induk_email_induk PRIMARY KEY);",
            },
            {
                query: "CREATE TABLE profil_pengguna (email VARCHAR(100) CONSTRAINT PK_profil_pengguna_email PRIMARY KEY CONSTRAINT UQ_profil_pengguna_email UNIQUE CONSTRAINT DF_profil_pengguna_email DEFAULT 'system@company.com' CONSTRAINT CK_profil_pengguna_email CHECK (email LIKE '%@%.%') CONSTRAINT FK_profil_pengguna_email_akun_induk_email_induk REFERENCES akun_induk (email_induk), nama_lengkap VARCHAR(100));",
            },
            {
                query: "CREATE INDEX IX_profil_pengguna_email ON profil_pengguna (email);",
            },
        ]);
    });

    test("multiple inline named constraint", () => {
        const result = db
            .schema()
            .createTable("akun_induk", (table) => {
                table.column("email_induk").varChar(100).constraint("PK_name").primaryKey();
            })
            .createTable("profil_pengguna", (table) => {
                table.column("email").varChar(100).constraint("PK_name").primaryKey().constraint("UQ_name").unique().constraint("DF_name").default("system@company.com").constraint("CK_name").check("email", "LIKE", "%@%.%").constraint("FK_name").references("akun_induk", "email_induk");
                table.column("nama_lengkap").varChar(100);
                table.index("IX_name").on("email");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE akun_induk (email_induk VARCHAR(100) CONSTRAINT PK_name PRIMARY KEY);",
            },
            {
                query: "CREATE TABLE profil_pengguna (email VARCHAR(100) CONSTRAINT PK_name PRIMARY KEY CONSTRAINT UQ_name UNIQUE CONSTRAINT DF_name DEFAULT 'system@company.com' CONSTRAINT CK_name CHECK (email LIKE '%@%.%') CONSTRAINT FK_name REFERENCES akun_induk (email_induk), nama_lengkap VARCHAR(100));",
            },
            { query: "CREATE INDEX IX_name ON profil_pengguna (email);" },
        ]);
    });

    test("multiple block constraint", () => {
        const result = db
            .schema()
            .createTable("akun_induk", (table) => {
                table.column("email_induk").varChar(100);

                table.primaryKey("email_induk");
            })
            .createTable("profil_pengguna", (table) => {
                table.column("email").varChar(100);
                table.column("nama_lengkap").varChar(100);

                table.primaryKey("email");
                table.unique("email");
                table.default("system@company.com").for("email");
                table.check("email", "LIKE", "%@%.%");
                table.foreignKey("email").references("akun_induk", "email_induk");

                table.index().on("email");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE akun_induk (email_induk VARCHAR(100), PRIMARY KEY (email_induk));",
            },
            {
                query: "CREATE TABLE profil_pengguna (email VARCHAR(100), nama_lengkap VARCHAR(100), UNIQUE (email), PRIMARY KEY (email), DEFAULT 'system@company.com' FOR email, CHECK (email LIKE '%@%.%'), FOREIGN KEY (email) REFERENCES akun_induk (email_induk));",
            },
            {
                query: "CREATE INDEX IX_profil_pengguna_email ON profil_pengguna (email);",
            },
        ]);
    });

    test("multiple block auto named constraint", () => {
        const result = db
            .schema()
            .createTable("akun_induk", (table) => {
                table.column("email_induk").varChar(100);

                table.constraint().primaryKey("email_induk");
            })
            .createTable("profil_pengguna", (table) => {
                table.column("email").varChar(100);
                table.column("nama_lengkap").varChar(100);

                table.constraint().primaryKey("email");
                table.constraint().unique("email");
                table.constraint().default("system@company.com").for("email");
                table.constraint().check("email", "LIKE", "%@%.%");
                table.constraint().foreignKey("email").references("akun_induk", "email_induk");

                table.index(true).on("email");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE akun_induk (email_induk VARCHAR(100), CONSTRAINT PK_akun_induk_email_induk PRIMARY KEY (email_induk));",
            },
            {
                query: "CREATE TABLE profil_pengguna (email VARCHAR(100), nama_lengkap VARCHAR(100), CONSTRAINT PK_profil_pengguna_email PRIMARY KEY (email), CONSTRAINT UQ_profil_pengguna_email UNIQUE (email), CONSTRAINT DF_profil_pengguna_email DEFAULT 'system@company.com' FOR email, CONSTRAINT CK_profil_pengguna_email CHECK (email LIKE '%@%.%'), CONSTRAINT FK_profil_pengguna_email_akun_induk_email_induk FOREIGN KEY (email) REFERENCES akun_induk (email_induk));",
            },
            {
                query: "CREATE INDEX IX_profil_pengguna_email ON profil_pengguna (email);",
            },
        ]);
    });

    test("multiple block named constraint", () => {
        const result = db
            .schema()
            .createTable("akun_induk", (table) => {
                table.column("email_induk").varChar(100);

                table.constraint("PK_name").primaryKey("email_induk");
            })
            .createTable("profil_pengguna", (table) => {
                table.column("email").varChar(100);
                table.column("nama_lengkap").varChar(100);

                table.constraint("PK_name").primaryKey("email");
                table.constraint("UQ_name").unique("email");
                table.constraint("DF_name").default("system@company.com").for("email");
                table.constraint("CK_name").check("email", "LIKE", "%@%.%");
                table.constraint("FK_name").foreignKey("email").references("akun_induk", "email_induk");

                table.index("IX_name").on("email");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE akun_induk (email_induk VARCHAR(100), CONSTRAINT PK_name PRIMARY KEY (email_induk));",
            },
            {
                query: "CREATE TABLE profil_pengguna (email VARCHAR(100), nama_lengkap VARCHAR(100), CONSTRAINT PK_name PRIMARY KEY (email), CONSTRAINT UQ_name UNIQUE (email), CONSTRAINT DF_name DEFAULT 'system@company.com' FOR email, CONSTRAINT CK_name CHECK (email LIKE '%@%.%'), CONSTRAINT FK_name FOREIGN KEY (email) REFERENCES akun_induk (email_induk));",
            },
            { query: "CREATE INDEX IX_name ON profil_pengguna (email);" },
        ]);
    });

    test("create table, column, and constraint", () => {
        const result = db
            .schema()
            .createTable("table", (table) => {
                table.column("col1").int();
                table.column("col2").text();
                table.constraint().primaryKey("col1");
                table.constraint().unique("col2");
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE table (col1 INT, col2 TEXT, CONSTRAINT PK_table_col1 PRIMARY KEY (col1), CONSTRAINT UQ_table_col2 UNIQUE (col2));",
            },
        ]);
    });
    test("alter table add column and constraint", () => {
        const result = db
            .schema()
            .alterTable("table", (table) => {
                table.addColumn("col1").int();
                table.addColumn("col2").text();
                table.addConstraint().primaryKey("col1");
                table.addConstraint().unique("col2");
            })
            .build();
        expect(result).toEqual([
            {
                query: "ALTER TABLE table ADD col1 INT, col2 TEXT, CONSTRAINT PK_table_col1 PRIMARY KEY (col1), CONSTRAINT UQ_table_col2 UNIQUE (col2);",
            },
        ]);
    });
    test("alter table alter column", () => {
        const result = db
            .schema()
            .alterTable("table", (table) => {
                table.alterColumn("col1").int();
                table.alterColumn("col2").text();
            })
            .build();
        expect(result).toEqual([{ query: "ALTER TABLE table ALTER COLUMN col1 INT;" }, { query: "ALTER TABLE table ALTER COLUMN col2 TEXT;" }]);
    });

    test("alter table drop column and constraint", () => {
        const result = db
            .schema()
            .alterTable("table", (table) => {
                table.dropColumn("col1").int();
                table.dropColumn("col2").text();
                table.dropConstraint().primaryKey("col1");
                table.dropConstraint().unique("col2");
            })
            .build();
        expect(result).toEqual([
            {
                query: "ALTER TABLE table DROP COLUMN col1, DROP COLUMN col2, DROP CONSTRAINT PK_table_col1, DROP CONSTRAINT UQ_table_col2;",
            },
        ]);
    });

    test("drop table", () => {
        const result = db.schema().dropTable("users").build();
        expect(result).toEqual([{ query: "DROP TABLE users;" }]);
    });

    test("grouping check", () => {
        const result = db
            .schema()
            .createTable("table", (table) => {
                table.column("col").varChar(100).check("col", 1).check("col", 1);
                table.column("col2").varChar(100).check("col2", 1).orCheck("col2", 1);

                table.column("col3").varChar(100).check("col3", 1).checkNot("col3", 1).orCheck("col3", 1).orCheckNot("col3", 1);

                table
                    .column("col4")
                    .varChar(100)
                    .constraint()
                    .check((constraint) => {
                        constraint.check("col4", 1).orCheck("col4", 1);
                    })
                    .orCheck((constraint) => {
                        constraint.check("col4", 1).orCheck("col4", 1);
                    });
            })
            .build();
        expect(result).toEqual([
            {
                query: "CREATE TABLE table (col VARCHAR(100) CHECK (col = 1 AND col = 1), col2 VARCHAR(100) CHECK (col2 = 1 OR col2 = 1), col3 VARCHAR(100) CHECK (col3 = 1 AND NOT col3 = 1 OR col3 = 1 OR NOT col3 = 1), col4 VARCHAR(100) CONSTRAINT CK_table_col4 CHECK ((col4 = 1 OR col4 = 1) OR (col4 = 1 OR col4 = 1)));",
            },
        ]);
    });

    test("test", () => {
        db.schema().createTable("table", (table) => {
            table.column("col1")
        });
    });
});
