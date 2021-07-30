# 页面组件
> `rootDir`默认为根目录下`src`文件夹下创建pages目录。eg:src/pages/index/index.js;在服务端使用时`index`作为页面组件标识。


- 普通页面组件
```js
export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="demo">
                hello srejs
            </div>
        );
    }
}

```

服务端路由

```js
import Koa from 'koa';
import srejs from '@srejs/react';
const app = new Koa();
const Sre = new srejs(app,process.env.NODE_ENV != 'production',false);
app.use(async (ctx,next)=>{
    if(ctx.path==="/"){
        const html = await Sre.render(ctx,'index',{title:'介绍'});
        ctx.type = 'text/html';
        ctx.body = html;
    }else{
        await next();
    }
})
```

- 使用react-router-dom 
> 项目如果使用路由，export导出组件为` <Switch>`包裹的`<Route>`
```js
export default class APP extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/about/:msg" component={About} />
                <Route component={Home} />
            </Switch>
        );
    }
}
```

使用react-router-dom时服务端路由需要和客户端路由保持一致；

```js
import Koa from 'koa';
import srejs from '@srejs/react';
const app = new Koa();
const Sre = new srejs(app,process.env.NODE_ENV != 'production',false);
app.use(async (ctx,next)=>{
    if(ctx.path.startsWith('/router')){ // 客户端默认basename为页面组件名称 eg:web/pages/router/index.tsx  basename默认为：router
        const html = await Sre.render(ctx,'router');
        ctx.type = 'text/html';
        ctx.body = html;
    }else{
        await next();
    }
})
```



**说明** 框架默认不采用页面组件工程目录作为默认路由，建议采用服务端路由自由搭配使用。如果习惯采用文件路由则初始化srejs时第三个参数`defaultRouter`设置为true。