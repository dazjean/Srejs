# @srejs/react

<div align="center">
  <img src="./../../doc/Srejs-react.png" width="300" />
</div>
<br />

<div align="center">
  <strong>Server rendering engine, abbreviated as srejs, is the server-side rendering engine. It provides the simplest and most flexible react and Vue lightweight server-side rendering skeleton tool for each node development framework, and supports the use in any koa framework.</strong>
</div>
<br />
<div align="center">
<a href="https://npmcharts.com/compare/@srejs/react" target="_blank"><img src="https://img.shields.io/npm/dt/@srejs/react" alt="download"></a>
<a href="https://github.com/dazjean/Srejs" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<a href="https://github.com/dazjean/Srejs" target="_blank"><img src="https://img.shields.io/badge/node-%3E=10-green.svg" alt="Node"></a>
</div>
<br />

> Server rendering engine 缩写为 Srejs, 即服务器端渲染引擎，为各个node开发框架提供最简单，最灵活，Vue轻量级服务端渲染骨架工具。 `Srejs`支持在`koa中间件`中使用，通过此能力我们可以对任何基于Koa的开发框架进行插件封装，比如`UMajs`,`egg`,`nest`,推荐使用[`@umajs/plugin-react-ssr`](https://github.com/Umajs/plugin-react-ssr#readme)提供的解决方案。

## Features

- 🚀 支持SSR和CSR模式切换
- 🚀 数据管理支持redux,useContext+useReducer
- 🚀 支持服务端直出Props
- 🚀 和react-router使用
- 🚀 自定义HTML和动态设置页面title,keyworlds,discription
- 嵌套路由时路由组件支持getInitialProps钩子函数获取数据
- webpack5.0

## 更多说明

- [快速开始](https://github.com/dazjean/Srejs/tree/mian/doc/react/quickStart.md)
- [Srejs实例](https://github.com/dazjean/Srejs/tree/mian/doc/vue/srejs.md)
- [页面组件和路由](https://github.com/dazjean/Srejs/tree/mian/doc/react/page-router.md)
- [数据获取](https://github.com/dazjean/Srejs/tree/mian/doc/react/initprops.md)
- [css-modules](https://github.com/dazjean/Srejs/tree/mian/doc/react/cssModules.md)
- [自定义html](https://github.com/dazjean/Srejs/tree/mian/doc/react/htmlTemplate.md)
- [typescript](https://github.com/dazjean/Srejs/tree/mian/doc/react/typescript.md)

## 示例

- [uma-css-module](https://github.com/dazjean/Srejs/tree/mian/example/uma-css-module)
- [uma-react-redux](https://github.com/dazjean/Srejs/tree/mian/example/uma-react-redux)
- [uma-useContext-useReducer](https://github.com/dazjean/Srejs/tree/mian/example/uma-useContext-useReducer)

## 开发框架集成

- [umajs-react-ssr](https://github.com/Umajs/umajs-react-ssr)
- [plugin-react-ssr](https://github.com/Umajs/plugin-react-ssr)
