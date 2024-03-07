const ASTVar = require('./variable');
const OPEN = 1; 
const WASOPEN = 2;
const NEVEROPEN = 3;

/**
 * Permet de vérifier si une condition doit être évaluer,
 * et si oui, de l'évaluer.
 * @param {*} line la ligne de code contenant la condition.
 * @param {*} ast image du système.
 * @param {*} locker l'état de la condition.
 * @returns 
 */
function verify(line, ast, locker) {

    // On extrait l'expression.
    let exp = line.match(new RegExp("@(if|else|endif|else if|elseif) *\((.*)\)"));

    // On décide de l'évaluation ou non de la condition.
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

    return locker;
}

/**
 * Permet de tester l'expression d'une condition
 * @param {*} exp l'expression
 * @param {*} ast l'image du système
 * @returns true or false
 */
function test(exp, ast) {
    return (ASTVar.evaluate(exp, ast) == true) ? 1 : 0;
}

module.exports = {verify}