import { createSSRApp } from 'vue';
import { createStore } from 'vuex';
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';
import Main from '$injectApp$';

const Mainjs = Main.default ? Main.default : Main;
const { Router, App, Store } = Mainjs;
const isServer = typeof window === 'undefined';
const isDev = process.env.NODE_ENV !== 'production';
const rootNode = '$rootNode$';
let initProps = {};

const createStoreNext = (store) => {
    return createStore(store || {});
};

const createNextApp = (props) => {
    const storeInstance = createStoreNext(Store);
    const routerInstance = createRouterNext(props);
    const app = createSSRApp(App, props);
    app.use(storeInstance);
    app.use(routerInstance);

    return { app, store: storeInstance, router: routerInstance };
};

const createRouterNext = (props) => {
    Router?.routes?.forEach((item) => {
        item.props = Object.assign({}, item.props ?? {}, {
            ...props // 路由初始化props
        });
    });
    const createHistory = isServer ? createMemoryHistory : createWebHistory;

    return createRouter(
        Router || {
            history: createHistory(),
            routes: [{ path: '/', component: App }]
        }
    );
};

if (!isServer) {
    initProps = window.__SSR_DATA__?.initProps || {};
    const root = document.getElementById(`${rootNode}`);
    if (!root) {
        let rootDom = document.createElement('div');
        rootDom.id = `${rootNode}`;
        document.body.prepend(rootDom);
    }
    const { app, router, store } = createNextApp(initProps);
    if (window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__);
    }
    // a global mixin that calls `asyncData` when a route component's params change
    app.mixin({
        beforeRouteUpdate(to) {
            const { asyncData } = this.$options;
            if (asyncData) {
                asyncData({
                    store: this.$store,
                    route: to
                });
            }
        }
    });
    router.beforeResolve((to, from) => {
        isDev && console.log('router.beforeResolve...');
        // vue-router V4 remove router.getMatchedComponents();
        const matched = to.matched.flatMap((record) => Object.values(record.components));
        const prevMatched = from.matched.flatMap((record) => Object.values(record.components));

        let diffed = false;
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = prevMatched[i] !== c);
        });
        const asyncDataHooks = activated.map((c) => c.asyncData).filter((_) => _);
        if (!asyncDataHooks.length) {
            return true;
        }
        asyncDataHooks.map((hook) => hook({ store, route: to }));
        return true;
    });
    router.isReady().then(() => {
        isDev && console.log('router.isReady...');
        app.mount(`#${rootNode}`);
    });
    // app.mount(`#${rootNode}`);
}
export default (context) => {
    return new Promise((resolve, reject) => {
        const s = isDev && Date.now();
        const { app, router, store } = createNextApp(context);
        if (store.state) {
            context.state = Object.assign(store.state, context.state || {});
        }
        let { url } = context;
        if (!url.endsWith('/')) {
            url = url + '/';
        }
        const { options } = router;
        const { base } = options.history;
        if (options.base) {
            return reject(
                `Vue Router 4x现在移除了base属性，base 配置被作为 createWebHistory (其他 history 也一样)的第一个参数传递.请参考链接：https://next.router.vuejs.org/guide/migration/index.html#moved-the-base-option`
            );
        }
        // if (base) {
        //     const validBase = new RegExp('^/.*/$').test(base);
        //     if (!validBase) {
        //         return reject(
        //             `应用的基路径格式错误。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。Vue Router 4x现在移除了base属性，base 配置被作为 createWebHistory (其他 history 也一样)的第一个参数传递。请参考链接：https://next.router.vuejs.org/guide/migration/index.html#moved-the-base-option`
        //         );
        //     }
        // }
        //入口文件中不包含router配置时，框架默认注册了一个router配置 base为'/';  在服务端无论路由链接为多少都将匹配根路径/ ，在客户端则需要将当前url设置为客户端的base根路径
        if (!Router) {
            url = '/';
        } else if (base) {
            url = url.replace(base, '');
        }
        const { fullPath } = router.resolve(url);
        isDev && console.log('Server rendering route matching path:', fullPath);
        router.push(fullPath);
        router
            .isReady()
            .then(() => {
                // matched routes
                const matchedComponents = router.currentRoute.value.matched.flatMap((record) =>
                    Object.values(record.components)
                );
                // no matched routes
                if (!matchedComponents.length) {
                    return reject({ code: 404 });
                }
                Promise.all(
                    matchedComponents.map(
                        ({ asyncData }) =>
                            asyncData &&
                            asyncData({
                                store,
                                route: router.currentRoute
                            })
                    )
                )
                    .then(() => {
                        isDev && console.log(`data pre-fetch asyncData: ${Date.now() - s}ms`);
                        context.state = store.state;
                        resolve(app);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};
