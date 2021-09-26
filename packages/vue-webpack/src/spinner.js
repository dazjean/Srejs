// 感谢yk/fe团队提供的方案
// 单独创建子进程跑 spinner 否则会被后续的 require 占用进程导致 loading 暂停
const spinner = require('ora')('正在构建');

process.on('message', (data) => {
    const { message, text, color } = data;
    if (message === 'start') {
        spinner.spinner = 'hearts';
        spinner.start();
    } else if (message === 'stop') {
        spinner.stop();
        process.exit();
    }

    if (text) {
        spinner.text = text;
    }
    if (color) {
        spinner.color = color;
    }
});
