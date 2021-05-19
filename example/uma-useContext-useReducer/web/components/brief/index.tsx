import React from 'react';
import { BriefDataNode } from '../../interface';
import './index.less';

interface Props {
  data: BriefDataNode[]
}
function Brief(props: Props) {
    const { data } = props.data[0];

    return (
        <div className={'brief-info'}>
            <div className={'brief-title'}>
                <span className={'icon-GOLDEN'}>{data.mark.data.text}</span>
                <h1>{data.showName}</h1>
            </div>
            <div className={'brief-score'}>
                {
                    data.subTitleList.map((item, index) => (
                        item.subtitle && (
                            <span className={`${(item.subtitleType === 'PLAY_VV' && 'hotVv') || ''}`} key={`subtile${index}`}>
                                {
                                    // eslint-disable-next-line no-nested-ternary
                                    item.subtitleType === 'PLAY_VV'
                                        ? <img src={data.heatIcon} />
                                        : (index > 0) ? (<span className={'divide'}>/</span>) : ''
                                }
                                <span>{item.subtitle}</span>
                            </span>
                        )
                    ))
                }
            </div>
        </div>
    );
}

export default Brief;
