import './index.less';
import React from 'react';
type typeProps = {
    msg: string;
};
export default function (props: typeProps) {
    return (
        <div className="ts-demo">
            <p>css modules</p>
            <pre>{props.msg}</pre>
        </div>
    );
}
