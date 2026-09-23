export = SQLiteSQLMigration;
import Migration = require("../migration.js");
declare class SQLiteSQLMigration extends Migration {
    _hasTable(): Promise<any>;
    _createTable(): Promise<any>;
}
