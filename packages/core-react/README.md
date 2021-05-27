<div align="center">
  <img src="./doc/Srejs.jpeg" width="300" />
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

> Server rendering engine 缩写为 Srejs, 即服务器端渲染引擎，为各个node开发框架提供最简单，最灵活的React，Vue轻量级服务端渲染骨架工具，支持在任何koa框架中使用。

## 目录
框架默认配置属性`rootDir`默认为根目录下`web`，pages下是页面组件入口，比如`list`页面，目录结构为`list/index.js`
```
└── web
    └── pages
        └── list
            ├── index.tsx
            └── index.scss
```

## 页面组件
```ts
import React from 'react';
type typeProps = {
    ListData :[string]
}
export default function (props:typeProps){
     const {ListData} = props;
    return (
        <div className="list" style={{textAlign: 'center'}}>
            <h3>列表</h3>
            <ul>
                {ListData.map((item,value)=>{
                    return (
                        <li key={value}>
                           <div className="item">{item}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
```

## 在Koa中使用
> Srejs支持在koa中间件中使用，通过此能力我们可以对任何基于Koa的开发框架进行插件封装，比如`Umajs`,`egg`,`nest`,推荐使用[`@umajs/plugin-react-ssr`](https://github.com/Umajs/plugin-react-ssr#readme)提供的解决方案。后续也会发布针对`egg`,`nest`使用的插件。
```
yarn add @srejs/react --save
```

```js
// app.js
const Koa = require('koa');
const srejs = require('@srejs/react');
const app = new Koa();
// srejs服务端渲染基于koa封装，开启ssr时需传入koa实例对象
const Srejs = new srejs(app，process.env.NODE_ENV != 'production',false,{
    ssr: true, // 开启服务端渲染
    cache: false, // 开启缓存
    rootDir: 'web', // 工程根文件夹目录名称
    rootNode: 'app', // 客户端渲染挂载根元素ID
}); 

app.use(async (ctx,next)=>{
    if(ctx.path==="/list"){
       const html = await Sre.render(ctx,'list',{ListData:['item1','item2','item3','item4',]},{ssr:true,cache:true}); 
       ctx.type = 'text/html';
       ctx.body = html;
    }else{
        await next();
    }
})

app.listen(8001);
```
## API
 - constructor(app: Koa, dev?: boolean, defaultRouter?: boolean, options?: TcoreOptions)

|  参数    |   说明   |   默认值   |
| ---- | ---- | ---- |
|  app    |   koa实例对象   |   必传   |
|  dev   |  开发模式(NODE_ENV=development)    |  true    |
|  defaultRouter   |  默认路由(按照页面组件命名映射后端路由)    |   false   |
|  options   |  框架配置属性    |    {ssr: true, cache: false, rootDir: 'web', rootNode: 'app',}|

- render(ctx: Koa.Context, viewName: string, initProps?: object, options?: TssrOptions): Promise.resove(string);

|  参数    |   说明   |   默认值   |
| ---- | ---- | ---- |
|  ctx    |   请求上下文   |   必传   |
|  viewName   |  页面组件名称   |  必传    |
|  initProps   |  页面组件初始化props数据    |   无   |
|  options   |  单页面组件运行配置   |    {ssr: true, cache: false}|


## 属性类型说明
```ts
type TssrOptions = {
    ssr: boolean; // 开启服务端渲染
    cache?: boolean; // 开启缓存
};

type TcoreOptions = {
    ssr?: boolean; // 开启服务端渲染
    cache?: boolean; // 开启缓存
    rootDir?: string; // 工程根文件夹目录名称
    rootNode?: string; // 客户端渲染挂载根元素ID
    prefixCDN?: string, // 构建后静态资源CDN地址前缀
    prefixRouter?: string, // 默认页面路由前缀(在defaultRouter设置为true时有效)
};
```

## 配置文件
> 框架也提供静态配置文件方式初始化框架数据，配置文件中的属性将自动和使用时传入的配置进行合并。

```js
// config/ssr.config.js
module.exports = {
    ssr: true, // 开启服务端渲染
    cache: false, // 开启缓存
    rootDir: 'web', // 工程根文件夹目录名称
    rootNode: 'app', // 客户端渲染挂载根元素ID
    prefixCDN: '/', // 构建后静态资源CDN地址前缀
    prefixRouter: '', // 默认页面路由前缀(在defaultRouter设置为true时有效)
}
```

## 构建部署
```js
"scripts": {
    "build":"npx srejs build" // 生产环境部署前预编译构建
},

```

## 更多说明
- [页面组件和路由](https://github.com/dazjean/Srejs/tree/mian/doc/page-router.md)
- [数据获取](https://github.com/dazjean/Srejs/tree/mian/doc/initprops.md)
- [typescript](https://github.com/dazjean/Srejs/tree/mian/doc/typescript.md)
- [css-modules](https://github.com/dazjean/Srejs/tree/mian/doc/cssModules.md)
- [自定义html](https://github.com/dazjean/Srejs/tree/mian/doc/htmlTemplate.md)

## example
- [uma-css-module](https://github.com/dazjean/Srejs/tree/mian/example/uma-css-module)
- [uma-react-redux](https://github.com/dazjean/Srejs/tree/mian/example/uma-react-redux)
- [uma-useContext-useReducer](https://github.com/dazjean/Srejs/tree/mian/example/uma-useContext-useReducer)

## 谁在使用
 - [umajs-react-ssr](https://github.com/Umajs/umajs-react-ssr)
 - [plugin-react-ssr](https://github.com/Umajs/plugin-react-ssr)
