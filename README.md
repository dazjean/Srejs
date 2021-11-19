<div align="center">
  <img src="./doc/Srejs.png" width="300" />
</div>
<br />

<div align="center">
  <strong>Server rendering engine, abbreviated as srejs, is the server-side rendering engine. It provides the simplest and most flexible react and Vue lightweight server-side rendering skeleton tool for each node development framework, and supports the use in any koa framework.</strong>
</div>
<br />
<div align="center">
<a href="https://npmcharts.com/compare/@srejs/react" target="_blank"><img src="https://img.shields.io/npm/dt/@srejs/react" alt="react"></a>
<a href="https://npmcharts.com/compare/@srejs/react" target="_blank"><img src="https://img.shields.io/npm/dt/@srejs/vue" alt="vue"></a>
<a href="https://github.com/dazjean/Srejs" target="_blank"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<a href="https://github.com/dazjean/Srejs" target="_blank"><img src="https://img.shields.io/badge/node-%3E=10-green.svg" alt="Node"></a>
</div>
<br />

> Server rendering engine 缩写为 Srejs, 即服务器端渲染引擎，为各个node开发框架提供最简单，最灵活的React，Vue轻量级服务端渲染骨架工具，支持在任何koa框架中使用。

## Development

```shell
yarn install
cd packages/app && npm start   // 开发调试React
cd packages/app-vue && npm start // 开发调试Vue2.0
cd packages/app-vue3 && npm start // 开发调试Vue3.0
```

## Feature

- 🚀 支持SSR和CSR
- 🚀 状态管理（redux/vuex）
- 🚀 服务端数据初始化
- 🚀 嵌套路由（React-Router/Vue-Router）
- 🚀 自定义HTML和SEO
- 🚀 单页面应用和多页面应用
- 🚀 页面级构建更新
- 🚀 layout(@srejs/react支持)
- 🚀 React16+
- 🚀 Vue2.0
- 🚀 Vue3.0

## 使用

### Client

```ts
//web/pages/index/index.ts
import React from 'react'
export default function (props:any) {
  const { title } = props
  return <div className="ts-demo">{title}</div>
}
```

### Server

```js
import koa from 'koa';
import srejs from '@srejs/react';
// import srejs from '@srejs/vue'; 

const app = new koa();
const Sre = new srejs(app，process.env.NODE_ENV != 'production',false); 
app.use((ctx,next)=>{
    Sre.render(ctx,'index',{title:'标题'})
})
app.listen(8001);
```

### 编译

打开 `package.json` 文件并添加 `scripts` 配置段：

```shell
"scripts": {
    "build":"npx ssr build",
    "analyzer": "npx ssr analyzer",
},
```

## 快速开始

- [React](https://github.com/dazjean/Srejs/tree/main/packages/react)
- [Vue2.0](https://github.com/dazjean/Srejs/tree/main/packages/vue)
- [Vue3.0](https://github.com/dazjean/Srejs/tree/main/packages/vue3)


## [MIT License](./LICENSE)
