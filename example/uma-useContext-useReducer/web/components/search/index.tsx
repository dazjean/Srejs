import React, { useContext } from 'react';
import { IData, MixStateAndDispatch } from '../../interface';
import Context from '../../context';

import style from './index.module.less';

interface SearchState extends IData {
  search?: {
    text: string
  }
}
// 参考本组件学习如何使用 useContext 来跨组件/页面共享状态
function Search() {
    const { state, dispatch } = useContext<MixStateAndDispatch<SearchState>>(Context);
    // eslint-disable-next-line no-undef
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch?.({
            type: 'updateContext',
            payload: {
                search: {
                    text: e.target.value,
                },
            },
        });
    };

    const toSearch = () => {
        const searchVal = state?.search?.text ?? '';

        // eslint-disable-next-line no-restricted-globals
        // eslint-disable-next-line no-undef
        location.href = `https://search.youku.com/search_video?keyword=${searchVal}`;
    };

    return (
        <div className={style.searchContainer}>
            {/* 这里需要给 value 一个兜底的状态 否则 context 改变 首次 render 的 text 值为 undefined 会导致 input 组件 unmount */}
            {/* ref: https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro/47012342 */}
            <input type="text" className={style.input} value={state?.search?.text ?? ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享" />
            <span className={style.searchImg} onClick={toSearch} />
        </div >
    );
}

export default Search;
