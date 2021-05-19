import React from 'react';
import './index.less';

function Rectangle(props) {
    const data = props.data[0];

    return (
        <div className={'pbbContainer'}>
            {
                data.itemMap.map((val) => {
                    const imgUrl = val.img;

                    return (
                        <div className={'pbbItemContainer'} key={val.img} onClick={() => {
                            // eslint-disable-next-line no-undef
                            location.href = '/ykfe/detail/cbba934b14f747049187';
                        }}>
                            <div className={'pbbDescContainer'}>
                                <div className={'defaultItemBg'} style={{
                                    background: `url('${imgUrl}') 0  0 /cover`,
                                }} />
                                <div className={`${'pName'} ${'pbbName'}`} >
                                    { val.title }
                                </div>
                                <div className={`${'pDesc'} ${'pbbName'}`}>
                                    {val.subtitle}
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div >
    );
}

export default Rectangle;
