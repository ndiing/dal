const util = require("util");
const fs = require("fs");
const path = require("path");
const { isAsyncFunction } = require("util/types");

const inspect = (object) => util.inspect(object, false, null, true);

// color
const black = (str) => "\x1b[30m" + str + "\x1b[39m";
const red = (str) => "\x1b[31m" + str + "\x1b[39m";
const green = (str) => "\x1b[32m" + str + "\x1b[39m";
const yellow = (str) => "\x1b[33m" + str + "\x1b[39m";
const blue = (str) => "\x1b[34m" + str + "\x1b[39m";
const magenta = (str) => "\x1b[35m" + str + "\x1b[39m";
const cyan = (str) => "\x1b[36m" + str + "\x1b[39m";
const white = (str) => "\x1b[37m" + str + "\x1b[39m";
const grey = (str) => "\x1b[90m" + str + "\x1b[39m";

// background
const bgBlack = (str) => "\x1b[40m" + str + "\x1b[49m";
const bgRed = (str) => "\x1b[41m" + str + "\x1b[49m";
const bgGreen = (str) => "\x1b[42m" + str + "\x1b[49m";
const bgYellow = (str) => "\x1b[43m" + str + "\x1b[49m";
const bgBlue = (str) => "\x1b[44m" + str + "\x1b[49m";
const bgMagenta = (str) => "\x1b[45m" + str + "\x1b[49m";
const bgCyan = (str) => "\x1b[46m" + str + "\x1b[49m";
const bgWhite = (str) => "\x1b[47m" + str + "\x1b[49m";
const bgGrey = (str) => "\x1b[100m" + str + "\x1b[49m";

// text
const reset = (str) => "\x1b[0m" + str + "\x1b[0m";
const bold = (str) => "\x1b[1m" + str + "\x1b[22m";
const dim = (str) => "\x1b[2m" + str + "\x1b[22m";
const italic = (str) => "\x1b[3m" + str + "\x1b[23m";
const underline = (str) => "\x1b[4m" + str + "\x1b[24m";
const inverse = (str) => "\x1b[7m" + str + "\x1b[27m";
const hidden = (str) => "\x1b[8m" + str + "\x1b[28m";
const strikethrough = (str) => "\x1b[9m" + str + "\x1b[29m";

const root = [];
const order = ["beforeAll", "test", "afterAll"];
const timer = {};

const time = (name) => (timer[name] = performance.now());
const timeEnd = (name, unit = "s", digit = 1) => {
    const div = {
        ms: 1,
        s: 1000,
    }[unit];
    const start = timer[name];
    const end = performance.now();
    const duration = (end - start) / div;
    return `${duration.toFixed(digit)} ${unit}`;
};
const last = () => root[root.length - 1];
const push = (item) => last().children.push(item);
const sort = () => last().children.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

function describe(title, callback) {
    root.push({ type: "describe", title, callback, children: [] });
    callback();
    sort();
}
function beforeAll(callback) {
    push({ type: "beforeAll", callback });
}
function afterAll(callback) {
    push({ type: "afterAll", callback });
}
function test(title, callback) {
    push({ type: "test", title, callback });
}
function expect(actual) {
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw {
                    actual: actual,
                    expected: expected,
                };
            }
        },
        toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw {
                    actual: actual,
                    expected: expected,
                };
            }
        },
        toThrow: (expected) => {
            let thrown = false;
            try {
                actual();
            } catch (error) {
                thrown = true;
                if (error.message !== expected) {
                    throw {
                        actual: error.message,
                        expected: expected,
                    };
                }
            }
            if (!thrown) {
                throw {
                    expected: "toThrow",
                };
            }
        },
    };
}
function load(dir, includes = []) {
    for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(".test.js") || !includes.some((reg) => reg.test(name))) {
            continue;
        }
        require(path.join(dir, name));
    }
}
async function run(includes, verbose) {
    load(path.join(process.cwd(), "test"), includes);

    time("suite");
    let passed = 0;
    let failed = 0;
    for (const d of root) {
        d.passed = 0;
        d.failed = 0;

        for (const t of d.children) {
            const name = Math.random();
            time(name);
            try {
                if (["beforeAll", "afterAll"].includes(t.type) || isAsyncFunction(t.callback)) await t.callback();
                else t.callback();
                if (t.type === "test") d.passed++;
            } catch (error) {
                if (t.type === "test") d.failed++;
                t.error = error;
            }
            t.time = timeEnd(name, "ms", 2);
        }

        console.log(d.failed ? bgRed(" fail ") : `${bgGreen(" pass ")} ${d.title}`);
        for (const t of d.children) {
            if (t.title && (t.error || verbose)) console.log(t.error ? red("✗") : green("✓"), dim(t.title), dim(`(${t.time})`));
            if (t.error) {
                if (t.error?.actual) {
                    console.log(bgYellow(black(" actual ")));
                    console.log(t.error.actual);
                }
                if (t.error?.expected) {
                    console.log(bgYellow(black(" expected ")));
                    console.log(t.error.expected);
                }
                console.log(t.error);
            }
        }
        const arr = [];
        if (d.passed > 0) arr.push(green(`${d.passed} passed`));
        if (d.failed > 0) arr.push(red(`${d.failed} failed`));
        arr.push(white(`${d.passed + d.failed} total`));
        if (verbose) console.log(`tests: ${arr.join(", ")}`);

        passed += d.passed;
        failed += d.failed;
    }

    const arr = [];
    if (passed > 0) arr.push(green(`${passed} passed`));
    if (failed > 0) arr.push(red(`${failed} failed`));
    arr.push(white(`${passed + failed} total`));
    console.log(`tests: ${arr.join(", ")}`);
    console.log(`time: ${timeEnd("suite", "s", 4)}`);
}

global.describe = describe;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.test = test;
global.expect = expect;

run(
    [
        // /.*/,
        // /repository-tsql/,
        // /repository-plpgsql/,
        // /repository-sqlitesql/,
        // /schema-tsql/,
        // /schema-plpgsql/,
        // /schema-sqlitesql/,
        // /raw-tsql/,
        // /raw-plpgsql/,
        // /raw-sqlitesql/,
        /migration-tsql/,
        /migration-plpgsql/,
        /migration-sqlitesql/,
    ],
    true,
);
