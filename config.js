const path = require('path');

module.exports = {
    database: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, 'app.db')
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'migrations',
            directory: 'migrations'
        }
    }
};
