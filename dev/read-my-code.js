const fs = require("fs");
const path = require("path");

function read(file) {
    try {
        return fs.readFileSync(file, "utf8");
    } catch (error) {
        return null;
    }
}

function write(file, data) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(file, data);
}

function readFiles(parentPath = "./", blacklist = [], whitelist = [], result = {}) {
    const dirents = fs.readdirSync(parentPath, { withFileTypes: true });

    for (const dirent of dirents) {
        const currentPath = path.join(dirent.parentPath, dirent.name);

        if (blacklist.some((regexp) => regexp.test(currentPath))) {
            continue;
        }

        if (dirent.isDirectory()) {
            result = readFiles(currentPath, blacklist, whitelist, result);
            continue;
        }

        if (!whitelist.some((regexp) => regexp.test(currentPath))) {
            continue;
        }

        const file = currentPath;
        const data = read(file);
        const { root, dir, base, ext, name } = path.parse(file);

        if (!result[dir]) {
            result[dir] = [];
        }

        result[dir].push({ root, dir, base, ext, name, file, data });
    }

    return result;
}

function writeFiles() {
    const result = readFiles(
        "./",
        [
            /\.git/,
            // /\.env/,
            /\.gitattributes/,
            /\.gitignore/,
            /\.prettierrc/,
            /database\.db/,
            /database\.db-shm/,
            /database\.db-wal/,
            /dev/,
            /docs/,
            // /ecosystem\.config\.js/,
            /keys/,
            /LICENSE/,
            /logs/,
            /migrations/,
            /node_modules/,
            /out/,
            /package-lock\.json/,
            // /package\.json/,
            /README\.md/,
            /releases/,
            // /rest/,
            // /scripts/,
            // /src/,
            // /test/,
            // /webpack\.config\.js/,
            // /src\\shared/,
            // /src\\api\\bsinet\\crypto-js.min.js/,
            //  /src\\api\\otomax\\repository/,
            /test\\v0/,
            /test\\v1/,
        ],
        [
            // /.*/,
            // /src\\db\\schema\./,
            // /src\\db\\table\./,
            // /src\\db\\column\./,
            // /src\\db\\constraint\./,
            // /src\\db\\index\./,

            // /src\\db\\query\.js/,
            // /src\\db\\builder\.js/,

            // /src\\db\\client/,
            // /src\\db\\database/,

            // /src\\db\\migration/,
            // /src\\db/,

            // /test\\/,
            // /test\\query-better-sqlite3.test.js/,
        ],
    );

    let code = "";
    for (const name in result) {
        const value = result[name];

        code += `## ${name}\r\n`;
        code += `\r\n`;

        for (const { root, dir, base, ext, name, file, data } of value) {
            console.log(file);

            code += `### ${name}\r\n`;

            code += `${file}\r\n`;
            code += `\r\n`;

            code += `\`\`\`${ext.slice(1)}\r\n`;
            code += `${data}\r\n`;
            code += `\`\`\`\r\n`;
        }
    }

    write("./dev/read-my-code.md", code);
}

writeFiles();
