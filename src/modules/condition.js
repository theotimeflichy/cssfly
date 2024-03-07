const ASTVar = require('./variable');

// 1 = open, 2 = close but was open, 3 close but never open
const OPEN = 1;
const WASOPEN = 2;
const NEVEROPEN = 3;

function verify(line, ast, locker) {

    // On extrait l'expression.
    let exp = line.match(new RegExp("@(if|else|endif|else if|elseif) *\((.*)\)"));
    // On décide quoi faire.
    switch (exp[1]) {
        case 'if':
            locker = (test(exp[2], ast) == 1) ? OPEN : NEVEROPEN;
            break;
        case 'else': 
            if (locker == NEVEROPEN) locker = OPEN;
            else if (locker == OPEN) locker = WASOPEN;
            break;
        case 'elseif':
        case 'else if': 
            if (locker == OPEN) locker = WASOPEN;
            else if (locker == NEVEROPEN) (test(exp[2], ast) == 1) ? OPEN : NEVEROPEN;
            break;
        case 'endif': locker = OPEN; break;
    }

    console.log(exp[0] + " :: " + locker);

    return locker;
}

function test(exp, ast) {
    return (ASTVar.evaluate(exp, ast) == true) ? 1 : 0;
}

module.exports = {verify}