import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './loading-layout.scss';


const loadingLayout = (props) => {
    const { content } = props;
    return (
        <div className = "loading-layout">
            <LoadingOutlined style = {{ fontSize: '86px', color: '#fff' }} />
            <p>{content}</p>
        </div>
    )
}
export default loadingLayout;