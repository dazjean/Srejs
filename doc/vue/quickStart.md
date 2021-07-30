# 快速开始

## 安装下载和配置
为你的项目安装`srejs` 和依赖使用的`vue`,`vuex`,`vue-router`的版本(不安装默认采用框架内置版本)
```
yarn add @srejs/vue vue vuex vue-router --save
```

打开 `package.json` 文件并添加 `scripts` 配置段：
```
"scripts": {
    "start":'node app.js',
    "build":"npx ssr build",
    "analyzer": "npx ssr analyzer",
},
```
- `start` 启动你的node项目
- `build` 运行`npx ssr build`构建用于生产环境的应用程序，Srejs为多项目工程目录结构，可通过指定页面标识单独构建或者启动特定页面，命令为：`npm run build xxx`
- `analyzer` 运行`npx ssr analyzer` 用于分析页面组件打包依赖分析 可通过 `npm run analyzer xxx` xxx为页面组件标识，可指定分析某个页面组件打包结果

## 创建目录结构
框架默认配置属性`rootDir`默认为根目录下`web`，pages下是页面组件入口，比如`list`页面，vue主入口文件为`list/index.js`，页面组件为`list/App.vue`
```
└── web
    └── pages
        └── list
            ├── App.vue
            ├── index.js
```

## 创建页面组件(App.vue)
```vue
<template>
 <!--vue2.0版本APP.vue必须要设置根元素-->
  <div id ='app'>
    <h1>{{msg}}</h1>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
		return {
			'msg' : 'hi vue ssr!'
		}
    },
  }
</script>
```

## 创建主入口文件(index.js)
```js
import App from './App.vue';
export default {
    App, // 必须导出App
    Router, //如使用vue-router 导出路由配置对象
    Store, //如使用vuex 导出store对象
};
```
`Pages`下按照文件夹名称定义vue页面组件，每一个页面组件必须包含`inde.js`主入口文件,文件必须导出组件`App`。如果使用`vue-router`,则将路由配置导出为``Router``对象；当使用`vuex`时，则将初始化配置导出为`Store`。

## 服务端路由

```js
// app.js
const Koa = require('koa');
const srejs = require('@srejs/vue');
const app = new Koa();
const Srejs = new srejs(app，process.env.NODE_ENV != 'production',false,{
    ssr: true, 
    cache: false,
    rootDir: 'web',
    rootNode: 'app',
}); 

app.use(async (ctx,next)=>{
    if(ctx.path==="/list"){
       const html = await Sre.render(ctx,'list',{title:'list Page'},{ssr:true,cache:true}); 
       ctx.type = 'text/html';
       ctx.body = html;
    }else{
        await next();
    }
})

app.listen(8001);
```

## 启动
```shell
node app.js
```

## 访问 `localhost:8001/list`