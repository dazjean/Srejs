import webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { cwd, clientDir, getCoreConfig, getOptions, isDev } from '@srejs/common';

import { loaderRules } from './loader';
import { getPlugin } from './plugin';
import { getEntry, initEntry } from './entry';

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
        devtool: isDev() ? 'eval-source-map' : false,
        mode: isDev() ? 'development' : 'production',
        optimization: {
            usedExports: true,
            minimize: isDev() ? false : true,
            /**minimizer 提取css和js压缩 */
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({ extractComments: false, parallel: true, cache: true })
            ],
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
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
            publicPath: !isDev() ? prefixCDN : '/',
            libraryTarget: 'umd',
            globalObject: 'this', //webpack4之后如果umd构建在浏览器和node环境中均可使用需要设置成this
            filename: isDev() || isServer ? '[name].js' : `[name]_[contenthash:8].js`, //打包后输出文件的文件名
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
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less'],
            alias: {
                '@': srcPath,
                components: srcPath + '/components',
                images: srcPath + '/images',
                react: path.resolve(cwd, './node_modules/react'),
                'react-dom': path.resolve(cwd, './node_modules/react-dom'),
                'react-router-dom': path.resolve(cwd, './node_modules/react-router-dom') // 避免多实例
            }
        }
    };

    if (getOptions('isQiankun')) {
        let appName = 'qiankunApp';
        try {
            const info = fs.readFileSync(path.join(cwd + `/package.json`));
            appName = JSON.parse(info).name;
        } catch (error) {
            console.log(error);
        }

        config.output = Object.assign(config.output, {
            library: `${appName}_[name]`,
            libraryTarget: 'umd',
            jsonpFunction: `webpackJsonp_${appName}`,
            globalObject: 'window'
        });
    }
    return config;
}
