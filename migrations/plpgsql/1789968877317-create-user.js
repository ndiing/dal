/**@param {import('../../src/db/migration.js').Context} context*/
exports.up = ({ query, schema, raw } = {}) => {
    schema().createTable("users2", (table) => {
        table.column("id").serial().primaryKey();
        table.column("name").varChar(100).notNull();
        table.column("email").varChar(100).notNull().unique();
        table.column("age").int().notNull();
        table.column("is_active").int().notNull().default(1);
        table.column("created_at").timestamptz().default(raw("CURRENT_TIMESTAMP"));
        table.column("updated_at").timestamptz().default(raw("CURRENT_TIMESTAMP"));
        table.column("is_deleted").int().default(0).check("is_deleted", "IN", [0, 1]);

        table.index().on("is_deleted");
    });

};

/**@param {import('../../src/db/migration.js').Context} context*/
exports.down = ({schema} = {}) => {
    schema().dropTable('users2')
};
