/* eslint-disable no-restricted-globals */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'antd';
import './home.scss';
import { IconFont } from '../../components/icon-font';

const { Meta } = Card;
const Home = (props) => {
  const { status, onLeaveOrJoin } = props;

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
            'Start/Stop Audio, Mute/Unmute, Start/Stop Video',
        },
    ]
    let statusMessage;
    if (status === 'connected') statusMessage = 'Leave';
    else if (status === 'closed') statusMessage = 'Join';

    return (
      <div>
        {/* <div className="nav">
            <span>Zoomtompia22</span>
           {statusMessage && (
            <Button 
            type="link"
            onClick={onLeaveOrJoin}
            >
              {statusMessage}
            </Button>
           )}
        </div> */}
        <div className="home">
          <h1>Zoom Video SDK feature</h1>
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
      </div>
    );

}

export default Home;