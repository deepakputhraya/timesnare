const rp = require('request-promise-native');
const URI = 'http://127.0.0.1:3000/api/v0/session';

class RecordingCli {
    static async start() {
        return rp({
                      method: 'POST',
                      uri: URI,
                      json: true
        });
    }

    static async stop() {
        return rp({
                      method: 'DELETE',
                      uri: URI,
                      json: true
        });
    }

    static async list() {
        return rp({
                      method: 'GET',
                      uri: URI,
                      json: true
        });
    }

    static async get(focusId) {
        return rp({
                      method: 'GET',
                      uri: [URI, '/', focusId].join(''),
                      json: true
        });
    }

    static async status() {
        return rp({
                      method: 'GET',
                      uri: [URI, '/status'].join(''),
                      json: true
                  });
    }
}

module.exports = RecordingCli;
