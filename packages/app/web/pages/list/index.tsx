import './index.scss';
import React from 'react';
type typeProps = {
    ListData :[string]
}
export default function (props:typeProps){
     const {ListData} = props;
    return (
        <div className="list" style={{textAlign: 'center'}}>
            <h3>List</h3>
            <ul>
                {ListData.map((item,value)=>{
                    return (
                        <li key={value}>
                           <div className="item">{item}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}