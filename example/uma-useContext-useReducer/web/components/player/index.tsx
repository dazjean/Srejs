import React, { useState } from 'react';
import { PlayerDataNode } from '../../interface';
import './index.less';

interface Props {
  data: PlayerDataNode[]
}
function Player(props: Props) {
    const [play, setPlay] = useState(false);
    const { data } = props.data[0];

    return (
        <div>
            {
                play ? <div>
                    <video src='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4' controls autoPlay className={'video'}>
              your browser does not support the video tag
                    </video>
                </div> : <div className={'playerContainer'} style={{
                    background: `url(${data.img}) 0  0 /cover`,
                }}>
                    <div className={'title'}>{data.title}</div>
                    {/* <img className={'ico'} src='https://gw.alicdn.com/tfs/TB1eA6FEW61gK0jSZFlXXXDKFXa-135-135.png' onClick={() => setPlay(true)} /> */}
                    <div className={'layer'} />
                </div>
            }
        </div>
    );
}

export default Player;
