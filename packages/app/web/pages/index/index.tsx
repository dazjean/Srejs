import './index.scss';
import React from 'react';
type typeProps = {
    title:string
}
export default function (props:typeProps){
     const {title} = props;
    return (
        <div className="ts-demo" style={{textAlign: 'center'}}>
            <br/>
            <br/>
            <p className='title'>{ title }</p>
            <ul>
                <li><a href='/router'>1.搭配react-router</a></li>
                <li><a href='/redux'>2.搭配redux</a></li>
                <li><a href='/less'>3.使用less</a></li>
                <li><a href='/list'>4.服务端初始化列表数据</a></li>
            </ul>
            <p className='footer'>
                <a  href="https://github.com/dazjean/srejs">https://github.com/dazjean/srejs</a>
            </p>
            
        </div>
    )
}