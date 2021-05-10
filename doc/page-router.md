# 页面入口文件
> `rootDir`默认为根目录下`src`文件夹下创建pages目录。eg:src/pages/reactSrr/index.js ,使用`export default`导出页面组件。默认`_home` 为工程首页


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