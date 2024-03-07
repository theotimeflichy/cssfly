const ASTImport = require('./modules/import');
const ASTVar = require('./modules/variable');
const ASTCondition = require('./modules/condition');

class AST {

    constructor(content, path) {
        this.content = content;
        this.path = path;
        this.ast = { type: 'root', var: [], child: [] };
        this.inBlock = [];
        this.locker = 1; // 1 = open, 2 = close but was open, 3 close but never open
    }


    /**
     * Permet de parser le cssfly en abs.
     * @param {String (css format)} data cssfly a parser
     */
    async parse() {
        this.inBlock.push(this.ast);
        var data = "";
        data = await ASTImport.importFile(this.content, this.path)
        data = this.strToArray(data);
        for (let line of data) this.analysis(line);
        return this.ast;
    }

    /**
     * Analyse la ligne et redirige vers l'action à effectuer.
     * @param {string} line 
     */
    analysis(line) {

        if ((new RegExp("@(if|else|endif)")).test(line)) {
            this.locker = ASTCondition.verify(line, this.inBlock, this.locker);
        } else if (this.locker == 1) {
            if (line.startsWith("$") && line.includes("=")) {
                this.addVariable(line);
            } else if (line.includes("{")) {
                this.inBlock.push({ type: "block", selector: line.replace(/{/, '').trim(), var: [], rules: [], child: [] });
            } else if (line.includes("}")) {
                this.inBlock[this.inBlock.length-2].child.push(this.inBlock[this.inBlock.length-1]);
                this.inBlock.pop();
            } else if (line.includes(":")) {
                this.addRule(line);
            } else if(line.startsWith("/*")) {
                if (line.endsWith("*/")) {
                    this.inBlock.push({ type: "comment", long: false, value: line.slice(2).slice(0, -2).trim() })
                    this.inBlock[this.inBlock.length-2].child.push(this.inBlock[this.inBlock.length-1]);
                    this.inBlock.pop();
                } else {
                    this.inBlock.push({ type: "comment", long:true, value: line.slice(2) })
                }
            } else if(line.endsWith("*/") && !line.startsWith("/*")) {
                this.inBlock[this.inBlock.length-2].child.push(this.inBlock[this.inBlock.length-1]);
                this.inBlock.pop();
            } else if(line.includes("*")) {
                this.inBlock[this.inBlock.length-1].value += " \n" + line.replace('*', '');
            }
        }

    }

    /**
     * Ajoute une regle à l'AST
     * @param {*} line 
     */
    addRule(line) {
        line = line.split(":").map(l => l.trim());
        for (let i = 2; i < line.length; i ++) line[1]+=line[i];
        line[1] = line[1].replace(/;$/, '');

        if (line[1].includes("$")) line[1] = ASTVar.evaluate(line[1], this.inBlock);

        // La regle existe t-elle déjà ? (add ou edit)
        if (this.inBlock[this.inBlock.length-1].rules) {
            if (this.inBlock[this.inBlock.length-1].rules.some(e => e.name === line[0])){
                this.inBlock[this.inBlock.length-1].rules.forEach(e => { if (e.property === line[0]) e.value = line[1]; });
            } else {
                this.inBlock[this.inBlock.length-1].rules.push({ type: "rule", property: line[0], value: line[1] });
            }
        }
    }

    /**
     * Ajoute une variable à l'AST
     * @param {*} line 
     */
    addVariable(line) {

        // On récupère le nom et le contenu de la variable.
        line = line.substring(1).split("=", 2).map(l => l.trim());
        let var_name = line[0];
        let var_expression = line[1].replace(/;$/, '');

        // On ajoute la variable (ou update)
        if (this.inBlock[this.inBlock.length - 1].var.some(e => e.name === var_name)){
            this.inBlock[this.inBlock.length - 1].var.forEach(e => { if (e.name === var_name) e.value = var_expression; });
        } else {
            this.inBlock[this.inBlock.length - 1].var.push({ type: "var", name: var_name, value: var_expression });
        }
    }

    /**
     * Permet de nettoyer le fichier css et de le passer en tableau.
     * @param {*} data le fichier css en string
     * @returns le tableau
     */
    strToArray(data) {

        data = data
            .replace(/;/g, ";\n")
            .replace(/}/g, "}\n")
            .replace(/{/g, "{\n")
            .replace(/\s*,\s*/g, ', ')
            .replace(/,\s*\n\s*/g, ', ');

        data = data.split("\n");
        data = data.map(l => l.trim()).filter(l => l !== '');
        return data;
    }

    //
    //  FUNCTIONS AST -> CSS
    //

    /**
     * Genere le nom des classes.
     * @param {*} block 
     * @param {*} className 
     * @returns 
     */
    generateClassName(block, className) {
        let name = className.trim();
        if (name.endsWith(",")) name = name.slice(0, -1);
        name += " {\n";
        return name;
    }

    /**
     * Créer les blocs (ex: body { })
     * @param {*} block 
     * @param {*} className 
     * @returns 
     */
    createBlock(block, className) {
        
        let css = "";

        if (block.rules.length > 0) {
            css = this.generateClassName(block, className);

            block.rules.forEach(r => {
                css += "\t" + r.property + ": " + r.value + ";\n";
            });

            css += "}\n\n";
        }

        return css;
    }

    /**
     * Prend une banche de l'arbre et la passe en css.
     * @param {*} block 
     * @param {*} className 
     * @returns 
     */
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
                name = className + ((new RegExp("^[:\[]").test(child.selector.trim())) ? "" : " ") + child.selector;
            }

            css += this.toCSS(child, name);
        });

        return css;
    }

    commentToCSS(e) {
        let comment = "";

        if (e.long) {
            comment = e.value.trim().replace(/^\*+/, '').replace(/\r?\n/g, '\n \ *').trim();
            comment = "/** \n \ " + comment + "\n \ */\n";
        } else {
            comment = "/* " + e.value + " */\n";
        }

        return comment;
    }

    /**
     * Transforme un arbre en css.
     * @returns le css
     */
    astToCSS() {
        let css = "";

        this.ast.child.forEach(e => { 
            if (e.type == "comment") {
                css += this.commentToCSS(e);
            } else if (e.type == "block") {
                css += this.toCSS(e, e.selector);
            }
        });

        return css;
    }

}

module.exports = AST;
