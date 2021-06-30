import fs from 'fs';
import { createRenderer, createBundleRenderer } from 'vue-server-renderer';
import common, { clientDir, serverDir, cacheDir, SSRKEY, Logger } from '@srejs/common';
// import { loadGetInitialProps } from './initialProps';
import {
    VueDevMiddlewareFileSystem as DevMiddlewareFileSystem,
    getVueEntryList,
    WebpackVue as webPack
} from '@srejs/webpack';

/**
 * 写入文件,存在则覆盖
 * @param {*} path 文件名称
 * @param {*} Content 内容
 */
const writeFile = async (path, Content) => {
    return new Promise((resolve) => {
        fs.writeFile(path, Content, { encoding: 'utf8' }, function (err) {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
                Logger.info(
                    `srejs:Page component ${path} successfully writes the server rendering cache`
                );
            }
        });
    });
};

/**
 * 用Promise封装异步读取文件方法
 * @param  {string} page html文件名称
 * @return {promise}
 */
export const readPageHtml = (page) => {
    return new Promise(async (resolve, reject) => {
        let viewUrl = `${clientDir}/${page}/${page}.html`;
        if (!common.isDev()) {
            fs.readFile(viewUrl, 'utf8', (err, htmlString) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(htmlString);
                }
            });
        } else {
            let htmlString = DevMiddlewareFileSystem.readFileSync(viewUrl, 'utf-8');
            resolve(htmlString);
        }
    });
};

const filterXss = (str) => {
    var s = '';
    s = str.replace(/&/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/ /g, '&nbsp;');
    s = s.replace("'", '&#39;');
    s = s.replace('"', '&quot;');
    return s;
};

const writeFileHander = (cacheDir, cacheUrl, Content) => {
    fs.exists(cacheUrl, (exists) => {
        if (exists) {
            writeFile(cacheUrl, Content);
        } else {
            fs.mkdir(cacheDir, { recursive: true }, (err) => {
                if (err) {
                    Logger.error(`srejs:${err.stack}`);
                } else {
                    writeFile(cacheUrl, Content);
                }
            });
        }
    });
};

export const checkModules = async (page) => {
    let jspath = `${serverDir}/${page}/${page}.js`;
    let jsClientdir = `${clientDir}/${page}`;
    if (!fs.existsSync(jspath)) {
        //服务端代码打包
        let compiler = new webPack(page, common.isDev(), true);
        await compiler.run();
    }
    if (!fs.existsSync(jsClientdir) && !common.isDev()) {
        //客户端代码打包
        let compiler = new webPack(page, common.isDev());
        await compiler.run();
    }
    return jspath;
};
/**
 * Router类型页面渲染解析
 * @param {*} ctx
 * @param {*} next
 */
export const renderServer = async (ctx, initProps, ssr = true) => {
    const context = { url: ctx.req.url };
    let props = {
        title: '',
        meta: ''
    };
    var { page, query } = ctx[SSRKEY];
    if (!getVueEntryList().has(page)) {
        return false;
    }
    let createApp;
    let jspath = await checkModules(page);
    try {
        // eslint-disable-next-line no-undef
        if (common.isDev()) {
            delete require.cache[require.resolve(jspath)];
        }
        createApp = require(jspath);
        createApp = createApp.default ? createApp.default : createApp;
    } catch (error) {
        // eslint-disable-next-line no-console
        Logger.error(
            `srejs: ${page} Remove browser feature keywords such as windows/location from the vue component, 
            or move into the real component didmount lifecycle for use`
        );
        Logger.error(error.stack);
    }
    if (typeof initProps === 'object') {
        props = Object.assign(props || {}, initProps);
    }
    let Html = '';
    if (ssr) {
        try {
            const App = await createApp(context);
            Html = await renderTostring(App, { ...context, ...props }, page);
        } catch (error) {
            Logger.warn('srejs:服务端渲染异常，降级使用客户端渲染！' + JSON.stringify(error));
            Html = await readPageHtml(page);
        }
    }
    let document = renderDocumentHead(Html, props);
    // // 加载 index.html 的内容
    // let data = await readPageHtml(page);
    //进行xss过滤
    for (let key in query) {
        if (query[key] instanceof Array) {
            query[key] = query[key].map((item) => {
                return filterXss(item);
            });
        } else {
            query[key] = filterXss(query[key]);
        }
    }
    let rootNode = ctx[SSRKEY].options.rootNode;
    let replaceReg = new RegExp(`<div id="${rootNode}"><\/div>`);
    // 注入__SSR_DATA__
    document = document.replace(
        replaceReg,
        `<div id="${rootNode}"></div>
         <script>var __SSR_DATA__ =
            {
                initProps:${JSON.stringify(props || {})},
                page: "${page}",
                path:"${ctx[SSRKEY].path}",
                query:${JSON.stringify(query || {})},
                options:${JSON.stringify(ctx[SSRKEY].options || {})}
            }
         </script>`
    );
    return document;
};

const renderTostring = async (App, context, page) => {
    const temp = await readPageHtml(page);
    const renderer = createRenderer({
        template: temp
    });
    return new Promise((resove, reject) => {
        renderer.renderToString(App, context, (err, html) => {
            if (err) {
                reject(err);
                return;
            }
            resove(html);
        });
    });
};

/**
 * 获取服务端渲染直出资源
 * @param {*} ctx
 */
export const render = async (ctx, initProps) => {
    let page = ctx[SSRKEY].page;
    let { cache, ssr } = ctx[SSRKEY].options;
    return new Promise(async (resolve) => {
        if (!ssr) {
            // 客户端渲染模式
            return resolve(await renderServer(ctx, initProps, false));
        }

        let ssrCacheDir = `${cacheDir}${ctx.url}/`;
        let ssrCacheUrl = `${cacheDir}${ctx.url}/${page}.html`;
        if (common.isDev() || !cache) {
            // ssr无缓存模式，适用每次请求都是动态渲染页面场景
            return resolve(await renderServer(ctx, initProps, true));
        } else {
            if (fs.existsSync(ssrCacheUrl)) {
                // ssr缓存模式，执行一次ssr 第二次直接返回缓存后的html静态资源
                let rs = fs.createReadStream(ssrCacheUrl, 'utf-8');

                return resolve(rs);
            } else {
                // ssr缓存模式,首次执行
                let document = await renderServer(ctx, initProps, true);
                process.nextTick(() => {
                    writeFileHander(ssrCacheDir, ssrCacheUrl, document); //异步写入服务器缓存目录
                });

                return resolve(document);
            }
        }
    });
};
/**
 * 从initprops中读取title,keyworkds desription写入到html中
 * @param {*} html
 * @param {*} initProps
 */
const renderDocumentHead = (document, initProps) => {
    let resStr = '';
    ['title', 'keywords', 'description'].forEach((key) => {
        if (initProps[key]) {
            if (key == 'title') {
                resStr = `<title>${initProps[key]}</title>`;
                document = document.replace(/<title>.*<\/title>/, resStr);
            } else {
                let reg = new RegExp(
                    `<meta\\s+name=[\\"']${key}[\\"'].*?content=[\\"']([\\S\\s]*?)[\\"'].*?[\\/]?>`
                );
                resStr = `<meta name="${key}" content="${initProps[key]}">`;
                if (document.match(reg)) {
                    //replace
                    document = document.replace(reg, resStr);
                } else {
                    //add
                    document = document.replace(
                        '<title>',
                        `<meta name="${key}" content="${initProps[key]}">\r\n    <title>`
                    );
                }
            }
        }
    });
    return document;
};
