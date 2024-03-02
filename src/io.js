const fs = require('fs');

exports.readFileContent = function readFileContent(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return data;
    } catch (err) {
        throw new Error(`Cannot read file ${filename}`);
    }
};


exports.writeFileContent = function writeFileContent(filename, content) {
    try {
        fs.writeFileSync(filename, content, 'utf8');
    } catch (error) {
        throw new Error(`Cannot write to file ${filename}`);
    }
};
