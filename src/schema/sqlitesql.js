const Schema = require("../schema.js");

class SQLiteSQLSchema extends Schema {
    /**@override*/
    _buildIdentity(_identity) {
        return "AUTOINCREMENT";
    }
}

module.exports = SQLiteSQLSchema;
