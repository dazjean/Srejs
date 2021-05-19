import React from 'react';
import { RecommendDataNode } from '../../interface';
import './index.less';

interface Props {
  data: RecommendDataNode[]
}

function Recommend(props: Props) {
    const { data } = props;

    return (
        <div>
            <div className={'title'}>
        为你推荐
            </div>
            <div className={'reContainer'}>

                {
                    data.map((item) => (
                        <div key={item.data.heat} className={'reContent'}>
                            <img src={item.data.img} />
                            <div className={'vTitle'}>
                                {item.data.title}
                            </div>
                            <div className={'subTitle'}>
                                {item.data.subtitle}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Recommend;
