

### 服务端获取initProps（推荐）
> 当前前后端的交互不一定是http,而是rpc框架或者直接从数据库中获取并加工获得。这种方式就存在很大的局限，一是不方便node调试，而是必须使用http作为前后端交互通信方式，而且这种将node环境和客户端页面组件混写在一起的方式也会增加开发人员的理解，所以我们建议使用服务端直接获取方式。


```js
// 服务端路由
import Koa from 'koa';
import srejs from '@srejs/react';
const app = new Koa();
const Sre = new srejs(app,process.env.NODE_ENV != 'production',false);
app.use(async (ctx,next)=>{
    if(ctx.path==="/list"){
        // ListData将作为list页面组件初始props属性在react组件中被接收。
        const html = await Sre.render(ctx,'list',{ListData:['item1','item2','item3','item4',]});

        ctx.type = 'text/html';
        ctx.body = html;
    }else{
        await next();
    }
})

// 客户端页面组件
export default function (props:typeProps){
     const {ListData} = props;
    return (
        <div className="list" style={{textAlign: 'center'}}>
            <h3>List</h3>
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



### 静态方法getInitialProps（不建议）

> getInitialProps静态方法是由`nextjs`提出的概念，是在组件实例中挂载一个static静态方法，当服务渲染时预先调用此方法获取到数据，然后再SSR阶段通过props初始化到页面组件中，从而得到完整的html结果。这种方案也被业内其他框架追随，包括`egg-react-ssrs` `ykfe/ssr` `easy-team`等。

```js
function Page(props) {
  return <div> {props.name} </div>
}

Page.getInitialProps = async (ctx) => {
  return Promise.resolve({
    name: 'Srejs + React + SSR',
  })
}

export default Page
```