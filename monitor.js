const desktopIdle = require('desktop-idle');
const notifier = require('node-notifier');
const RecordingService = require('./services/RecordingService');
const SessionStatus = require('./utils/SessionStatus');
const STOP_SESSION_THRESHOLD = 60 * 5; // 5 minutes

// JOB to stop session if user is idle for more than 5 minutes
class Monitor {
    constructor(ctx) {
        setInterval(() => (async () => {
            let status = (await RecordingService.status(ctx)).status;
            if (status === SessionStatus.RUNNING && desktopIdle.getIdleTime() > STOP_SESSION_THRESHOLD) {
                await RecordingService.stop(ctx);
                notifier.notify({
                                    'title': 'Stopped Focus Session',
                                    'message': 'Stopped due to inactivity. Start another?',
                                    closeLabel: 'Close',
                                    timeout: 10,
                                    sound: true,
                                    actions: "Start"
                                }, (error, response, metadata) => (async () => {
                    if (response === 'activate') {
                        await RecordingService.start(ctx);
                    }
                })().catch(e => console.log(e)));
            }
        })().catch(e => console.log(e)), 30000);
    }
}

module.exports = Monitor;
