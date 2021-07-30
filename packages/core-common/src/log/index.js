import { getCoreConfig } from './../loadConfig';
const { log } = getCoreConfig();
export let Logger = console;
if (!log) {
    ['info', 'warn', 'error', 'debug', 'log'].forEach((action) => {
        Logger[action] = () => {};
    });
}
