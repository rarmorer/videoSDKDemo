    import React, {useState, useContext, useCallback, useRef, useEffect} from 'react';
    import ZoomContext from '../../context/zoom-context';
    import MediaContext from '../../context/media-context';
    import './Video.scss';

    const VideoContainer = () => {
        const client = useContext(ZoomContext);
        const {mediaStream} = useContext(MediaContext);

        function startVideoButton() {
            if(!!window.chrome && !(typeof SharedArrayBuffer === 'function')) {
              // if desktop Chrome or Edge (Chromium) with SharedArrayBuffer not enabled
              mediaStream.startVideo({ videoElement: document.querySelector('#self-view-video') })
            } else {
              // all other browsers and desktop Chrome or Edge (Chromium) with SharedArrayBuffer enabled
              mediaStream.startVideo(() => {
                mediaStream.renderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId, 1920, 1080, 0, 0, 3)
              })
            }
          }
        
        return (
            <div>
                <video id="self-view-video" width="1920" height="1080"></video>
                <canvas id="self-view-canvas" width="1920" height="1080"></canvas>
                <button onClick={()=> {startVideoButton()}}>Start Video</button>
            </div>            
        )
    }

    export default VideoContainer;
    