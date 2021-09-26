import { resolve } from 'path';
import { fork } from 'child_process';
const spinnerProcess = fork(resolve(__dirname, './spinner'));
export const spinner = {
    start: () =>
        spinnerProcess.send({
            message: 'start'
        }),
    stop: () =>
        spinnerProcess.send({
            message: 'stop'
        }),
    text: (text) =>
        spinnerProcess.send({
            text
        }),
    color: (color) =>
        spinnerProcess.send({
            color
        })
};
