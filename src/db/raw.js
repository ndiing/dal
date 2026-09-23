const Thenable = require("./thenable.js");
const { isArray, isPlainObject, RAW, QUERY } = require("./util.js");

class Raw extends Thenable {
    [RAW] = true;
    /**@private*/ _query = null;
    /**@private*/ _params = null;
    /**@private*/ _counter = {};
    query = null;
    params = null;
    used = null;

    constructor(client) {
        super(client);
        this.params = this.client.defaultParams();
    }

    set(query = null, ...params) {
        this._query = query;
        this._params = isArray(params[0]) || isPlainObject(params[0]) ? params[0] : params;
        return this;
    }

    /**@private*/
    _setParams(params) {
        if (isArray(this.params)) {
            for (const value of params) {
                this.params.push(value);
            }
        } else {
            for (const name in params) {
                this.params[name] = params[name];
            }
        }
    }

    /**@private*/
    _buildRawQuery(value) {
        if (value && (value[RAW] || value[QUERY])) {
            value._reference = true;
            value._counter = this._counter;
            const res = value.build();
            this._counter = value._counter;
            this._setParams(res.params);
            value = res.query;
        }
        return value;
    }

    build() {
        if (this.used) {
            return [];
        }
        this.used = true;

        if (Array.isArray(this._query)) {
            this.query = this._query.reduce((acc, curr, i) => {
                let val = this._params[i - 1];
                val = this._buildRawQuery(val);
                return acc + val + curr;
            });
        } else {
            let i = 0;
            this.query = String(this._query).replace(/(\?{2}(\w+)?)|(\?(\w+)?)/g, (_match, isIdentifier, identifier, _isPlaceholder, placeholder) => {
                if (isIdentifier) {
                    const column = isArray(this._params) ? this._params[i++] : this._params[identifier];
                    return this.client.escapeIdentifier(column);
                }
                const name = this.client.defaultPlaceholder(placeholder);
                let key = name;
                if (!this._counter[name]) this._counter[name] = 1;
                else key += this._counter[name]++;
                const value = isArray(this._params) ? this._params[i++] : this._params[placeholder];
                if (isArray(this.params)) this._setParams([value]);
                else this._setParams({ [key]: value });
                return this.client.formatPlaceholder(key);
            });
        }
        return { query: this.query, params: this.params };
    }
}

module.exports = Raw;
