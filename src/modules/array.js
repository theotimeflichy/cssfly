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

function createEach(line) {

    let exp = line.match(new RegExp("@each (.*) in \\$(.*)"));
    let array = "$" + exp[2];
    let args = exp[1].split(",").map(e => e.trim());

    return { array, args };
}

function createEachBlock(block, ast) {

    let newBlock = { type: "block", selector: "", var: [], rules: [], child: [] }

    block.array.forEach((tab, index) => {

        let bAST = [{ var: tab.map(e => { return {type:"var", name: (block.args[tab.indexOf(e)]).replace("$", ''), value:e}; })}]

        block.child.forEach((child) => {

            let b = { 
                type: "block", 
                selector: child.selector.replace(new RegExp("\\$([a-zA-Z0-9]*)", "g"), r => {
                    return tab[block.args.indexOf(r)];
                }), 
                var: [], 
                rules: child.rules.map((e) => { return {value: ASTVar.evaluate(e.value, bAST), property: e.property}; }),
                child: [] 
            }

            newBlock.child.push(b);
        });
    });

    //console.log(JSON.stringify(newBlock, null, 2))

    return newBlock;
} 


module.exports = { toArray, createEach, createEachBlock }
