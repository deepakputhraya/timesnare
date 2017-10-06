module.exports = {
    idle: 300, // duration in seconds to stop recording
    port: 10567,
    database: {
        client: 'sqlite3',
        connection: {
            filename: [process.env.HOME, '.timesnare/app.db'].join('/')
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'migrations',
            directory: 'migrations'
        }
    }
};
