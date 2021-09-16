import React, { Component } from 'react';
import './index.scss';

class index extends Component {
    componentDidMount() {
        console.log('i am layout !!!!')
    }

    render() {
        const { children } = this.props
        return (
            <div className="layout">
                <div className="title">我是通用的header title</div>
                <div className="content">
                    {children}
                </div>
            </div>
        );
    }
}

export default index;