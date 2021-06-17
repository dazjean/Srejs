import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { loadGetInitialProps } from './initialProps';
import { EntryList } from './webpack/entry';
import webPack from './webpack';
import tools, { clientDir, serverDir, cacheDir, SSRKEY } from './tools';
import Logger from './log';

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
    return new Promise((resolve, reject) => {
        let viewUrl = `${clientDir}/${page}/${page}.html`;
        fs.readFile(viewUrl, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
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
        let compiler = new webPack(page, tools.isDev(), true);
        await compiler.run();
    }
    if (!fs.existsSync(jsClientdir)) {
        //客户端代码打包
        let compiler = new webPack(page, tools.isDev());
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
    var { page, query } = ctx[SSRKEY];
    if (!EntryList.has(page)) {
        return false;
    }
    let App = {};
    let jspath = await checkModules(page);
    try {
        // eslint-disable-next-line no-undef
        if (tools.isDev()) {
            delete require.cache[require.resolve(jspath)];
        }
        App = require(jspath);
    } catch (error) {
        // eslint-disable-next-line no-console
        Logger.error(
            `srejs: ${page} Remove browser feature keywords such as windows/location from the react component, 
            or move into the real component didmount lifecycle for use`
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
    let location = ctx.url.split(page)[1];
    if (ssr) {
        try {
            Html = ReactDOMServer.renderToString(
                <StaticRouter location={location || '/'} context={context}>
                    <App page={page} path={ctx[SSRKEY].path} query={query} {...props} />
                </StaticRouter>
            );
        } catch (error) {
            Logger.warn('srejs:服务端渲染异常，降级使用客户端渲染！' + error.stack);
            Logger.warn(
                `srejs: ${page} Remove browser feature keywords such as windows/location from the react component, 
                or move into the real component didmount lifecycle for use`
            );
        }
    }
    if (context.url) {
        ctx.response.writeHead(301, {
            Location: context.url
        });
        ctx.response.end();
    } else {
        // 加载 index.html 的内容
        let data = await readPageHtml(page);
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
        // 把渲染后的 React HTML 插入到 div 中
        let document = data.replace(
            replaceReg,
            `<div id="${rootNode}">${Html}</div>
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
        if (tools.isDev() || !cache) {
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
