class Thenable {
    /**@type {import("./client.js")}*/
    client = null;
    /**@private*/ _transforms = [];

    constructor(client) {
        this.client = client;
    }

    /**@private*/
    _transform(rows) {
        return this._transforms.reduce((acc, fn) => fn(acc), rows);
    }

    first(column) {
        this._transforms.push((rows) => rows?.[0]?.[column] ?? rows?.[0] ?? null);
        return this;
    }

    count() {
        this._transforms.push((rows) => rows.length);
        return this;
    }

    exists() {
        this._transforms.push((rows) => rows.length > 0);
        return this;
    }

    pluck(column) {
        this._transforms.push((rows) => rows.map((row) => row[column]));
        return this;
    }

    then(onfulfilled, onrejected) {
        const { query, params } = this.build();
        if (this.client.debug) {
            console.log({ query, params });
        }
        return Promise.resolve(this.client.execute(query, params))
            .then((result) => this._transform(result))
            .then(onfulfilled, onrejected);
    }

    catch(onrejected) {
        return this.then(null, onrejected);
    }

    finally(onfinally) {
        return this.then(
            (value) => Promise.resolve(onfinally()).then(() => value),
            (reason) =>
                Promise.resolve(onfinally()).then(() => {
                    throw reason;
                }),
        );
    }
}

module.exports = Thenable;
