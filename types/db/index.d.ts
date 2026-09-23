export = Index;
declare class Index {
    /**@private*/ private _table;
    /**@private*/ private _method;
    /**@private*/ private _name;
    /**@private*/ private _on;
    constructor(table?: null, method?: null, name?: null);
    on(...columns: any[]): this;
}
//# sourceMappingURL=index.d.ts.map