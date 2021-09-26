import { fork } from 'child_process';
import send from 'koa-send';
import common, { clientDir, SSRKEY, parseQuery, Logger } from '@srejs/common';
import { VueHotWebpack, getVueEntryList } from '@srejs/vue-webpack';
import { sendHTML } from './send-html';
import { render as VueRender } from './render';

// 创建server端webpack构建进程监听文件变化
var childWebpack = fork(require.resolve('@srejs/vue-webpack/lib/vue/index.js'));
export default class Srejs {
    /**
     *
     * @param {*} app koa实例对象
     * @param {*} dev 是否开发环境
     * @param {*} defaultRouter 是否使用默认文件路由
     * @param options 框架配置属性
     */
    constructor(app, dev = true, defaultRouter = false, options = {}) {
        this.routes = [];
        this.app = app;
        if (dev) {
            process.env.NODE_ENV = 'development';
        } else {
            process.env.NODE_ENV = 'production';
        }
        this.dev = dev;
        this.options = common.setOptions(options);
        this.hmr();
        this.serverStatic();
        defaultRouter && this.usePageRouter();
    }

    async usePageRouter() {
        getVueEntryList().forEach((page) => {
            this.addRouter(page);
        });
        this.app.use(this.middleware());
    }

    serverStatic() {
        this.app.use(async (ctx, next) => {
            let staticStatus;
            try {
                staticStatus = await send(ctx, ctx.path, {
                    root: clientDir,
                    setHeaders: function (res) {
                        res.setHeader('Cache-Control', ['max-age=2592000']);
                    }
                });
            } catch (_err) {
                return next();
            }
            if (staticStatus == undefined) {
                await next();
            }
        });
    }
    /**
     * 注册默认路由
     * @param {*} page
     */
    addRouter(page) {
        var rePath = new RegExp('^/' + page + '(/?.*)'); // re为/^\d+bl$
        let { prefixRouter } = this.options;
        if (prefixRouter != '') {
            rePath = new RegExp('^/' + prefixRouter + '/' + page + '(/?.*)'); // re为/^\d+bl$
        }
        Logger.info(`srejs: ${rePath}---->/${page}/${page}`);
        this.routes.push(rePath);
    }
    /**
     * koa中间件拦截页面组件默认的路由，eg:web/pages/index/index.ts 映射为/index
     * @returns
     */
    middleware() {
        const self = this;
        return async (ctx, next) => {
            for (let i = 0; i < self.routes.length; i++) {
                const regRouter = self.routes[i];
                if (regRouter.test(ctx.path)) {
                    self.setContext(ctx);
                    const document = await VueRender(ctx);
                    if (!document) {
                        return next();
                    }
                    this.renderHtml(ctx, document);
                    break;
                }
            }
            await next();
        };
    }
    /**
     * 初始化koa请求上下文
     * @param {*} ctx
     * @param {*} viewName
     * @param {*} options
     */
    setContext(ctx, viewName, options = {}) {
        let { prefixRouter } = this.options;
        ctx[SSRKEY] = ctx[SSRKEY] || {};
        ctx[SSRKEY].options = Object.assign(
            {},
            this.options,
            { baseName: `/${viewName}` },
            options
        );
        const parseQ = parseQuery(ctx);
        const page = parseQ.pathname
            .replace('/' + prefixRouter, '')
            .replace(/^\//, '')
            .split('/')[0];
        ctx[SSRKEY].page = viewName || page;
        ctx[SSRKEY].query = parseQ.query;
        ctx[SSRKEY].path = ctx.path;
    }

    /**
     *
     * @param {*} ctx
     * @param {*} viewName  模板名称
     * @param {*} initProps 服务端初始化数据
     * @param {*} options
     */
    async render(ctx, viewName, initProps, options) {
        this.setContext(ctx, viewName, options);
        const html = await VueRender(ctx, initProps);
        return html;
    }

    /**
     * 返回客户端ssr结果
     * @param {*} ctx
     * @param {*} html
     */
    renderHtml(ctx, html) {
        sendHTML(ctx, html, { generateEtags: true });
    }

    /**
     * 开发环境时HMR热更新
     */
    hmr() {
        if (this.dev) {
            const page = process.argv.splice(2)[0] || true;
            new VueHotWebpack(this.app, page);
            childWebpack.send({ page, dev: true, server: true });
        }
    }
}
