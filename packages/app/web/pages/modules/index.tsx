import style from './index.module.less';
import React from 'react';
type typeProps = {
    msg: string;
};
export default function (props: typeProps) {
    return (
        <div className={style.home}>
            <p>css modules</p>
            <pre className={style.text}>{props.msg}</pre>
        </div>
    );
}
