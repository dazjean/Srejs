import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Main from '$injectApp$';
const Mainjs = Main.default ? Main.default : Main;
const { Router, App, Store, BeforeInit } = Mainjs;
Vue.use(VueRouter);
Vue.use(Vuex);
const inBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV !== 'production';
const rootNode = '$rootNode$';
let initProps = {};
const createStore = (store) => {
    return new Vuex.Store(store || {});
};

const createApp = (props) => {
    const store = createStore(Store);
    const router = createRouter(props);
    let mainOpt = {
        provide:{
            ...props
        },
        store,
        render: (h) =>
            h(App, {
                props
            })
    };
    if (Router) {
        mainOpt.router = router;
    }

    const app = new Vue(mainOpt);
    return { app, store, router };
};

const createRouter = (props) => {
    Router?.routes?.forEach((item) => {
        item.props = Object.assign({}, item.props ?? {}, {
            ...props // 路由初始化props 在路由页面中如何使用？？？
        });
    });

    return new VueRouter(
        Router || {
            mode: 'history',
            fallback: false,
            scrollBehavior: () => ({ y: 0 }),
            routes: [{ path: '/', component: App }]
        }
    );
};

// 在app实例被创建之前调用,用于全局组件注册等逻辑处理
const beforeInitFunc = ($app,$router,$store) => {
    if(BeforeInit && typeof BeforeInit ==='function'){
        BeforeInit($app,$router,$store);
    }
}

if (inBrowser) {
    initProps = window.__SSR_DATA__?.initProps || {};
    const root = document.getElementById(`${rootNode}`);
    if (!root) {
        let rootDom = document.createElement('div');
        rootDom.id = `${rootNode}`;
        document.body.prepend(rootDom);
    }
    const { app, router, store } = createApp(initProps);
    if (window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__);
    }
    beforeInitFunc(app,router,store);
    if (Router) {
        // a global mixin that calls `asyncData` when a route component's params change
        Vue.mixin({
            beforeRouteUpdate(to, from, next) {
                const { asyncData } = this.$options;
                if (asyncData) {
                    asyncData({
                        store: this.$store,
                        route: to
                    })
                        .then(next)
                        .catch(next);
                } else {
                    next();
                }
            }
        });
        router.onReady(() => {
            router.beforeResolve((to, from, next) => {
                const matched = router.getMatchedComponents(to);
                const prevMatched = router.getMatchedComponents(from);
                let diffed = false;
                const activated = matched.filter((c, i) => {
                    return diffed || (diffed = prevMatched[i] !== c);
                });
                const asyncDataHooks = activated.map((c) => c.asyncData).filter((_) => _);
                if (!asyncDataHooks.length) {
                    return next();
                }
                Promise.all(asyncDataHooks.map((hook) => hook({ store, route: to })))
                    .then(() => {
                        next();
                    })
                    .catch(next);
            });
            app.$mount(`#${rootNode}`);
        });
    } else {
        app.$mount(`#${rootNode}`);
    }
}
export default (context) => {
    return new Promise((resolve, reject) => {
        const s = isDev && Date.now();
        const { app, router, store } = createApp(context);
        if (store.state) {
            context.state = Object.assign(store.state, context.state || {});
        }
        beforeInitFunc(app,router,store);
        if (Router) {
            let { url } = context;
            if (!url.endsWith('/')) {
                url = url + '/';
            }
            const { options } = router;
            const { base } = options;
            if (base) {
                const validBase = new RegExp('^/.*/$').test(base);
                if (!validBase) {
                    return reject({
                        error: '应用的基路径名称前后应该包括路径斜杠标识。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"'
                    });
                }
                url = url.replace(base, '/');
            }
            const { fullPath } = router.resolve(url).route;
            router.push(fullPath);
            router.onReady(() => {
                const matchedComponents = router.getMatchedComponents();
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
                        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`);
                        context.state = store.state;
                        resolve(app);
                    })
                    .catch(reject);
            }, reject);
        } else {
            resolve(app);
        }
    });
};
