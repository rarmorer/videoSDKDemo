    import React, {useState, useContext, useCallback, useRef, useEffect} from 'react';
    import ZoomContext from '../../context/zoom-context';
    import MediaContext from '../../context/media-context';
    import './Video.scss';

    const VideoContainer = () => {
        const [videoStarted, setVideoStarted] = useState(false);
        const [audioStarted, setAudioStarted] = useState(false);
        const [isMuted, setIsMuted] = useState(false);
        const client = useContext(ZoomContext);
        const {mediaStream} = useContext(MediaContext);

        const startVideoButton = () => {
            if (videoStarted) {
                mediaStream.stop();
                setVideoStarted(false)
            } else {
                if(!!window.chrome && !(typeof SharedArrayBuffer === 'function')) {
                    // if desktop Chrome or Edge (Chromium) with SharedArrayBuffer not enabled
                    mediaStream.startVideo({ videoElement: document.querySelector('#self-view-video') })
                  } else {
                    // all other browsers and desktop Chrome or Edge (Chromium) with SharedArrayBuffer enabled
                    mediaStream.startVideo()
                        .then(async () => {await mediaStream.renderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId, 1920, 1080, 0, 0, 3)})
                        .catch((err) => console.log(err))
                  }
                  setVideoStarted(true);
            }
          }

          const startAudioButton = async () => {
            if (audioStarted) {
                if(isMuted) {
                    await mediaStream.unmuteAudio();
                    setIsMuted(false)
                } else {
                    await mediaStream.muteAudio();
                    setIsMuted(true);
                }
            } else {
                await mediaStream.startAudio();
                setAudioStarted(true);
            }
          }


        return (
            <div>
                <video id="self-view-video" width="1920" height="1080"></video>
                <canvas id="self-view-canvas" width="1920" height="1080"></canvas>
                {!videoStarted ? <button onClick={()=> {startVideoButton()}}>Start Video</button>
                : <button onClick={()=> {startVideoButton()}}>Stop Video</button>}
                {!audioStarted ? <button onClick={()=> {startAudioButton()}}>Start Audio</button> :
                !isMuted ? <button onClick={()=> {startAudioButton()}}>Mute Audio</button> : 
                <button onClick={()=> {startAudioButton()}}>unMute Audio</button>}
            
            </div>            
        )
    }

    export default VideoContainer;
    