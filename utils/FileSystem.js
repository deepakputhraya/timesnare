const fs = require('fs');

class FileSystem {
    constructor() {}

    static mkdir (dir) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    }

    static rm (file) {
        if (file instanceof Array) {
            file.forEach(f => {if (fs.existsSync(f)) fs.unlinkSync(f)});
        }
        if (typeof(file) === 'string' && fs.existsSync(file)) fs.unlinkSync(file);
    }
}

module.exports = FileSystem;
