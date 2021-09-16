import fs from 'fs';
import React from 'react';
import serialize from 'serialize-javascript';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import common, {
    clientDir,
    serverDir,
    cacheDir,
    SSRKEY,
    Logger,
    filterXssByJson
} from '@srejs/common';
import { loadGetInitialProps } from './initialProps';
import { DevMiddlewareFileSystem, getEntryList, WebpackReact as webPack } from '@srejs/webpack';

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
                    `SSR:Page component ${path} successfully writes the server rendering cache`
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
        const readFileSync = () => {
            fs.readFile(viewUrl, 'utf8', (err, htmlString) => {
                if (err) {
                    reject(err);
                    Logger.error(
                        'SSR: The client code is being compiled, please refresh the browser later...'
                    );
                } else {
                    resolve(htmlString);
                }
            });
        };
        if (common.isDev()) {
            try {
                let htmlString = DevMiddlewareFileSystem.readFileSync(viewUrl, 'utf-8');
                resolve(htmlString);
            } catch (error) {
                readFileSync();
            }
        } else {
            readFileSync();
        }
    });
};

const writeFileHander = (cacheDir, cacheUrl, Content) => {
    fs.exists(cacheUrl, (exists) => {
        if (exists) {
            writeFile(cacheUrl, Content);
        } else {
            fs.mkdir(cacheDir, { recursive: true }, (err) => {
                if (err) {
                    Logger.error(`SSR:${err.stack}`);
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
    const context = {};
    let props = {};
    let { query } = ctx[SSRKEY];
    const { page, options, path } = ctx[SSRKEY];
    const { rootNode, baseName, layout = true  } = options; // baseName默认为page
    query = filterXssByJson(query);
    if (!getEntryList().has(page)) {
        return `Page component ${page} does not exist, please check the pages folder`;
    }
    let App = {};
    let jspath = await checkModules(page);
    try {
        // eslint-disable-next-line no-undef
        if (common.isDev()) {
            delete require.cache[require.resolve(jspath)];
        }
        App = require(jspath);
        App = App.default ? App.default : App;
    } catch (error) {
        // eslint-disable-next-line no-console
        Logger.error(
            `SSR: ${page}Please check whether there are APIs in the code that the server does not support when rendering,
             such as window, locaction, navigator, etc`
        );
        Logger.error(error.stack);
    }
    // 静态方法只在ssr模式下在node服务端被调用。
    if (ssr) {
        props = await loadGetInitialProps(App, ctx);
    }
    if (typeof initProps === 'object') {
        props = Object.assign(props || {}, initProps);
    }
    let Html = '';
    let location = ctx.url.split(baseName)[1];
    if (ssr) {
        try {
            Html = ReactDOMServer.renderToString(
                <StaticRouter location={location || '/'} context={context}>
                    <App params={{ page, path, query, ...props }} layout={layout} />
                </StaticRouter>
            );
        } catch (error) {
            ctx[SSRKEY].options.ssr = false;
            Logger.warn('SSR:服务端渲染异常，降级使用客户端渲染！' + error.stack);
        }
    }
    if (context.url) {
        ctx.res.writeHead(301, {
            Location: page + context.url
        });
        ctx.res.end();
    } else {
        let data = await readPageHtml(page);
        const ssrData = {
            initProps: props,
            page,
            path: ctx[SSRKEY].path,
            query,
            options
        };
        let replaceReg = new RegExp(`<div id="${rootNode}"><\/div>`);
        // 把渲染后的 React HTML 插入到 div 中
        let document = data.replace(
            replaceReg,
            `<div id="${rootNode}">${Html}</div>
             <script>var __SSR_DATA__ = ${serialize(ssrData, { isJSON: true })}
             </script>`
        );
        document = renderDocumentHead(document, props);
        return document;
    }
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
