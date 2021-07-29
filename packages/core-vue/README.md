<div align="center">
  <img src="./../../doc/Srejs-vue.png" width="300" />
</div>
<br />

<div align="center">
  <strong>Server rendering engine, abbreviated as srejs, is the server-side rendering engine. It provides the simplest and most flexible react and Vue lightweight server-side rendering skeleton tool for each node development framework, and supports the use in any koa framework.</strong>
</div>
<br />
<div align="center">
<a href="https://npmcharts.com/compare/@srejs/vue" target="_blank"><img src="https://img.shields.io/npm/dt/@srejs/vue" alt="download"></a>
<a href="https://github.com/dazjean/Srejs" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<a href="https://github.com/dazjean/Srejs" target="_blank"><img src="https://img.shields.io/badge/node-%3E=10-green.svg" alt="Node"></a>
</div>
<br />

> Server rendering engine 缩写为 Srejs, 即服务器端渲染引擎，为各个node开发框架提供最简单，最灵活，Vue轻量级服务端渲染骨架工具。 `Srejs`支持在`koa中间件`中使用，通过此能力我们可以对任何基于Koa的开发框架进行插件封装，比如`Umajs`,`egg`,`nest`,推荐使用[`@umajs/plugin-vue-ssr`](https://github.com/Umajs/plugin-vue-ssr#readme)提供的解决方案。

## Features
- 🚀 支持SSR和CSR模式切换
- 🚀 支持vuex做数据管理
- 🚀 支持服务端直出Props
- 🚀 和vue-router使用，支持asyncData钩子函数获取数据。
- 🚀 自定义HTML和动态设置页面title,keyworlds,discription
- 支持vue-meta
- webpack5.0
- vue3.0
- vite + vue3.0  

## 文档
- [快速开始](https://github.com/dazjean/Srejs/tree/mian/doc/vue/quickStart.md)
- [Srejs实例](https://github.com/dazjean/Srejs/tree/mian/doc/vue/srejs.md)
- [数据获取](https://github.com/dazjean/Srejs/tree/mian/doc/vue/initState.md)
- [内置CSS支持](https://github.com/dazjean/Srejs/tree/mian/doc/vue/suport-css.md)
- [SEO&HTML](https://github.com/dazjean/Srejs/tree/mian/doc/vue/seoHtml.md)
- [使用vuex](https://github.com/dazjean/Srejs/tree/mian/doc/vue/vuex.md)
- [使用vue-router路由](https://github.com/dazjean/Srejs/tree/mian/doc/vue/vue-router.md)

## 示例
- [使用vuex](https://github.com/Umajs/umajs-vue-ssr/tree/main/web/pages/vuex)
- [使用vue-router路由](https://github.com/Umajs/umajs-vue-ssr/tree/main/web/pages/router)

## 和其他koa开发框架集成
 - [umajs-react-ssr](https://github.com/Umajs/umajs-vue-ssr)
 - [plugin-react-ssr](https://github.com/Umajs/plugin-vue-ssr)