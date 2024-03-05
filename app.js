const io = require('./src/modules/io.js');
const AST = require('./src/abstractSyntaxTree.js');
const axios = require('axios');

async function main() {
        // On vérifie les arguments.
        const args = process.argv.slice(2);
        if (args.length != 2 || !(new RegExp('.*\.cssfly$').test(args[0])) || !(new RegExp('.*\.css$').test(args[1])))
                throw new Error("Invalid arguments. Use : cssfly <input.cssfly> <output.css>")

        // on transforme le fichier, à update...
        data = io.readFileContent(args[0]);
        const a = new AST(data, args[0]);
        await a.parse();
        io.writeFileContent(args[1], a.astToCSS());
}


main();


