/**
 * Permet de calculer une expression.
 * ex: 1 + 1 => 2
 * ex: true && false => false
 * @param {*} exp l'expression à évaluer.
 * @param {*} ast image du système au moment
 * @returns l'expression calculé
 */
function evaluate(exp, ast) {

    exp = replaceVar(exp, ast);

    try {
        return eval(exp);
    } catch (error) {
        if (error instanceof ReferenceError) {
            // Si l'erreur est de type reference, cela veut dire que c'est un string.
            if (exp.startsWith('(') && exp.endsWith(')')) exp = exp.substring(1, exp.length - 1);
            return exp;
        } else {
            return "<Error>";
        }
    }
}

/**
 * Permet de remplacer les variables par leurs valeurs (récursivement).
 * @param {*} exp expression à remplacer.
 * @param {*} ast image du systeme à ce moment.
 * @returns l'expression avec leur variables remplacé.
 */
function replaceVar(exp, ast) {

    let newExp = exp.replace(new RegExp('\\$([a-zA-Z0-9]*)'), (match, a1) => {
        let brk = true;
        let value = "<Error>";

        for (let i = ast.length; i >= 0 && brk; i--) {
            if (ast[i]) {
                a1 = a1.replace(/\$/, '');
                if (ast[i].var.some(e => e.name == a1)) {
                    ast[i].var.map(o => {
                        if (o.name == a1) {
                            brk = false;
                            value = "(" + o.value + ")";
                        }
                    });
                }
            }
        }

        return value;
    });

    if (newExp === exp) return newExp;

    return replaceVar(newExp, ast);
}

module.exports = {evaluate};