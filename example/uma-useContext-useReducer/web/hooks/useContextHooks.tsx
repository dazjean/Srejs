/* eslint-disable no-undef */
import { useReducer } from 'react';
import { ActionType } from '../interface';

export default (props:any) => {
    function reducer(state: any, action: ActionType) {
        // 将触发reducer后更新的状态存储到本地已达到多个页面数据共享
        window.sessionStorage.setItem('payload', JSON.stringify(action.payload));
        switch (action.type) {
            case 'updateContext':

                return { ...state, ...action.payload };
            default:
                throw new Error(`Action type ${action.type} is incorrect Please use type updateContext `);
        }
    }

    // 解决页面组件跳转或者刷新页面时更新的状态共享
    const payLoad = typeof window !== 'undefined' && JSON.parse(window.sessionStorage.getItem('payload') || '{}');

    return useReducer(reducer, { ...props, ...payLoad });
};
