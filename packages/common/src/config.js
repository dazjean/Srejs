import fs from 'fs';
import path, { join } from 'path';
import { parse as parseUrl } from 'url';

/*兼容electron process.cwd为用户目录 mac /Users/xxx  srejs根目录为向上寻找到node_modules的目录*/
export const cwd =
    process?.versions?.electron === undefined
        ? join(process.cwd())
        : join(__dirname, './../../../../');
export const tempDir = join(cwd + '/.ssr');
export const cacheDir = join(cwd + '/.ssr/cache');
export const outPutDir = join(cwd + '/.ssr/output');
export const serverDir = join(cwd + '/dist/server');
export const clientDir = join(cwd + '/dist/client');
export const webpackConfigPath = join(cwd + '/webpack.config.js');
export const SSRKEY = Symbol('SSR');

const newOptionsPath = path.resolve(cwd, './config/ssr.config.js');
const defaultOptions = {
    ssr: true, // 全局开启服务端渲染
    cache: false, //  全局使用服务端渲染缓存
    rootDir: 'web', // 客户端页面组件根文件夹
    rootNode: 'app', // 客户端页面挂载根元素ID
    prefixCDN: '/', // 构建后静态资源CDN地址前缀
    prefixRouter: '', // 默认页面路由前缀(在defaultRouter设置为true时有效)
    baseName: '', // react-router设置baseName 默认为页面page名称
    log: true // 开发环境日志
};
let coreOptions = null;

/**
 * 兼容@umajs/plugin-react/vue-ssr配置
 * @returns
 */
function umajs_plugin_options() {
    let opt = {};
    try {
        let { Uma } = require('@umajs/core');
        Uma.instance({ ROOT: './app' }).loadConfig();
        opt = Uma.config?.ssr || {}; // ssr.config.ts
        const reactSsrPlugin = Uma.config?.plugin['react-ssr'];
        const vueSsrPlugin = Uma.config?.plugin['vue-ssr'];
        const ssrPlugin = Uma.config?.plugin['ssr'];
        if (reactSsrPlugin?.options) {
            opt = reactSsrPlugin.options;
        }
        if (vueSsrPlugin?.options) {
            opt = vueSsrPlugin.options;
        }
        if (ssrPlugin?.options) {
            opt = ssrPlugin.options;
        }
    } catch (_error) {}
    return opt;
}

function loadConfig(path) {
    let configModule = require(path);
    let options = normalizeConfig(configModule);
    return Object.assign({}, defaultOptions, options);
}

function normalizeConfig(config) {
    if (typeof config === 'function') {
        config = config(defaultOptions);

        if (typeof config.then === 'function') {
            throw new Error('> Promise returned in srejs config');
        }
    }
    return config;
}
/**
 * 获取项目ssr.config.js配置
 */
export function getCoreConfig() {
    if (coreOptions) return coreOptions;

    if (fs.existsSync(newOptionsPath)) {
        coreOptions = loadConfig(newOptionsPath);
    } else {
        coreOptions = defaultOptions;
    }
    coreOptions = Object.assign({}, coreOptions, umajs_plugin_options());
    return coreOptions;
}

export function setCoreConfig(options) {
    coreOptions = options;
    return coreOptions;
}

export function getEntryDir() {
    const rootDirPath = getRootDir();
    return path.join(rootDirPath + `/pages/`);
}

export function getLayoutDir() {
    const rootDirPath = getRootDir();
    return path.join(rootDirPath + `/layout/`);
}

export function getRootDir() {
    const options = getCoreConfig();
    const { rootDir } = options;
    return path.join(cwd, rootDir);
}

export const parseQuery = (req) => {
    const url = req.url;
    let parsedUrl = parseUrl(url, true);
    return parsedUrl;
};
