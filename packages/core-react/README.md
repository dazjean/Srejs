## app.js
```
const Koa = require('koa');
const srejs = require('@srejs/react');
const app = new Koa();
new srejs(app); // srejs服务端渲染基于koa封装，开启ssr时需传入koa实例对象
app.listen(8001);

```

## package.json
```
"scripts": {
    "start":"node app.js", // 启动
    "build":"npx srejs build" // 生产环境部署前预编译构建
},

```

## 工程目录
框架默认配置属性`rootDir`默认为根目录下`web`，pages目录下必须为项目文件夹，项目名不能命名为`index`
```
└── web
    └── pages
        └── demo
            ├── index.js 
            └── demo.scss
```

## 开发预览
srejs采用多入口配置，web/pages下按照文件夹项目进行项目代码隔离，无论客户端还是服务端渲染均使用项目文件夹名称进行路由匹配。`eg:localhost:8001/index` 访问项目`index`. 


# 服务端渲染预取数据
> 服务端渲染预初始化数据，通过静态方法**getInitialProps**函数调用接口返回。
```js
APP.getInitialProps = async (ctx,query,pathname) => {
        //...
        return { count: 1 }
    }
```

客户端通过组件的props获取服务端数据,**getInitialProps**return返回的属性会挂载到组件的props上

```js
let APP = props => {
    const [count, setCount] = useState(props.count);
    return (
        <div>
            <span>Coweunt: {count}</span>
        </div>
    );
};
```
props除了挂载我们getInitialProps的返回值外，还会挂载url中的的pathname和query，可通过全局对象`window.__SSR_DATA__`访问服务端预渲染返回的初始化数据。


# 高级配置

## `ssr.config.js`
可在config/ssr.config.js下对我们的项目进行相关配置。
```
module.exports = {
    ssr: true, // 全局开启服务端渲染
    cache: true, // 全局使用服务端渲染缓存 第一次ssr,再次采用缓存，适用与存静态资源或者所有人访问的页面都是一样的工程
    staticPages: [], // 纯静态页面组件 执行一次服务端渲染，之后采用缓存html
    rootDir:'web', // 配置客户端根目录
    prefixCDN:'/', // 构建后静态资源CDN地址前缀
    prefixRouter: '', // 页面路由前缀
}
```

# 更多
- [Pages和页面组件](./../../doc/page-router.md)
- [使用tsx](./../../doc/typescript.md)
- [SEO](./../../doc/htmlTemplate.md)
- [自定义webpack](./../../doc/webpackconfig.md)
