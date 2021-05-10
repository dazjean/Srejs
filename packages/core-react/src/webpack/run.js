import webpack from 'webpack';
import { getProconfig } from './prod';
import { getDevconfig } from './dev';
import serverConfig from './server';
import Logger from './../log';

class Webpack {
    /**
     *
     * @param {*} pages 支持单独文件构建编译 默认true编译全部web页面组件
     * @param {*} dev 开发环境
     * @param {*} server 服务端编译模式
     */
    constructor(pages, dev = true, server = false) {
        this.page = pages;
        this.config = server ? serverConfig(this.page) : this.getWebpackConfig(this.page, dev);
        this.Compiler = webpack(this.config);
    }
    getWebpackConfig(page, dev) {
        if (dev) {
            return getDevconfig(page, true);
        } else {
            return getProconfig(page, true);
        }
    }
    async run() {
        return await this.compilerRun();
    }

    compilerRun() {
        return new Promise((resove, reject) => {
            this.Compiler.run((err, stats) => {
                if (err) {
                    if (err.details) {
                        Logger.error(err.details);
                    }
                    reject(err.stack || err);
                }

                Logger.info(
                    stats.toString({
                        chunks: true, // 使构建过程更静默无输出
                        entrypoints: true,
                        publicPath: true,
                        performance: true,
                        env: true,
                        depth: true,
                        colors: true // 在控制台展示颜色
                    })
                );

                const info = stats.toJson();
                if (stats.hasErrors()) {
                    Logger.error('srejs:编译错误!!!', info.errors.join());
                    reject(info.errors);
                    return;
                }
                //处理代码编译中产生的warning
                if (stats.hasWarnings()) {
                    Logger.warn('srejs:编译警告!!!', info.warnings.join());
                }

                resove(true);
            });
        });
    }
    clearRequireCache(moduleFilename) {
        delete require.cache[moduleFilename];
    }
}

module.exports = Webpack;
