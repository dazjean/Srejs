import React, { useReducer } from 'react';
import TimeReducer from './../reducer/timeReducer';
import { resetTime, addTime, fetchTime } from './../action/timeAction';
function Clock() {
    const [reduxState, dispatch] = useReducer(TimeReducer, { time: 100000 });
    return (
        <div>
            Seco24ndsdfdsfdsf: {reduxState.time}
            <button
                onClick={async () => {
                    //initState();//异步获取请求
                    fetchTime().then(action => {
                        dispatch(action);
                    });
                }}>
                get
            </button>
            <button
                onClick={() => {
                    dispatch(resetTime(0));
                }}>
                resetTime
            </button>
            <button
                onClick={() => {
                    dispatch(addTime());
                }}>
                add
            </button>
        </div>
    );
}
module.exports = Clock;
