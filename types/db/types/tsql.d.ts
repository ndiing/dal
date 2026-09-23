export = TSQLTypes;
declare const TSQLTypes: {
    varChar: (length: any) => {
        type: string;
        length: any;
    };
    nVarChar: (length: any) => {
        type: string;
        length: any;
    };
    text: () => {
        type: string;
    };
    int: () => {
        type: string;
    };
    bigInt: () => {
        type: string;
    };
    tinyInt: () => {
        type: string;
    };
    smallInt: () => {
        type: string;
    };
    bit: () => {
        type: string;
    };
    float: () => {
        type: string;
    };
    numeric: (precision: any, scale: any) => {
        type: string;
        precision: any;
        scale: any;
    };
    decimal: (precision: any, scale: any) => {
        type: string;
        precision: any;
        scale: any;
    };
    real: () => {
        type: string;
    };
    date: () => {
        type: string;
    };
    dateTime: () => {
        type: string;
    };
    dateTime2: (scale: any) => {
        type: string;
        scale: any;
    };
    dateTimeOffset: (scale: any) => {
        type: string;
        scale: any;
    };
    smallDateTime: () => {
        type: string;
    };
    time: (scale: any) => {
        type: string;
        scale: any;
    };
    uniqueIdentifier: () => {
        type: string;
    };
    smallMoney: () => {
        type: string;
    };
    money: () => {
        type: string;
    };
    binary: (length: any) => {
        type: string;
        length: any;
    };
    varBinary: (length: any) => {
        type: string;
        length: any;
    };
    image: () => {
        type: string;
    };
    xml: () => {
        type: string;
    };
    char: (length: any) => {
        type: string;
        length: any;
    };
    nChar: (length: any) => {
        type: string;
        length: any;
    };
    nText: () => {
        type: string;
    };
    tvp: (tvpType: any) => {
        type: string;
        tvpType: any;
    };
    udt: () => {
        type: string;
    };
    geography: () => {
        type: string;
    };
    geometry: () => {
        type: string;
    };
    variant: () => {
        type: string;
    };
};
//# sourceMappingURL=tsql.d.ts.map