const express = require('express');
const app = express();
const aperture = require('aperture')();
const config = require('./config');
const db = require('knex')(config.database);
const FileSystem = require('./utils/FileSystem');

FileSystem.mkdir([process.env.HOME, '.timesnare'].join('/'));

db.migrate.latest();

let currentSession = {
    id: null
};

app.use(function (req, res, next) {
    req.ctx = {
        aperture: aperture,
        db: db,
        session: currentSession
    };
    next();
});

app.use('/api/v0/session',require('./routes/Recording'));

app.listen(config.port || 10567);
