

## 工程目录要求
框架默认配置属性`rootDir`默认为根目录下`web`，pages下是页面组件入口，比如`list`页面，目录结构为`list/index.js`
```
└── web
    └── pages
        └── list
            ├── index.jsx
            └── list.scss
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

## srejs实例化参数说明
```ts
type TssrOptions = {
    ssr: boolean;
    cache?: boolean;
};

type TcoreOptions = {
    ssr?: boolean; // 开启服务端渲染
    cache?: boolean; // 开启缓存
    rootDir?: string; // 工程根文件夹目录名称
    rootNode?: string; // 客户端渲染挂载根元素ID
};

declare class Srejs {
    /**
     *
     * @param app koa实例
     * @param dev 默认true,将改写process.env.NODE_ENV为development
     * @param defaultRouter 使用默认路由 默认true
     * @param options 框架配置属性
     */
    constructor(app: Koa, dev?: boolean, defaultRouter?: boolean, options?: TcoreOptions);
    /**
     *
     * @param ctx
     * @param viewName 页面组件名称
     * @param initProps 初始化props
     * @param options 局部属性
     */
    async render(ctx: Koa.Context, viewName: string, initProps?: object, options?: TssrOptions): string;
} 
```

## package.json命令
```js
"scripts": {
    "build":"npx srejs build" // 生产环境部署前预编译构建
},

```


## 配置文件
> 除了在初始化srejs实例时通过最后一位options参数传递，srejs将会自动扫描项目根目录`config/ssr.config.js`，配置文件格式如下：


```js
module.exports = {
    ssr: true, // 开启服务端渲染
    cache: false, // 开启缓存
    rootDir: 'web', // 工程根文件夹目录名称
    rootNode: 'app', // 客户端渲染挂载根元素ID
}
```
