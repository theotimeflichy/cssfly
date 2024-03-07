function evaluate(exp, ast) {

    exp = replaceVar(exp, ast);

    try {
        return eval(exp);
    } catch (error) {
        if (error instanceof ReferenceError) {
            if (exp.startsWith('(') && exp.endsWith(')')) exp = exp.substring(1, exp.length - 1);
            return exp;
        } else {
            return "<Error>";
        }
    }
}

function replaceVar(exp, ast) {
    let newExp = exp.replace(new RegExp('\\$([a-zA-Z0-9]*)'), (match, a1) => {
        let brk = true;
        let value = "<Error>";
        for (let i = ast.length; i >= 0 && brk; i--) {
            if (ast[i]) {
                if (ast[i].var.some(e => e.name == a1.replace(/\$/, ''))) {
                    ast[i].var.map(o => {
                        if (o.name == a1.replace(/\$/, '')) {
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