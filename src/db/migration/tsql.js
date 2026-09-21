const Migration = require("../migration.js");

class TSQLMigration extends Migration {
    async _hasTable() {
        return await this.client.query().select().from("INFORMATION_SCHEMA.TABLES").where("TABLE_NAME", this.tableName).exists();
    }

    async _createTable() {
        return await this.client.schema().createTable(this.tableName, (table) => {
            table.column("id").int().primaryKey().identity();
            table.column("batch").int().notNull();
            table.column("name").varChar(256).notNull().unique();
            table.column("applied_at").dateTimeOffset().notNull().default(this.client.raw("SYSDATETIMEOFFSET()"));
        });
    }
}

module.exports = TSQLMigration;
