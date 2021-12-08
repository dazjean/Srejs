import path from 'path';
import fs from 'fs';
import { getEntryDir, getRootDir, isDev } from '@srejs/common';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { VueLoaderPlugin } from 'vue-loader';

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
                inject: 'body', //js插入的位置，true/'head'/'body'/false
                scriptLoading: 'defer',
                hash: false, //为静态资源生成hash值
                chunks: [pathname], //需要引入的chunk，不配置就会引入所有页面的资源
                minify: {
                    minifyCSS: isDev() ? false : true,
                    minifyJS: isDev() ? false : true,
                    collapseWhitespace: isDev() ? false : true,
                    keepClosingSlash: isDev() ? false : true,
                    removeComments: false,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            };
            webpackPlugin.push(new HTMLWebpackPlugin(conf));
        });
    webpackPlugin.push(new VueLoaderPlugin());
    !isDev() &&
        webpackPlugin.push(
            new MiniCssExtractPlugin({
                filename: isDev() || isServer ? '[name].css' : '[name]_[contenthash:8].css'
            })
        );
    if (process.argv.indexOf('--analyzer') > -1 && !isServer) {
        !isDev() && webpackPlugin.push(new BundleAnalyzerPlugin());
    }
    return webpackPlugin;
}
module.exports = {
    getPlugin
};
