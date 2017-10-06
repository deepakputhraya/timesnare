'use strict';
const BadRequestException = require('../utils/BadRequestException');
const SessionStatus = require('../utils/SessionStatus');
const FileSystem = require('../utils/FileSystem');
const _ = require('lodash');

class RecordingService {
    constructor() {
    }

    static start(ctx) {
        return (async () => {
            if (ctx.aperture.recorder) throw new BadRequestException("Stop the focus session first");
            let filePath = await ctx.aperture.startRecording();
            let focusSession = await ctx.db('focus_sessions')
                .insert({
                            video_path: filePath,
                            start_time: ctx.db.fn.now(),
                            status: SessionStatus.RUNNING
                }, ['id']);
            console.log("Focus session started", focusSession);
            ctx.session.id = focusSession[0];
        })();
    }

    static stop(ctx) {
        return (async () => {
            if (!ctx.aperture.recorder) throw new BadRequestException("Start a focus session first");
            let filePath = await ctx.aperture.stopRecording();
            await ctx.db('focus_sessions')
                .where({id: ctx.session.id})
                .update({
                            end_time: ctx.db.fn.now(),
                            status: SessionStatus.COMPLETED
                        });
            return filePath;
        })();
    }

    static terminate(ctx, id) {
        return (async () => {
            if (ctx.aperture.recorder && ctx.session.id === id) throw new BadRequestException("Cannot delete a running focus session");
            let session = await RecordingService.get(ctx, id);
            await ctx.db('focus_sessions')
                .where({id: ctx.session.id})
                .update({
                            status: SessionStatus.DELETED
                        });
            FileSystem.rm(session.video_path);
        })();
    }

    static list(ctx) {
        return (async () => {
            return  ctx.db.select().table('focus_sessions').whereNot({status: SessionStatus.DELETED}).orderBy('id', 'desc');
        })();
    }

    static terminateAll(ctx) {
        return (async () => {
            if (ctx.aperture.recorder) throw new BadRequestException("Cannot delete a running focus session");
            let sessions = await RecordingService.list(ctx);
            await ctx.db('focus_sessions')
                .update({
                            status: SessionStatus.DELETED
                        });
            FileSystem.rm(_.map(sessions, s => s.video_path));
        })();
    }

    static get(ctx, id) {
        return (async () => {
            let sessions = await ctx.db.select().table('focus_sessions').where({id : id});
            if (sessions.length === 0) throw new BadRequestException("No such focus session");
            return sessions[0];
        })();
    }

    static status(ctx) {
        return (async () => {
            return ctx.aperture.recorder ? SessionStatus.RUNNING : SessionStatus.NONE;
        })();
    }
}

module.exports = RecordingService;
