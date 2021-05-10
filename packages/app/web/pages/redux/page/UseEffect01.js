import React, { useState, useEffect } from 'react';
let APP = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        //document.title = `计数是${count}`;
        console.log(`useEffect初始渲染${count}`);
    });
    return (
        <div>
            <div>
                <span>Count: {count}</span>
            </div>
            <button onClick={() => setCount(prevCount => prevCount + 1)}>加一</button>
        </div>
    );
};
module.exports = APP;
