import webpack from 'webpack';
import path from 'path';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { loaderRules } from './loader';
import { getPlugin } from './plugin';
import { getEntry } from './entry';
import combine from './combine';
import tools, { getCoreConfig } from '../tools';

const clientPath = path.join(process.cwd() + '/dist/client');
const { prefixCDN } = getCoreConfig();
const rootDir = tools.getOptions('rootDir');
const srcPath = path.join(process.cwd() + `/${rootDir}`);

function getBaseconfig(page, isServer = false, hotReload = false) {
    let entryObj = getEntry(page);
    let tempObj = {};
    let pluginsObj = [];
    if (hotReload) {
        for (let key in entryObj) {
            tempObj[key] = [
                'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true',
                entryObj[key]
            ];
        }
        pluginsObj = [...getPlugin(entryObj, isServer), new webpack.HotModuleReplacementPlugin()];
    } else {
        tempObj = entryObj;
        pluginsObj = [...getPlugin(entryObj, isServer)];
    }

    const config = {
        devtool: tools.isDev() ? 'eval-source-map' : false,
        mode: tools.isDev() ? 'development' : 'production',
        optimization: {
            minimize: tools.isDev() ? false : true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({ extractComments: false, parallel: true, cache: true })
            ]
        },
        entry: {
            ...tempObj
        }, //类别入口文件
        output: {
            publicPath: !tools.isDev() ? prefixCDN : '/',
            libraryTarget: 'umd',
            globalObject: 'this', //webpack4之后如果umd构建在浏览器和node环境中均可使用需要设置成this
            filename: `[name].js?v=[hash]`, //打包后输出文件的文件名
            path: clientPath //打包后的文件存放的地方
        },
        stats: {
            publicPath: false,
            performance: false,
            env: false,
            depth: false,
            colors: true,
            assets: true,
            cachedAssets: false,
            children: false,
            chunks: false,
            modules: false,
            warnings: false,
            entrypoints: false
        },
        module: {
            rules: loaderRules()
        },
        devServer: {
            contentBase: srcPath,
            port: 8080,
            hot: true
        },
        plugins: pluginsObj,
        resolve: {
            modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules'],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less'],
            alias: {
                '@': srcPath,
                components: srcPath + '/components',
                images: srcPath + '/images',
                react: require.resolve('react'),
                'react-dom': require.resolve('react-dom'),
                'react-router-dom': require.resolve('react-router-dom') // 避免多实例
            }
        }
    };
    return combine(config);
}
module.exports = {
    getBaseconfig
};
