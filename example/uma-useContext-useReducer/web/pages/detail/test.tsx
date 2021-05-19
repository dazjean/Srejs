import React from 'react';
import { RecommendDataNode, PlayerDataNode, BriefDataNode, Ddata } from '../../interface';
import Player from '../../components/player';
import Brief from '../../components/brief';
import Recommend from '../../components/recommend';

export default (props: Ddata) => (
    <div>
        {
            props?.detailData?.data[0].dataNode ? <div>
                <Player data={props.detailData.data[0].dataNode as PlayerDataNode[]} />
                <Brief data={props.detailData.data[1].dataNode as BriefDataNode[]} />
                <Recommend data={props.detailData.data[2].dataNode as RecommendDataNode[]} />
            </div> : <div>暂无数据~~</div>
        }
    </div>
);
