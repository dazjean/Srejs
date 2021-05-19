import React from 'react';
import Slider from '../../components/slider';
import Rectangle from '../../components/rectangle';
import Search from '../../components/search';
import Context from '../../context';
import { IData } from '../../interface';
import useContextHooks from '../../hooks/useContextHooks';

export default (props: IData) => {
    const [state, dispatch] = useContextHooks(props);

    return (
        <Context.Provider value = {{ state, dispatch }}>
            <div>
                <Search></Search>
                {
                    state?.indexData?.data?.[0]?.components ? <div>
                        <Slider {...state} data={state.indexData.data[0].components} />
                        <Rectangle {...state} data={state.indexData.data[1].components} />
                    </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
                }
            </div>
        </Context.Provider>
    );
};
