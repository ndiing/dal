# @ndiinginc/dal

A lightweight, chainable SQL query builder, schema builder, migration runner, and repository layer for Node.js.

One API, three databases:

| Driver     | `client` value   | Dialect     |
| ---------- | ---------------- | ----------- |
| SQLite     | `better-sqlite3` | `sqlitesql` |
| PostgreSQL | `pg`             | `plpgsql`   |
| SQL Server | `mssql`          | `tsql`      |

## Features

- Fluent query builder: `select`, `insert`, `update`, `delete`, joins, subqueries, CTEs (`with` / `withRecursive`), `union`, `groupBy` / `having`, `limit` / `offset`, `returning`
- Parameterized queries by default (named params on SQLite/MSSQL, `$n` on PostgreSQL)
- Schema builder with per-dialect column types, constraints, foreign keys, and indexes
- Batch-based migrations with `up` / `down`, run inside a transaction
- Nested transactions (savepoints on SQLite)
- `Repository` base class: CRUD, upsert, search, filters, sorters, pagination, soft delete
- Drivers are loaded lazily, so install only the one you use

## Installation

```bash
npm install @ndiinginc/dal
```

Then install the driver for your database:

```bash
npm install better-sqlite3   # SQLite
npm install pg               # PostgreSQL
npm install mssql msnodesqlv8 # SQL Server
```

## Quick start

```js
const Database = require("@ndiinginc/dal");

const db = new Database({
    client: "pg", // "better-sqlite3" | "pg" | "mssql"
    connection: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "secret",
        database: "app",
    },
    debug: false, // log every query and its params
});

const users = await db.query().select().from("users").where("active", true).orderBy("id", "DESC").limit(10);

await db.close();
```

Queries are thenable: `await` them directly, no `.execute()` needed.

## Configuration

```js
new Database({
    client: "better-sqlite3",
    connection: { database: "./app.db" },
    migrations: {
        cwd: process.cwd(),
        directory: "migrations",
        tableName: "migrations",
    },
    debug: true,
});
```

### Connection defaults

**better-sqlite3**

`database` defaults to `:memory:`. The following pragmas are applied on connect (override any of them via `connection.options`):

`journal_mode=WAL`, `synchronous=NORMAL`, `foreign_keys=ON`, `busy_timeout=5000`, `temp_store=MEMORY`, `cache_size=-262144`, `mmap_size=268435456`, `auto_vacuum=INCREMENTAL`, and more.

**pg**: `host: "localhost"`, `port: 5432`. Everything else is passed to `pg.Pool`.

**mssql**: `server: "localhost"`, `trustedConnection: true`, `trustServerCertificate: true`. Everything else is passed to `mssql.ConnectionPool`.

## Query builder

### Select

```js
await db.query().select().from("users"); // SELECT *
await db.query().select("id", "name").from("users");
await db.query().select().from("users").where("id", 1).first(); // single row or null
```

### Where

```js
db.query().select().from("users").where("age", ">=", 18).whereNot("role", "banned").orWhere("role", "admin").whereExists(/* ... */);

// Grouping with a callback
db.query()
    .select()
    .from("users")
    .where((q) => {
        q.where("role", "admin").orWhere("role", "staff");
    });
```

Available: `where`, `whereNot`, `whereExists`, `whereNotExists`, and their `or*` variants. Two-argument form (`where("id", 1)`) defaults the operator to `=`. Passing `null` as the value produces `NULL`.

### Joins

```js
db.query().select("u.name", "o.total").from("users u").leftJoin("orders o", "o.user_id", "=", "u.id");
```

Available: `join`, `innerJoin`, `leftJoin`, `rightJoin`, `fullOuterJoin`, `crossJoin`, plus `on`, `orOn`, and their `Not` / `Exists` variants for multi-condition joins.

### Insert, update, delete

```js
// Single row
await db.query().insert("users", { name: "Ndiing", email: "a@b.com" }).returning();

// Multiple rows
await db
    .query()
    .insert("users", [{ name: "A" }, { name: "B" }])
    .returning();

// Upsert
await db.query().insert("users", { email: "a@b.com", name: "New" }).onConflict("email").doUpdate().returning();
await db.query().insert("users", { email: "a@b.com" }).onConflict("email").doNothing();

// Update
await db.query().update("users", { name: "Updated" }).where("id", 1).returning();

// Delete
await db.query().delete("users").where("id", 1).returning();
```

### Result helpers

Chain these to shape the result:

| Method         | Returns                             |
| -------------- | ----------------------------------- |
| `.first(col?)` | first row, or a single column value |
| `.pluck(col)`  | array of one column's values        |
| `.count()`     | number of rows returned             |
| `.exists()`    | `true` if any row was returned      |

### Grouping, ordering, pagination, unions, CTEs

```js
db.query().select("role").from("users").groupBy("role").having("role", "!=", "guest");
db.query().select().from("users").orderBy("created_at", "DESC").limit(20).offset(40);

db.query()
    .select()
    .from("a")
    .union((q) => q.select().from("b"));

db.query()
    .with("recent", (q) => q.select().from("orders").where("created_at", ">", "2026-01-01"))
    .select()
    .from("recent");
```

Subqueries can be passed anywhere a column, table, or value is accepted, as a callback receiving a query.

### Raw SQL

```js
// ? is a value placeholder, ?? is an identifier
await db.raw("SELECT * FROM users WHERE id = ?", 1);
await db.raw("SELECT ?? FROM users WHERE role = ?role", { role: "admin" });

// Use raw expressions inside builders
db.query()
    .update("users", { updated_at: db.raw("CURRENT_TIMESTAMP") })
    .where("id", 1);

// Or run a statement directly
await db.execute("DELETE FROM sessions WHERE expired = @expired", { expired: 1 });
```

Escape helpers: `db.escapeIdentifier()`, `db.escapeLiteral()`, `db.escapeLike()`, `db.escapeGlob()`.

## Transactions

```js
const result = await db.transaction(async (trx) => {
    await trx.query().insert("accounts", { name: "A", balance: 100 });
    await trx.query().update("accounts", { balance: 50 }).where("name", "B");
    return "done";
});
```

The transaction commits when the callback resolves and rolls back if it throws. Always use the `trx` client inside the callback, not `db`.

## Schema builder

```js
await db.schema().createTable("users", (table) => {
    table.column("id").serial().primaryKey();
    table.column("email").varChar(255).notNull().unique();
    table.column("role").varChar(32).notNull().default(db.raw("'user'"));
    table.column("created_at").timestamptz().notNull().default(db.raw("CURRENT_TIMESTAMP"));
});

await db.schema().createTable("posts", (table) => {
    table.column("id").serial().primaryKey();
    table.column("user_id").integer().notNull().references("users", "id");
    table.column("title").text();
    table.createIndex("idx_posts_user").on("user_id");
});

await db.schema().alterTable("users", (table) => {
    table.addColumn("bio").text();
    table.dropColumn("role");
});

await db.schema().dropTable("posts");
```

Column type methods depend on the dialect (`serial`, `jsonb`, `uuid` on PostgreSQL; `dateTime2`, `uniqueIdentifier` on SQL Server; `blob`, `clob` on SQLite, and so on). Common modifiers: `notNull()`, `null()`, `unique()`, `primaryKey()`, `default()`, `identity()`, `check()`, `references()`.

## Migrations

Place migration files in `migrations/<dialect>/`, where `<dialect>` is `sqlitesql`, `plpgsql`, or `tsql`:

```
migrations/
└── plpgsql/
    ├── 001_create_users.js
    └── 002_create_posts.js
```

Files run in filename order. Each exports `up` and `down`, which receive a context with `query`, `schema`, and `raw`:

```js
// migrations/plpgsql/001_create_users.js
exports.up = ({ schema }) => {
    schema().createTable("users", (table) => {
        table.column("id").serial().primaryKey();
        table.column("email").varChar(255).notNull().unique();
    });
};

exports.down = ({ schema }) => {
    schema().dropTable("users");
};
```

Run them:

```js
await db.migrate(); // apply all pending migrations as one batch
await db.rollback(); // revert the last batch
```

Applied migrations are tracked in a `migrations` table (configurable via `migrations.tableName`). `migrate()` and `rollback()` each run in a single transaction.

## Repository

Extend `Repository` to get CRUD, pagination, search, and soft delete for a table.

```js
const { Repository } = require("@ndiinginc/dal");

class UserRepository extends Repository {
    table = "users";
    primaryKey = "id"; // or ["tenant_id", "id"] for composite keys
    searchableColumns = ["name", "email"];
    conflictColumns = ["email"]; // used by upsert
    softDelete = "deleted"; // optional: flag column for soft delete
    columns = {
        id: { type: "integer", primary: true },
        name: { type: "text" },
        email: { type: "text" },
        deleted: { type: "integer" },
    };
}

const users = new UserRepository(db);

await users.create({ name: "A", email: "a@b.com" });
await users.createMany([{ name: "B" }, { name: "C" }]);
await users.upsert({ name: "A2", email: "a@b.com" });

await users.get(1);
await users.getBy({ email: "a@b.com" });

const { rows, meta } = await users.getAll({
    search: "ndi",
    filters: { role: "admin", age: { ">=": 18 } },
    sorters: { created_at: "desc" },
    page: 1,
    limit: 10,
});
// meta: { page, limit, offset, prev, next, start, end }

await users.update(1, { name: "New" });
await users.delete(1); // soft delete if `softDelete` is set
await users.restore(1); // only available with `softDelete`
```

Filters and sorters are validated against `columns`, so unknown columns, unsupported operators, and invalid sort directions throw before any SQL runs.

## Debugging

Set `debug: true` to log every query and its params to the console.

## License

MIT
