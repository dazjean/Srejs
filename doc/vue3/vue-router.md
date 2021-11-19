# 使用vue-router

> 当vue页面组件需要和vue-router结合开发单页面应用时，在入口文件中我们也可以通过Router属性导出路由配置。

- 客户端页面组件入口文件路由配置
  
```js
import App from './App.vue';
import About from './about.vue';
import Home from './home.vue';

const isServer = typeof window === 'undefined';

const createHistory = isServer ? createMemoryHistory : createWebHistory;

export default {
    App,
    Router: {
        history: createHistory('/index/'),
        routes: [
            { path: '/about', props: true, component: About },
            { path: '/home', props: true, component: Home },
            { path: '/', redirect: '/home' }
        ]
    }
};
```

- 服务端路由

> 对于服务端我们需要保持客户端和服务端路由一致，否则会出现子路由页面刷新`404`现象。

- 页面路由获取数据

> 在页面组件中页面数据获取方式和普通页面组件保持一致，我们可以使用服务端渲染props直出和asyncData钩子函数两种方式获取，具体使用参考[数据获取](./initState.md)
