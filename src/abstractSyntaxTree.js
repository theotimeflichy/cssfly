class AST {

    constructor(content) {
        this.content = content;
        this.ast = { type: 'root', var: [], rules: [] };
        this.inBlock = [];
    }


    /**
     * Permet de parser le cssfly en abs.
     * @param {String (css format)} data cssfly a parser
     */
    parse() {
        this.inBlock.push(this.ast);

        var data = this.strToArray(this.content);
        for (let line of data) this.analysis(line);
        return this.ast;
    }

    /**
     * Analyse la ligne et redirige vers l'action à effectuer.
     * @param {string} line 
     */
    analysis(line) {

        if (line.startsWith("$") && line.includes("=")) {
            this.addVariable(line);
        } else if (line.includes("{")) {
            this.block = { selector: "", var: [], rules: [] }
            this.block.selector = line.replace(/{/, '').trim();
            this.inBlock.push(this.block);
        } else if (line.includes("}")) {
            this.inBlock.pop();
            this.ast.rules.push(this.block);
        } else if (line.includes(":")) {
            this.addRule(line);
        }

    }

    /**
     * Ajoute une regle à l'AST
     * @param {*} line 
     */
    addRule(line) {
        line = line.split(":", 2).map(l => l.trim());
        line[1] = line[1].replace(/;$/, '');

        if (new RegExp(/^\$.*/).test(line[1])) {

            // vérifier si variable local avant ?

            if (this.ast.var.some(e => e.name == line[1].replace(/\$/, ''))) {
                this.ast.var.map(o => {
                    if (o.name == line[1].replace(/\$/, '')) {
                        line[1] = o.value;
                    }
                });
            }
        }

        if (this.block.rules.some(e => e.name === line[0])){
            this.block.rules.forEach(e => { if (e.property === line[0]) e.value = line[1]; });
        } else {
            this.block.rules.push({ property: line[0], value: line[1] });
        }
    }

    /**
     * Ajoute une variable à l'AST
     * @param {*} line 
     */
    addVariable(line) {
        line = line.substring(1).split("=", 2).map(l => l.trim());
        line[1] = line[1].replace(/;$/, '');
        if (this.inBlock[this.inBlock.length - 1].var.some(e => e.name === line[0])){
            this.inBlock[this.inBlock.length - 1].var.forEach(e => { if (e.name === line[0]) e.value = line[1]; });
        } else {
            this.inBlock[this.inBlock.length - 1].var.push({ name: line[0], value: line[1] });
        }
    }

    /**
     * Permet de nettoyer le fichier css et de le passer en tableau.
     * @param {*} data le fichier css en string
     * @returns le tableau
     */
    strToArray(data) {
        data = data.replace(/;/g, ";\n").replace(/}/g, "}\n").replace(/{/g, "{\n");
        data = data.split("\n");
        data = data.map(l => l.trim()).filter(l => l !== '');
        return data;
    }

    toCSS() {
        
    }

}

module.exports = AST;
