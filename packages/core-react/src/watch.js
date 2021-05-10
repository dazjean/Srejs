import chokidar from 'chokidar';
import path from 'path';
import { EntryList as Directories } from './webpack/entry';
import webPack from './webpack/run';
import Logger from './log';
import { getEntryDir } from './tools';

const entryDir = getEntryDir();

export default class WatchPages {
    constructor(app) {
        this.app = app;
        this.startWathc();
    }
    async startWathc() {
        let listOfDirectories = [];
        Directories.forEach((cateName) => {
            let pageMain = entryDir + '/' + cateName;
            listOfDirectories.push(pageMain);
        });
        const watcher = chokidar.watch(listOfDirectories, {
            ignored: './node_modules', // ignore dotfiles
            persistent: true
        });
        watcher.on('change', async (fileName) => {
            process.nextTick(async () => {
                let beginTime = new Date().getTime();
                let page = '/' + path.relative(entryDir, fileName).replace(/\\+/g, '/');
                Logger.warn(
                    `srejs:Listen to ${page} file change, will recompile webpack........`
                );
                page = page.replace(/^\//, '').split('/')[0];
                if (fileName.endsWith('.html')) {
                    //html改动，重新编译client
                    await new webPack(page, true, false).run(); // 更新client
                } else {
                    await new webPack(page, true, true).run(); // 更新server
                }
                Logger.warn(
                    'srejs:webpack recompile success in ' +
                        (new Date().getTime() - beginTime) +
                        'ms'
                );
            });
        });
    }
}
