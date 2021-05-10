import { devMiddleware, hotMiddleware } from 'koa-webpack-middleware';
import webpack from 'webpack';
import { getBaseconfig } from './base.js';

class HotReload {
    constructor(app) {
        this.app = app;
        this.webpackConfig = getBaseconfig(process.argv.splice(2)[0] || 0, true, true);
        this.complier = webpack(this.webpackConfig);
        this.webpackDevMiddleware();
        this.webpackHotMiddleware();
    }
    webpackHotMiddleware() {
        let _hotMiddleware = hotMiddleware(this.complier, {
            log: console.warn,
            heartbeat: 2000
        });
        this.app.use(_hotMiddleware);
    }
    webpackDevMiddleware() {
        let _devMiddleware = devMiddleware(this.complier, {
            publicPath: this.webpackConfig.output.publicPath,
            quiet: true //向控制台显示任何内容
        });
        this.app.use(_devMiddleware);
    }
}

module.exports = HotReload;
