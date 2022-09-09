/* eslint-disable no-restricted-globals */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'antd';
import './home.scss';
import { IconFont } from '../../components/icon-font';

const { Meta } = Card;
const Home = () => {
    let history = useNavigate();
    const onCardClick = (type) => {
        history(`/${type}${location.search}`)
    }
    const featureList = [
        {
          key: 'video',
          icon: 'icon-meeting',
          title: 'Audio, video and share',
          description:
            'Gallery Layout, Start/Stop Audio, Mute/Unmute, Start/Stop Video, Start/Stop Screen Share',
        },
    ]

    return (
        <div className="home">
            <h1>Zoom Video SDK Demo</h1>
            <div className="feature-entry">
           {featureList.map((feature) => {
            const { key, icon, title, description } = feature;
            return (
              <Card
                cover={<IconFont style={{ fontSize: '72px' }} type={icon} />}
                hoverable
                style={{ width: 320 }}
                className="entry-item"
                key={key}
                onClick={() => onCardClick(key)}
              >
                <Meta title={title} description={description} />
              </Card>
            );
          })}
        </div>
        </div>
    )
}

export default Home;