import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

export { Webpack, WebpackDevServer };
/**VUE */
export { Webpack as WebpackVue } from './vue/index';
export { getDevConfig as getVueDevConfig } from './vue/dev';
export {
    DevMiddlewareFileSystem as VueDevMiddlewareFileSystem,
    Hotwebpack as VueHotWebpack
} from './vue/hot';
export {
    initEntry as initVueEntry,
    getEntry as getVueEntry,
    EntryList as EntryVueList,
    getEntryList as getVueEntryList,
    EntryFilesMap as EntryVueFilesMap,
    webpackEntry as webpackVueEntry,
    webpackEntryMap as webpackVueEntryMap
} from './vue/entry';
