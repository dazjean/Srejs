import path from 'path';
import fs from 'fs';
import { getEntryDir, getRootDir } from '@srejs/common';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import AutoDllPlugin from 'autodll-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const entryDir = getEntryDir();
const rootDir = getRootDir();

const global_local = `${rootDir}/index.html`;
const favicon_local = `${rootDir}/favicon.ico`;

function loadPluginHtml(page) {
    const htmlList = ['index.html', `${page}.html`];
    let template_local;
    const exists = htmlList.some((file) => {
        const htmlPath = path.join(entryDir, `${page}/${file}`);
        if (fs.existsSync(htmlPath)) {
            template_local = htmlPath;
            return true;
        }
    });
    if (exists) {
        return template_local;
    } else if (fs.existsSync(global_local)) {
        return global_local;
    } else {
        return path.join(__dirname, './index.html');
    }
}

function getPlugin(entryObj, isServer) {
    let pages = Object.keys(entryObj);
    let webpackPlugin = [];
    !isServer &&
        pages.forEach(function (pathname) {
            let entryName = pathname.split('/')[0];
            let template_local = loadPluginHtml(entryName);
            let conf = {
                filename: entryName + '/' + entryName + '.html', //生成的html存放路径，相对于path
                template: template_local, //html模板路径
                favicon: fs.existsSync(favicon_local) ? favicon_local : '',
                title: entryName,
                inject: true, //js插入的位置，true/'head'/'body'/false
                scriptLoading: 'defer',
                hash: false, //为静态资源生成hash值
                chunks: [pathname], //需要引入的chunk，不配置就会引入所有页面的资源
                minify: {
                    minifyCSS: true,
                    minifyJS: true,
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            };
            webpackPlugin.push(new HTMLWebpackPlugin(conf));
        });
    if (!isServer) {
        webpackPlugin.push(
            new AutoDllPlugin({
                inject: true,
                filename: '[name].js',
                entry: {
                    vendor: ['react', 'react-dom', 'react-router-dom']
                }
            })
        );
    }
    webpackPlugin.push(
        new MiniCssExtractPlugin({
            filename: '[name].css' + (!isServer ? '?v=[hash:8]' : '')
        })
    );
    if (process.argv.indexOf('--analyzer') > -1 && !isServer) {
        webpackPlugin.push(new BundleAnalyzerPlugin());
    }
    return webpackPlugin;
}
module.exports = {
    getPlugin
};
