# Srejs实例

## 在nodejs中创建一个Srejs实例

创建一个`Srejs`实例之后，框架内置了webpack配置，自动扫描各个页面组件作为入口文件，在开发环境时通过`koa-webpack-middleware`启动热更新；Srejs支持在koa中间件中使用，通过此能力我们可以对任何基于Koa的开发框架进行插件封装，比如`Umajs`,`egg`,`nest`,推荐使用[`@umajs/plugin-vue-ssr`](https://github.com/Umajs/plugin-vue-ssr#readme)提供的解决方案。
```
import Koa from 'koa';
import Srejs from '@srejs/vue';
const app = new Koa();
const Srejs = new srejs(app，process.env.NODE_ENV != 'production'，false,options);
```


## API 
 - constructor(app: Koa, dev?: boolean, defaultRouter?: boolean, options?: TcoreOptions)
> 当defaultRouter开启时，框架扫描页面组件，按照命名自动映射成路由。比如`index`页面组件，自动映射为`localhost://port/index`。框架默认关闭文件默认路由方式，Srejs提供了实例方法`render`方便在koa中间件和koa-router中进行页面渲染和调用。


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


## 类型说明

- 全局配置属性(实例化参数options)

```
type TcoreOptions = {
    ssr?: true|false; // 开启服务端渲染
    cache?: true|false; // 开启缓存
    rootDir?: 'web'||string; // 工程根文件夹目录名称
    rootNode?: 'app'|string; // 客户端渲染挂载根元素ID
    prefixCDN?: '/'||string, // 构建后静态资源CDN地址前缀
    prefixRouter?: string, // 默认页面路由前缀(在defaultRouter设置为true时有效)
};
```

- 运行期配置属性(render函数options)

```ts
type TssrOptions = {
    ssr: boolean; // 开启服务端渲染
    cache?: boolean; // 开启缓存
};
```

## 配置文件
> 框架也提供静态配置文件方式初始化框架数据，配置文件中的属性将自动和实例化`Srejs`时传入的属性进行合并。配置文件默认路径为根目录下`config/ssr.config.js`

```js
module.exports = {
    ssr: true, // 开启服务端渲染
    cache: false, // 开启缓存
    rootDir: 'web', // 工程根文件夹目录名称
    rootNode: 'app', // 客户端渲染挂载根元素ID
    prefixCDN: '/', // 构建后静态资源CDN地址前缀
    prefixRouter: '', // 默认页面路由前缀(在defaultRouter设置为true时有效)
}
```
