/* eslint-disable no-restricted-globals */
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Button } from 'antd';
import './home.scss';

const home = (props) => {
    // const {history, status} = props;
    const onCardClick = (type) => {
        // let history = createBrowserHistory();
        // history.push(`/${type}${location.search}`)
    }
    return (
        <div className="home">
            <h1>Zoom Video SDK Demo</h1>
            <div className="feature-entry">
                <button  onClick={(() => {onCardClick('video')})}>Preview Video</button>
                <Card 
                hoverable 
                style ={{ width:320 }}
                className="entry-item" 
                onClick={(() => {onCardClick('video')})}
                >
                </Card>
            </div>
        </div>
    )
}

export default home;