const io = require('./src/io.js');
const AST = require('./src/abstractSyntaxTree.js');

// On vérifie les arguments.
const args = process.argv.slice(2);
if (args.length != 2 || !(new RegExp('.*\.cssfly$').test(args[0])) || !(new RegExp('.*\.css$').test(args[1])))
        throw new Error("Invalid arguments. Use : cssfly <input.cssfly> <output.css>")

data = io.readFileContent(args[0]);
const a = new AST(data, args[0]);
a.parse();
io.writeFileContent(args[1], a.astToCSS());


