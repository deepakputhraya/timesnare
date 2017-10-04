const desktopIdle = require('desktop-idle');
const notifier = require('node-notifier');
const RecordingCli = require('./cli/RecordingCli');
const SessionStatus = require('./utils/SessionStatus');
const STOP_SESSION_THRESHOLD = 60 * 5; // 5 minutes

// JOB to stop session if user is idle for more than 5 minutes
setInterval(() => (async () => {
    let status = (await RecordingCli.status()).status;
    if (status === SessionStatus.RUNNING && desktopIdle.getIdleTime() > STOP_SESSION_THRESHOLD) {
        await RecordingCli.stop();
        notifier.notify({
                            'title': 'Stopped Focus Session',
                            'message': 'Stopped due to inactivity. Start another?',
                            closeLabel: 'Close',
                            timeout: 10,
                            sound: true,
                            actions: "Start"
                        }, (error, response, metadata) => (async () => {
            if (response === 'activate') {
                await RecordingCli.start();
            }
        })().catch(e => console.log(e)));
    }
})().catch(e => console.log(e)), 30000);
