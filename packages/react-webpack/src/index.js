import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

export { Webpack, WebpackDevServer };
/**React */
export { Webpack as WebpackReact } from './react/index';
export { getDevConfig } from './react/dev';
export { DevMiddlewareFileSystem, Hotwebpack } from './react/hot';
export {
    initEntry,
    getEntry,
    EntryList,
    getEntryList,
    EntryFilesMap,
    webpackEntry,
    webpackEntryMap
} from './react/entry';
