import './App.css';
import React, { useEffect, useContext, useState, useCallback, useReducer, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { message, Modal } from 'antd';
import produce from 'immer';
import ZoomVideo, { ConnectionState } from '@zoom/videosdk';
import ZoomContext from './context/zoom-context';
import MediaContext from './context/media-context';
import LoadingLayout from './Feature/Loading/loading-layout';
import VideoContainer from './Feature/Preview/Preview';
import Home from './Feature/Home/home.jsx'

// import Video from './feature/video/Video';

const mediaShape = {
  audio: {
    encode: false,
    decode: false
  },
  video: {
    encode: false,
    decode: false
  },
}

const mediaReducer = produce((draft, action) => {
  switch(action.type) {
    case 'audio-encode': {
      draft.audio.encode = action.payload;
      break;
    }
    case 'audio-decode': {
      draft.audio.decode = action.payload;
      break;
    }
    case 'video-encode': {
      draft.video.encode = action.payload;
      break;
    }
    case 'video-decode': {
      draft.video.encode = action.payload;
      break;
    }
    default: break;
  }
  //is this second argument the 'recipe'?
}, mediaShape)
function App(props) {
  const {
    meetingArgs: { sdkKey, topic, signature, name, password, enforceGalleryView }
  } = props;

  // const [isSupportGalleryView, setIsSupportGalleryView] = useState(true);
  const [loading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const [mediaState, dispatch] = useReducer(mediaReducer, mediaShape);
  const [mediaStream, setMediaStream] = useState();
  const mediaContext = useMemo(() => ({...mediaState, mediaStream}), [mediaState, mediaStream])
  const client = useContext(ZoomContext);
  
  useEffect(() => {
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

  return (
    <div className="App">
      {loading && <LoadingLayout content = {loadingText}/>}
      {!loading && (
        <MediaContext.Provider value = {mediaContext}>
          <Router>
          {/* <header className="App-header">
              Welcome to Zoom VideoSDK
          </header> */}
          <Routes>
          <Route path = "/" element = {<Home props={props}/>}/>
          <Route path = "/video" element = {<VideoContainer/>} />
          </Routes>
          </Router>
        </MediaContext.Provider>
      )}
    </div>
  );
}

export default App;
