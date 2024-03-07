const ASTVar = require('./variable');

function toArray(line, ast) {
    
    let name = line[0];
    let value = line[1].slice(1).slice(0, -2).replace(/ /g, '');
    let values = [];
    let type;
    
    // Est-ce un simple array ou tuples ?
    if (value.startsWith("(") && value.endsWith(")")) {
        values = value.slice(1).slice(0, -1).split("),(");
        values = values.map(e => e.split(","));
        values = values.map(e => e.map(a => ASTVar.evaluate(a, ast)))
        type = "tuple"
    } else {
        values = value.split(",").map(e => ASTVar.evaluate(e, ast));
        type = "array";
    }

    return {values, type};
}

module.exports = {toArray}