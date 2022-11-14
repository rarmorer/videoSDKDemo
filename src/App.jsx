import './App.css';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { message, Modal } from 'antd';
import 'antd/dist/antd.min.css';
import ZoomVideo, { ConnectionState } from '@zoom/videosdk';
import ZoomContext from './context/zoom-context';
import MediaContext from './context/media-context';
import LoadingLayout from './Feature/Loading/loading-layout';
import VideoContainer from './Feature/Video/Video';
import Home from './Feature/Home/home.jsx'

const App = (props) => {
  const {
    meetingArgs: { sdkKey, topic, signature, name, password }
  } = props;

  const [loading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(' ');
  const [isFailOver, setIsFailOver] = useState(false);
  const [mediaStream, setMediaStream] = useState();
  const [status, setStatus] = useState(false);

  const client = useContext(ZoomContext);
  
  useEffect(() => {
    console.log(props.meetingArgs)
    const init = async () => {
      await client.init('en-US', 'CDN')
    
    try {
      setLoadingText('Joining Session...')
      await client.join(topic, signature, name, password)
      const stream = client.getMediaStream();
      setMediaStream(stream);
      setIsLoading(false);
    }
    catch(err) {
      console.log('Error Joining Meeting', err);
      setIsLoading(false);
      message.error(err.reason);
    }
  }
    init();
    return () => {
      ZoomVideo.destroyClient();
    }
    }, [sdkKey, signature, client, topic, name, password])

  const onConnectionChange = useCallback (
    (payload) => {
      if (payload.state === ConnectionState.Reconnecting) {
        setIsLoading(true);
        setIsFailOver(true);
        setStatus('connecting');
        const { reason } = payload;
        if (reason === 'failover') {
          setLoadingText("Session disconnected, trying to reconnect");
          }
       } else if (payload.state === ConnectionState.Connected) {
          setStatus('connected');
          if (isFailOver) {
            setIsLoading(false);
          }
        } else if (payload.state === ConnectionState.Closed) {
          setStatus('closed');
          if (payload.reason === 'ended by host') {
            Modal.warning({
              title: "Meeting ended", 
              content: "This meeting has been ended by the host"
            });
          }
        }
      }, [isFailOver]
  )

  useEffect(() => {
    client.on('connection-change', onConnectionChange);
    return () => {
      client.off('connection-change', onConnectionChange)
    }
  }, [client, onConnectionChange])
  
  const onLeaveOrJoin = useCallback(async () => {
    if (status === 'use ') {
      setIsLoading(true);
      await client.join(topic, signature, name, password);
      setIsLoading(false);
    } else if (status === 'connected') {
      await client.leave();
      message.warn('You have left the session.')
    }
  }, [client, status, topic, signature, name, password])

  return (
    <div className="App">
      {loading && <LoadingLayout content = {loadingText}/>}
      {!loading && (
        <MediaContext.Provider value = {mediaStream}>
          <Router>
          <Routes>
          <Route path = "/" element = {<Home props={props} status = {status} onLeaveOrJoin = {onLeaveOrJoin}/>}/>
          <Route path = "/video" element = {<VideoContainer/>} />
          </Routes>
          </Router>
         </MediaContext.Provider>
      )}
    </div>
  );
}

export default App;
