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
import {
    DevMiddlewareFileSystem,
    getEntryList,
    WebpackReact as webPack
} from '@srejs/react-webpack';

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
export const renderServer = async (ctx, initProps = {}, ssr = true) => {
    const context = {};
    let props = Object.assign({}, initProps);
    let { query } = ctx[SSRKEY];
    const { page, options, path } = ctx[SSRKEY];
    const { rootNode, baseName, layout = true } = options; // baseName默认为page
    query = filterXssByJson(query);
    if (!getEntryList().has(page)) {
        return `Page component ${page} does not exist, please check the pages folder`;
    }
    let Entry = {};
    let App = {};
    let Html = '';
    let location = ctx.url.split(baseName)[1];
    if (ssr) {
        let jspath = await checkModules(page);
        // 静态方法只在ssr模式下在node服务端被调用。
        try {
            // eslint-disable-next-line no-undef
            if (common.isDev()) {
                delete require.cache[require.resolve(jspath)];
            }

            // 过滤服务端无法处理的文件类型, 重写模块加载函数, 增加过滤器
            const NodeModule = require('module').Module
            const loadBackend = NodeModule._load
            NodeModule._load = (request, parent, isMain) => {
                const isIgnore = request.match(/\.(css|scss|sass|less|styl)$/)
                if (isIgnore) {
                    return {}
                }
                return loadBackend(request, parent, isMain)
            }

            // 加载入口文件模块
            const Module = require(jspath);
            // 还原模块加载函数, 防止影响其他函数运行
            NodeModule._load = loadBackend

            App = Module.App; //
            // 兼容1.2.7版本之前构建的.ssr缓存入口文件
            if (!App) {
                App = Module.default;
                Logger.warn(
                    `SSR: 请手动删除项目根目录下的.ssr缓存目录后重新启动，否则layout将不会正常工作。`
                );
            }
            Entry = Module.default;
        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.error(
                `SSR: ${page}页面服务端加载入口文件异常，请检查是否在代码程序中使用到浏览器宿主对象特定的API(包括第三方模块需支持SSR模式安装)
                 Please check whether there are api in the code that the server does not support when rendering,
                 such as window, locaction, navigator, etc`
            );
            Logger.error(error.stack);
        }
        props = Object.assign((await loadGetInitialProps(App, ctx)) || {}, initProps);
        try {
            Html = ReactDOMServer.renderToString(
                <StaticRouter location={location || '/'} context={context}>
                    <Entry params={{ page, path, query, ...props }} layout={layout} />
                </StaticRouter>
            );
        } catch (error) {
            ctx[SSRKEY].options.ssr = false;
            Logger.warn(`SSR: 服务端渲染异常，降级使用客户端渲染:${error.message}`);
        }
    }
    if (context.url) {
        ctx.res.writeHead(301, {
            Location: page + context.url
        });
        ctx.res.end();
    } else {
        let data = await readPageHtml(page);
        Html = data.replace(`<div id="${rootNode}">`, `<div id="${rootNode}">${Html}`);

        const ssrData = {
            initProps: props,
            page,
            path: encodeURI(ctx[SSRKEY].path),
            query,
            options
        };
        const injectScriptInitProps = (temp, ssrData) => {
            const contents = temp.split('</head>');
            if (contents.length == 1) {
                console.error('SSR:警告！自定义html文件中必须包含</head>闭合标签。');
            }

            return (
                contents[0] +
                '<script>window.__SSR_DATA__=' +
                serialize(ssrData, { isJSON: true }) +
                '</script>' +
                '</head>' +
                contents[1]
            );
        };

        let document = injectScriptInitProps(Html, ssrData);
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
