#!/usr/bin/env node

'use strict';

const program = require('commander');
const Recording = require('../cli/RecordingCli');
const Helper = require('../cli/Helper');
const SessionStatus = require('../utils/SessionStatus');
const _ = require('lodash');
const moment = require('moment');
const execSync = require('child_process').execSync;
const prettyMs = require('pretty-ms');
const chalk = require('chalk');
const fs = require('fs');
const port = require('../config').port || 10567;
const tcpPortUsed = require('tcp-port-used');
const forever = require('forever');
let unpause = false;
let portInUse = true;

tcpPortUsed.check(port).then(function (inUse) {
    portInUse = inUse;
    unpause = true;
}, function (err) {
    console.error('Error on check:', err.message);
    unpause = true;
});

while (!unpause) {
    require('deasync').sleep(100);
}

if (!portInUse) {
    new forever.startDaemon(__dirname + '/../app.js', {
                                                          max: 1,
                                                          silent: false,
                                                          args: []
                                                      });
}

const LOGGER = {
    info: (str) => console.log(chalk.bold.blue(str)),
    error: (str) => console.log(chalk.bold.red(str)),
    success: (str) => console.log(chalk.bold.green(str)),
};

let errorHandler = (err) => {
    let msg;
    if (err.error) {
        msg = err.error.message;
    }
    if (!msg && err.message) {
        msg = err.message;
    }
    LOGGER.error(msg || "ERROR: Something went wrong");
};

let formatted_date = (d) => moment.utc(moment(d).format('YYYY-MM-DD HH:mm:ss.SSS')).local().format('llll');

program.version('0.1.0');

program.command('start')
    .description('Start a focus session')
    .action(() => (async () => {
        let data = await Recording.start();
        LOGGER.success(data.message);
    })().catch(errorHandler));

program.command('stop')
    .description('Stop the current focus session')
    .action(() => (async () => {
        let data = await Recording.stop();
        LOGGER.info(data.message);
    })().catch(errorHandler));

program.command('terminate [session-id]')
    .description('Delete a focus session. Deletes all sessions if session-id is not given')
    .action((focusId) => (async () => {
        let data = await Recording.terminate(focusId);
        LOGGER.info(data.message);
    })().catch(errorHandler));

program.command('list')
    .description('List all focus sessions')
    .action(() => (async () => {
        let data = await Recording.list();
        let sessions = _.map(data.sessions, s => {
            s.duration = "-";
            if (s.end_time) {
                s.duration = prettyMs(moment(s.end_time).diff(moment(s.start_time)));
                s.end_time = formatted_date(s.end_time);
            }
            s.start_time = formatted_date(s.start_time);
            s.end_time = s.end_time ? s.end_time : '-';
            return s;
        });
        Helper.renderTable(_.map(['id', 'start_time', 'end_time', 'video_path', 'duration', 'status'], (item) => {
            return {
                key: item,
                value: item.toUpperCase().replace('_', ' ')
            }
        }), sessions);
    })().catch(errorHandler));

program.command('play [session-id]')
    .description('Play focus session')
    .action((focusId) => (async () => {
        if (focusId) {
            let focusSession = await Recording.get(focusId);
            if (!fs.existsSync(focusSession.session.video_path)) {
                throw new Error("Recording does not exist");
            }
            execSync(['open', focusSession.session.video_path].join(' '));
        } else {
            throw new Error("Provide the session id");
        }
    })().catch(errorHandler));

program.command('status')
    .description('Focus session status')
    .action(() => (async () => {
        let data = await Recording.status();
        if (data.status === SessionStatus.RUNNING) {
            LOGGER.success("Focus session in progress");
        } else {
            LOGGER.info("No focus session in progress");
        }
    })().catch(errorHandler));

program.parse(process.argv);
