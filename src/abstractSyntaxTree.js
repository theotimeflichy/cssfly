class AST {

    constructor(content) {
        this.content = content;
        this.ast = { type: 'root', var: [], child: [] };
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
            this.inBlock.push({ type: "block", selector: line.replace(/{/, '').trim(), var: [], rules: [], child: [] });
        } else if (line.includes("}")) {
            this.inBlock[this.inBlock.length-2].child.push(this.inBlock[this.inBlock.length-1]);
            this.inBlock.pop();
        } else if (line.includes(":")) {
            this.addRule(line);
        } else if (new RegExp('^@import\([\"\'].*(.css|.cssfly)[\"\']\);?$').test(line)) {

        }

    }

    /**
     * Ajoute une regle à l'AST
     * @param {*} line 
     */
    addRule(line) {
        line = line.split(":", 2).map(l => l.trim());
        line[1] = line[1].replace(/;$/, '');

        // La value est elle un variable ? (local, global ?)
        if (new RegExp(/^\$.*/).test(line[1])) {
            let brk = true;
            for (let i = this.inBlock.length; i >= 0 && brk; i--) {
                if (this.inBlock[i]) {
                    if (this.inBlock[i].var.some(e => e.name == line[1].replace(/\$/, ''))) {
                        this.inBlock[i].var.map(o => {
                            if (o.name == line[1].replace(/\$/, '')) {
                                line[1] = o.value;
                                brk=false;
                            }
                        });
                    }
                }
            }
        }

        // La regle existe t-elle déjà ? (add ou edit)
        if (this.inBlock[this.inBlock.length-1].rules.some(e => e.name === line[0])){
            this.inBlock[this.inBlock.length-1].rules.forEach(e => { if (e.property === line[0]) e.value = line[1]; });
        } else {
            this.inBlock[this.inBlock.length-1].rules.push({ type: "rule", property: line[0], value: line[1] });
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
            this.inBlock[this.inBlock.length - 1].var.push({ type: "var", name: line[0], value: line[1] });
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

    generateClassName(block, className) {
        let name = className.trim();
        if (name.endsWith(",")) name = name.slice(0, -1);
        name += " {\n";
        return name;
    }

    createBlock(block, className) {
        let css = "";

        console.log("-" + className)
        css += this.generateClassName(block, className);

        block.rules.forEach(r => {
            css += "\t" + r.property + ": " + r.value + ";\n";
        });

        css += "}\n\n";

        return css;
    }

    toCSS (block, className) {

        let css = this.createBlock(block, className);

        block.child.forEach(child => { 

            let name = "";

            if (className.includes(",") || child.selector.includes(",")) {

                className.split(",").forEach(cN => {
                    child.selector.split(",").forEach(cS => {
                        name += cN + " " + cS + ", ";
                    })
                });

            } else {
                name = className + " " + child.selector;
            }

        

            css += this.toCSS(child, name);
        });

        return css;
    }

    astToCSS() {
        let css = "";

        this.ast.child.forEach(e => { 
            css += this.toCSS(e, e.selector);
        });

        return css;
    }

}

module.exports = AST;
