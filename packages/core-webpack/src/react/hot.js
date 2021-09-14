import webpack from 'webpack';
import * as fs from 'fs';
import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import { getDevConfig } from './dev';
export let DevMiddlewareFileSystem = fs;

export class Hotwebpack {
    constructor(app, page = true) {
        this.app = app;
        this.webpackConfig = getDevConfig(page, false, true);
        this.complier = webpack(this.webpackConfig);
        this.webpackDevMiddleware();
        this.webpackHotMiddleware();
    }
    webpackHotMiddleware() {
        const hotPath = '/__webpack_hmr';
        let _hotMiddleware = hotMiddleware(this.complier, {
            path: hotPath,
            log: console.warn,
            heartbeat: 2000
        });
        // 中间件过滤非 /__webpack_hmr路由
        this.app.use(function (ctx, next) {
            if (ctx.url !== hotPath) {
                return next();
            } else {
                _hotMiddleware(ctx, next);
            }
        });
    }
    webpackDevMiddleware() {
        let _devMiddleware = devMiddleware(this.complier, {
            serverSideRender: false,
            publicPath: '/',
            noInfo: true,
            quiet: true,
            index: false //不响应根路径请求 避免和页面组件路由冲突
        });
        DevMiddlewareFileSystem = _devMiddleware.fileSystem;
        // 中间件过滤 非静态资源目录访问 .html,.js,.css,.png,jpeg,.svg,.jpg,.ttf
        this.app.use(function (ctx, next) {
            const filename = _devMiddleware.getFilenameFromUrl(ctx.url);
            if (filename === false) return next();
            try {
                var stat = DevMiddlewareFileSystem.statSync(filename);
                if (!stat.isFile()) {
                    return next();
                }
                _devMiddleware(ctx, next);
            } catch (_e) {
                return next();
            }
        });
    }
}
