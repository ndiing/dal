const Migration = require("../migration.js");

class SQLiteSQLMigration extends Migration{
    
    async _hasTable() {
        return await this.client
            .query()
            .select()
            .from("sqlite_master")
            .where("type", 'table')
            .where("name", this.tableName)
            .exists();
    }

    async _createTable() {
        return await this.client.schema().createTable(this.tableName, (table) => {
            table.column("id").integer().primaryKey().identity();
            table.column("batch").integer().notNull();
            table.column("name").varChar(256).notNull().unique();
            table.column("applied_at").dateTime().notNull().default(this.client.raw("CURRENT_TIMESTAMP"));
        });
    }

}

module.exports=SQLiteSQLMigration
