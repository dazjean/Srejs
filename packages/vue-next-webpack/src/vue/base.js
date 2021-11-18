import webpack from 'webpack';
import * as path from 'path';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import common, { cwd, clientDir, getCoreConfig, getOptions } from '@srejs/common';

import { loaderRules } from './loader';
import { getPlugin } from './plugin';
import { getEntry, initEntry } from './entry';
import combine from './combine';

const { prefixCDN } = getCoreConfig();
const rootDir = getOptions('rootDir');
const srcPath = path.join(cwd + `/${rootDir}`);

export function getBaseconfig(page, isServer = false, hotReload = false) {
    initEntry();
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
        devtool: common.isDev() ? 'eval-source-map' : false,
        mode: common.isDev() ? 'development' : 'production',
        optimization: {
            usedExports: true,
            minimize: common.isDev() ? false : true,
            /**minimizer 提取css和js压缩 */
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({ extractComments: false, parallel: true, cache: true })
            ],
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
                        name: 'vendor',
                        chunks: 'all'
                    }
                }
            }
        },
        entry: {
            ...tempObj
        }, //类别入口文件
        output: {
            publicPath: !common.isDev() ? prefixCDN : '/',
            libraryTarget: 'umd',
            globalObject: 'this',
            filename: `[name].js?v=[hash:8]`, //打包后输出文件的文件名
            path: clientDir //打包后的文件存放的地方
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
            rules: loaderRules(isServer)
        },
        devServer: {
            contentBase: srcPath,
            port: 8080,
            hot: true
        },
        plugins: pluginsObj,
        resolve: {
            modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules'],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', 'css', '.scss', '.less'],
            alias: {
                '@': srcPath,
                components: srcPath + '/components',
                images: srcPath + '/images',
                vue: path.resolve(cwd, './node_modules/vue'),
                vue$: path.resolve(cwd, './node_modules/vue/dist/vue.runtime.esm-bundler.js'),
                'vue-router': path.resolve(cwd, './node_modules/vue-router')
            }
        }
    };
    return combine(config);
}
