export = TSQLSchema;
import Schema = require("../schema");
declare class TSQLSchema extends Schema {
    build(): {
        query: string;
    }[];
}
