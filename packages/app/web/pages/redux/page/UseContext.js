import React, { useState, useContext } from 'react';
const themes = {
    light: {
        color: '#000000',
        background: '#eeeeee'
    },
    dark: {
        color: '#ffffff',
        background: '#222222'
    }
};

const ThemeContext = React.createContext(
    themes.dark // default value
);
let APP = () => {
    const [time, setTime] = useState(new Date().getTime());
    const context = useContext(ThemeContext);
    console.log(context);
    return (
        <div style={context}>
            <span>当前时间: {time}</span>
        </div>
    );
};
let Parent = () => {
    const [flag, setFlag] = useState(true);
    return (
        <ThemeContext.Provider value={flag ? themes.light : themes.dark}>
            <div>
                <APP />
                <button
                    onClick={() => {
                        setFlag(!flag);
                    }}>
                    切换主题
                </button>
            </div>
        </ThemeContext.Provider>
    );
};
module.exports = Parent;
