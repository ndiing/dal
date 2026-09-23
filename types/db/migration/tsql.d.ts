export = TSQLMigration;
import Migration = require("../migration.js");
declare class TSQLMigration extends Migration {
    _hasTable(): Promise<any>;
    _createTable(): Promise<any>;
}
