import React from 'react';
import '../../common.less';
import style from './index.module.less';

type typeProps = {
    des: string;
};
export default function (props: typeProps) {
    return (
        <div className={style.home}>
            <p className={style.title}>css modules</p>
            <p>Srejs按照样式文件名称进行开启和关闭css modules，样式文件规则为：xxx.modules.(less|scss|css)。</p>
            <div className={style.des}>{props.des}</div>
            <a href="https://github.com/dazjean/Srejs/blob/mian/doc/cssModules.md">更多css-modules使用请查看文档</a>
        </div>
    );
}
