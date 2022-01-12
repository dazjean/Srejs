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

## Development and debugging

```shell
yarn install
## debugg React
cd packages/app && npm start  

## debugg Vue2.0 
cd packages/app-vue && npm start 

## debugg Vue3.0
cd packages/app-vue3 && npm start 
```

## Feature

- 🚀 Support SSR and CSR(支持SSR和CSR)
- 🚀 State management（redux/vuex）
- 🚀 Initialize the component props on the server side(在服务端初始化组件Props)
- 🚀 Nested Route（React-Router/Vue-Router）
- 🚀 Customize HTML and SEO
- 🚀 Support spa and mpa(单页面应用和多页面应用)
- 🚀 Support page level build updates（按需构建指定页面编译）
- 🚀 Support layout(@srejs/react支持)
- 🚀 React16+
- 🚀 Vue2.0
- 🚀 Vue3.0

## How to Use

### Develop page components（React/Vue）

```ts
//web/pages/index/index.ts
import React from 'react'
export default function (props:any) {
  const { title } = props
  return <div className="ts-demo">{title}</div>
}
```

### Use in koa Middleware

```js
import koa from 'koa';
import srejs from '@srejs/react';
// import srejs from '@srejs/vue'; 

const app = new koa();
const Sre = new srejs(app，process.env.NODE_ENV != 'production',false); 
app.use((ctx,next)=>{
    Sre.render(ctx,'index',{title:'The page title'})
})
app.listen(8001);
```

### Production

Page components need to be compiled in advance before deployment in the production environment

Add `scripts` configuration to the `package.json`

```shell
"scripts": {
    "build":"npx ssr build",
    "analyzer": "npx ssr analyzer",
},
```

## Quick start

- [React](https://github.com/dazjean/Srejs/tree/main/packages/react)
- [Vue2.0](https://github.com/dazjean/Srejs/tree/main/packages/vue)
- [Vue3.0](https://github.com/dazjean/Srejs/tree/main/packages/vue3)

## Questions

Please open an [issue](https://github.com/dazjean/Srejs/issues/new/choose)

## License

[MIT License](./LICENSE)

Copyright (c) 2021 dazjean
