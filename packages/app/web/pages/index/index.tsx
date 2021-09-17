import './index.scss';
import React from 'react';
import srejsLogo from '@/images/srejs.png';
const commonjsLogo = require('@/images/srejs.png').default;
type typeProps = {
    title: string,
    userTitle: string
};
const Index = (props: typeProps) => {
    const { title, userTitle } = props;
    return (
        <div className="home" style={{ textAlign: 'center' }}>
            <br />
            <br />
            <p className="title">{title}{userTitle}</p>
            <ul>
                <li>
                    <a href="/detail/1">1.动态路由</a>
                </li>
                <li>
                    <a href="/router">2.router嵌套路由</a>
                </li>
                <li>
                    <a href="/serverList">3.服务端渲染列表</a>
                </li>
                <li>
                    <a href="/clientList">3.客户端渲染列表</a>
                </li>
                <li>
                    <a href="/redux">4.useRedux</a>
                </li>
                <li>
                    <a href="/modules">5.css modules</a>
                </li>
            </ul>
            <p className="footer">
                <a href="https://github.com/dazjean/srejs">https://github.com/dazjean/srejs</a>
            </p>
            <span style={{ display: 'inline-block' }}>
                <img src={srejsLogo} />
            </span>
            <span style={{ display: 'inline-block' }}>
                <img src={commonjsLogo} />
            </span>
        </div>
    );
}

function timeout () {
    return new Promise((reslove) => {
        setTimeout(() => {
            reslove({
                userTitle: '列表'
            })
        }, 500)
    })
}

Index.getInitialProps = async () => {
    return await timeout()
}

export default Index
