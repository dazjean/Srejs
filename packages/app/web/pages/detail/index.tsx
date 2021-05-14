import React from 'react';
type typeProps = {
    detail: {
        text: string;
    };
};
export default function (props: typeProps) {
    const { detail } = props;
    return (
        <div className="detail" style={{ textAlign: 'center' }}>
            <h3>detail</h3>
            <div>{detail.text}</div>
        </div>
    );
}
