import { getCoreConfig } from '../config';
const { log } = getCoreConfig();
export let Logger = console;
if (!log) {
    ['info', 'warn', 'error', 'debug', 'log'].forEach((action) => {
        Logger[action] = () => {};
    });
}
