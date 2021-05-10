const { log } = require('../tools').getCoreConfig();
let Logger = console;
if (!log) {
    ['info', 'warn', 'error', 'debug', 'log'].forEach((action) => {
        Logger[action] = ()=>{};
    });
}
module.exports = Logger;
