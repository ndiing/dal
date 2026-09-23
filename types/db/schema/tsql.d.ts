export = TSQLSchema;
import Schema = require("../schema");
declare class TSQLSchema extends Schema {
    _buildConstraint(constraint: any, str: any): string;
    _buildIdentity(_identity: any): string;
    _buildColumn(column: any): string;
    build(): {
        query: string;
    }[];
}
//# sourceMappingURL=tsql.d.ts.map