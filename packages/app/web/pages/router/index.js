'use strict';
//引入样式文件
import './index.scss';
//引入组件
import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
class Home extends Component {
    constructor(props) {
        super(props);
        this.goAboutPage = this.goAboutPage.bind(this);
    }
    goAboutPage() {
        this.props.history.push({
            pathname: '/about',
            state: {
                msg: '来自首页的问候！by state'
            }
        });
    }
    render() {
        return (
            <div>
                我是首页路由
                <br />
                <Link to="/about?msg='我是url参数'">子页面1</Link>
                <br />
                <Link to="/about/我是url参数">子页面2</Link>
                <div onClick={this.goAboutPage}>子页面3</div>
            </div>
        );
    }
}

class About extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props.location);
        return (
            <div>
                我是一个路由跳转后的子页面
                <br />
                <div>参数：{JSON.stringify(this.props.location)}</div>
                <Link to="/">回首页</Link>
            </div>
        );
    }
}

export default class APP extends Component {
    render() {
        return (
            <div className="demo">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/about/:msg" component={About} />
                    <Redirect path="*" to="/about" />
                </Switch>
            </div>
        );
    }
}
