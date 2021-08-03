import webpack from 'webpack';
import { getProconfig } from './prod';
import { getDevConfig } from './dev';
import { getServerconfig } from './server';
import { Logger } from '@srejs/common';
import { spinner } from './../spinnerProcess';

export class Webpack {
    /**
     *
     * @param {*} pages 支持单独文件构建编译 默认true编译全部web页面组件
     * @param {*} dev 开发环境
     * @param {*} server 服务端编译模式
     */
    constructor(pages, dev = true, server = false) {
        this.page = pages;
        this.dev = dev;
        this.Compiler = webpack(
            server ? getServerconfig(this.page) : this.getWebpackConfig(this.page)
        );
    }
    getWebpackConfig(page) {
        if (this.dev) {
            return getDevConfig(page, false);
        } else {
            return getProconfig(page, false);
        }
    }
    async run() {
        return this.dev ? this.watching() : this.compilerRun();
    }
    static async build(page) {
        spinner.start();
        spinner.color('yellow');
        spinner.text('客户端构建');
        await new Webpack(page, false, false).compilerRun();
        spinner.text('服务端构建');
        spinner.color('blue');
        await new Webpack(page, false, true).compilerRun();
        spinner.stop();
    }
    compilerRun() {
        return new Promise((resove, reject) => {
            this.Compiler.run((err, stats) => {
                if (err) {
                    reject(err.stack || err);
                }
                this.log(stats);
                resove(true);
            });
        });
    }
    watching() {
        this.Compiler.watch(
            {
                aggregateTimeout: 300,
                ignored: '**/node_modules',
                poll: 1000
            },
            (err, stats) => {
                this.log(stats);
            }
        );
    }
    log(stats) {
        Logger.info(
            stats.toString({
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
            })
        );
    }
}
