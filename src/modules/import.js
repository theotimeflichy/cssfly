const axios = require('axios');
const io = require('./io.js');


async function importFile(data, path) {
    
    let regex = new RegExp('^@import\\([\"\'](.*)[\"\']\\);?');
    let tableau = [];
    let toReplace;

    data = data.replace(regex, (match, a1) => { tableau.push(a1); return a1; });

    for (let i = 0; i < tableau.length; i++) {
        if (tableau[i].startsWith("http")) {
            toReplace = await importExternalFile(tableau[i]);
        } else {
            toReplace = importLocalFile(data, path, tableau[i]);
        }

        data = data.replace(tableau[i], toReplace);

    }

    return data;
}
    
async function importExternalFile(a1) {
    try {
        const response = await axios.get(a1);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Permet d'importer des fichiers local.
 * @param {*} data le css appelant l'import
 * @param {*} path le chemin du fichier css appelant
 * @param {*} a1 le chemin du fichier à importer
 * @returns le css après importation
 */
function importLocalFile(data, path, a1) {
    
    let content = "";
    
    try {
        let lastSlashIndex = path.lastIndexOf('/');
        let directoryPath = path.substring(0, lastSlashIndex + 1);
        content = io.readFileContent(directoryPath + a1);
    } catch (error) {
        content = "/* Impossible d'import le fichier. */";
    } finally {
        return content;
    }
        
}

module.exports = {importFile};




