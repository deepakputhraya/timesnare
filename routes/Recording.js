'use strict';

const Router = require('express').Router();
const Middleware = require('../utils/Middleware');
const RecordingService = require('../services/RecordingService');


Router.post('/', Middleware(async (req, res, next) => {
    await RecordingService.start(req.ctx);
    res.status(200).json({ message: "Started focus session" });
}));

Router.delete('/', Middleware(async (req, res, next) => {
    await RecordingService.stop(req.ctx);
    res.status(200).json({ message: "Focus session stopped" });
}));

Router.get('/', Middleware(async (req, res, next) => {
    let focusSessions =  await RecordingService.list(req.ctx);
    res.status(200).json({ sessions: focusSessions });
}));

Router.get('/status', Middleware(async (req, res, next) => {
    let status =  await RecordingService.status(req.ctx);
    res.status(200).json({ status: status });
}));

Router.get('/:focusId(\\d+)', Middleware(async (req, res, next) => {
    let focusSession =  await RecordingService.get(req.ctx, req.params.focusId);
    res.status(200).json({ session: focusSession });
}));


module.exports = Router;
