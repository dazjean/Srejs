import path from 'path';
import fs from 'fs';
import tools, { getEntryDir, tempDir } from '../tools';
export let EntryFilesMap = new Map();
export let EntryList = new Set([]);
export let webpackEntry = {};
export let webpackEntryMap = new Map();

const entryDir = getEntryDir();
export function getEntry(page) {
    if (page == true || page == 0 || typeof page == 'boolean') {
        return webpackEntry;
    } else {
        //一次打包多个入口文件以逗号分隔
        var pageArray = page.split(',') || [];
        let entry = {};
        pageArray.forEach((pageName) => {
            entry[`${pageName}/${pageName}`] = webpackEntryMap.get(pageName);
        });
        return entry;
    }
}

function initPropsInject(page) {
    try {
        const rootDir = tools.getOptions('rootDir');
        let data = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
        let entryName = false;
        const entrysFileList = [
            'index.js',
            'index.ts',
            'index.tsx',
            `${page}.js`,
            `${page}.ts`,
            `${page}.tsx`
        ];
        const exists = entrysFileList.some((file) => {
            const entryjs = path.join(entryDir, `${page}/${file}`);
            if (fs.existsSync(entryjs)) {
                entryName = file;
                EntryFilesMap.set(page, entryjs);
                return true; // 存在任意一个返回true
            }
        });

        if (exists && entryName) {
            data = data.replace(
                '$injectApp$',
                `require('../${rootDir}/pages/${page}/${entryName}')`
            );
            data = data.replace('__SSR_DATA__pathname', page);
            let exists = fs.existsSync(tempDir);
            if (!exists) {
                fs.mkdirSync(tempDir);
            }
            if (!fs.existsSync(`${tempDir}/${page}.js`)) {
                fs.writeFileSync(`${tempDir}/${page}.js`, data);
            }
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(`${page} Entry file creation failed in. Mini next cache folder`, err);
        return false;
    }
}

function loadRootDir() {
    fs.readdirSync(entryDir).forEach(function (page) {
        if (page != 'index.html' && page != '.DS_Store' && initPropsInject(page)) {
            webpackEntry[`${page}/${page}`] = `${tempDir}/${page}`;
            webpackEntryMap.set(page, `${tempDir}/${page}`);
            EntryList.add(page);
        }
    });
}

loadRootDir();
