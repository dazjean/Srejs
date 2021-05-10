import { useState, useEffect } from 'react';
let APP = () => {
    const [time, setTime] = useState(new Date().getTime());
    const [flag, setFlag] = useState(true);
    useEffect(() => {
        let timer = setTimeout(function() {
            setTime(new Date().getTime());
        }, 0);
        console.log('effect has be run!');
        return function() {
            clearTimeout(timer);
        };
    }, [flag]); //只有flag参数变化后才会重现执行effect
    return (
        <div>
            <div>
                <span>当前时间: {time}</span>
                <button
                    onClick={() => {
                        setFlag(!flag);
                    }}>
                    update
                </button>
            </div>
        </div>
    );
};
module.exports = APP;
