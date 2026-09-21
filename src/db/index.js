const { isBoolean, isString } = require("./util");

class Index {
    /**@private*/ _table = null;
    /**@private*/ _method = null;
    /**@private*/ _name = null;
    /**@private*/ _on = null;

    constructor(table = null, method = null, name = null) {
        this._table = table;
        this._method = method;
        this._name = name;
    }

    on(...columns) {
        this._on = columns;
        return this;
    }
}

module.exports = Index;
