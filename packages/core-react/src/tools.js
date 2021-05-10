import fs from 'fs';
import path from 'path';
import { parse as parseUrl } from 'url';

export const tempDir = path.join(process.cwd() + '/.ssr');
export const cacheDir = path.join(process.cwd() + '/.ssr/cache');
export const outPutDir = path.join(process.cwd() + '/.ssr/output');
export const serverDir = path.join(process.cwd() + '/dist/server');
export const clientDir = path.join(process.cwd() + '/dist/client');
export const webpackConfigPath = path.join(process.cwd() + './webpack.config.js');
export const SSRKEY = Symbol('SSR');

const newOptionsPath = path.resolve(process.cwd(), './config/ssr.config.js');
const defaultOptions = {
    ssr: true, // 开启服务端渲染
    cache: false, // 开启缓存
    rootDir: 'web', // 工程根文件夹目录名称
    rootNode: 'app', // 客户端渲染挂载根元素ID
    log: true, // 开发环境日志
    prefixCDN: '/', // 构建后静态资源CDN地址前缀
    prefixRouter: '', // 页面路由前缀 默认/page  添加后前缀后访问方式为 /prefixUrl/page
};
let coreOptions = null;

/**umajs-react-ssr方案时，生成前部署构建时扫描其配置文件
 * 兼容@umajs/plugin-react-ssr配置
 * @returns
 */
function umajs_plugin_options() {
    let opt = {};
    try {
        let { Uma } = require('@umajs/core');
        Uma.instance({ ROOT: './app' }).loadConfig();
        opt = Uma.config?.ssr || {}; // ssr.config.ts
        const reactSsrPlugin = Uma.config?.plugin['react-ssr'];
        if (reactSsrPlugin?.options) {
            opt = reactSsrPlugin.options;
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

export function getEntryDir() {
    const options = getCoreConfig();
    const { rootDir } = options;
    return path.join(process.cwd() + `/${rootDir}/pages/`);
}

export const parseQuery = (req) => {
    const url = req.url;
    let parsedUrl = parseUrl(url, true);
    return parsedUrl;
};

export default {
    isDev: function () {
        const NODE_ENV = (process.env && process.env.NODE_ENV) || 'development';

        return NODE_ENV.trim() !== 'production';
    },
    getOptions: function (name) {
        let options = null;
        return (() => {
            options = options || getCoreConfig();
            return options[name] || null;
        })();
    },
    setOptions: function (options) {
        coreOptions = Object.assign({}, getCoreConfig(), options);
        return coreOptions;
    }
};
