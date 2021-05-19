import React from 'react';
import Swiper from 'react-id-swiper';
import { ItemMapArr } from '../../interface';
import 'swiper/swiper.less';
import './index.less';

interface Props {
  data: ItemMapArr[],
  [key:string]:any
}

const params = {
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        loop: true,
    },
};

function Slider(props: Props) {
    const data = props.data[0];

    return (
        <div className={'swiperContainer'}>
            <Swiper {...params}>
                {
                    data.itemMap.map((val) => (
                        <div className={'sliderContainer'} key={val.img} onClick={() => props.history.push('/detail/cbba934b14f747049187')}>
                            <img src={val.img} className={'carouselImg'} />
                            <div className={'sliderDescContainer'}>
                                <span className={'sliderTitle'}>
                                    {val.title}
                                </span>
                            </div>
                        </div>
                    ))
                }
            </Swiper>
        </div>
    );
}

export default Slider;
