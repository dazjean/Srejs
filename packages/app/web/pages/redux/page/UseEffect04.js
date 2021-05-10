import React, { useState, useEffect } from 'react';
let APP = () => {
    let initState = async () => {
        let response = await fetch('http://localhost:9991/mock/count.json');
        let listData = await response.json();
        return listData.count;
    };

    const [count, setCount] = useState(0);
    useEffect(() => {
        initState().then(defaultCount => {
            setCount(defaultCount);
            console.log(`useEffect异步获取count${defaultCount}`);
        });
        console.log(`useEffect初始渲染`);
    }, []);
    return (
        <div>
            <div>
                <span>Count:{count}</span>
            </div>
            <button onClick={() => setCount(prevCount => prevCount + 1)}>加一</button>
        </div>
    );
};
module.exports = APP;
