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

## 开发
```shell
yarn install
cd packages/app && npm start   // 开发调试react
cd packages/app-vue && npm start // 开发调试vue
```

## feature
- 🚀 react
- 🚀 vue2.0
- vue3.0+vite

## web组件开发
```ts
//web/pages/index/index.ts
import React from 'react'
export default function (props:any) {
  const { title } = props
  return <div className="ts-demo">{title}</div>
}
```

## 在koa中间件中使用
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

## 文档
- [react](https://github.com/dazjean/Srejs/tree/main/packages/core-react)
- [vue](https://github.com/dazjean/Srejs/tree/main/packages/core-vue)

