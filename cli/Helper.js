const Table = require('cli-table');


class Helper {
    static renderTable(headers, data) {
        let keys = [];
        let head = [];
        headers.forEach(h => {
            keys.push(h.key);
            head.push(h.value);
        });
        let table = new Table({
                                  head: head,
                                  style: {
                                      head: ['cyan']
                                  }
                              });
        data.forEach(d => {
            let values = [];
            keys.forEach(k => {
                values.push(d[k]);
            });
            table.push(values);
        });
        console.log(table.toString());
    }
}

module.exports = Helper;
