const io = require('./src/io.js');
const AST = require('./src/abstractSyntaxTree.js');

// On vérifie les arguments.
const args = process.argv.slice(2);
if (args.length != 2 || !(new RegExp('.*\.cssfly$').test(args[0])) || !(new RegExp('.*\.css$').test(args[1])))
        throw new Error("Invalid arguments. Use : cssfly <input.cssfly> <output.css>")

data = io.readFileContent(args[0]);

const a = new AST(data);
const b = a.parse();
console.log(b)

// On passe de l'arbre à l'output

// On écrit l'output
io.writeFileContent(args[1], JSON.stringify(b));




/**
 * 1. On récupère les argument et renvoie une erreur en cas de non conformité
 * 2. On ouvre le fichier et récupère le contenue
 * 3. On fait abs, parse et créer l'output
 * 4. On écrit l'output.
 */
