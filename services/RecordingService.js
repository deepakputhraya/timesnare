'use strict';
const BadRequestException = require('../utils/BadRequestException');
const SessionStatus = require('../utils/SessionStatus');

class RecordingService {
    constructor() {
    }

    static start(ctx) {
        return (async () => {
            if (ctx.aperture.recorder) {
                throw new BadRequestException("Stop the focus session first");
            }
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
            if (!ctx.aperture.recorder) {
                throw new BadRequestException("Start a focus session first");
            }
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

    static list(ctx) {
        return (async () => {
            return  ctx.db.select().table('focus_sessions').orderBy('id', 'desc');
        })();
    }

    static get(ctx, id) {
        return (async () => {
            let sessions = await ctx.db.select().table('focus_sessions').where({id : id});
            if (sessions.length === 0) {
                throw new BadRequestException("No such focus session");
            }
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
