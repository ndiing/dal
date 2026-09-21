const Schema = require("../schema");

class SQLiteSQLSchema extends Schema {
    /**@override*/
    _buildIdentity(_identity) {
        return "AUTOINCREMENT";
    }
}

module.exports = SQLiteSQLSchema;
