    import React, {useState, useContext, useCallback, useRef, useEffect} from 'react';
    import { Button, Tooltip } from 'antd';
    import { AudioOutlined, AudioMutedOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
    import ZoomContext from '../../context/zoom-context';
    import MediaContext from '../../context/media-context';
    import './Video.scss';

    const VideoContainer = () => {
        const [videoStarted, setVideoStarted] = useState(false);
        const [audioStarted, setAudioStarted] = useState(false);
        const [isMuted, setIsMuted] = useState(false);
        const client = useContext(ZoomContext);
        const {mediaStream} = useContext(MediaContext);

        const startVideoButton = useCallback(async () => {
            if (videoStarted) {
                mediaStream.stopVideo();
                setVideoStarted(false)
            } else {
                if(!!window.chrome && !(typeof SharedArrayBuffer === 'function')) {
                    // if desktop Chrome or Edge (Chromium) with SharedArrayBuffer not enabled
                    mediaStream.startVideo({ videoElement: document.querySelector('#self-view-video') })
                  } else {
                    // all other browsers and desktop Chrome or Edge (Chromium) with SharedArrayBuffer enabled
                    mediaStream.startVideo()
                        .then(async () => {
                            await mediaStream.renderVideo(document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId, 1920, 1080, 0, 0, 3)
                        })
                        .catch((err) => console.log(err))
                  }
                  setVideoStarted(true);
            }
          }, [mediaStream, videoStarted, client])

          const startAudioButton = useCallback(async () => {
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
          }, [mediaStream, audioStarted, isMuted])


        return (
            <div>
                <canvas id="self-view-canvas" width="1920" height="1080"></canvas>
                {!videoStarted ? <button onClick={()=> {startVideoButton()}}>Start Video</button>
                : <button onClick={()=> {startVideoButton()}}>Stop Video</button>}
                {!audioStarted ? <button onClick={()=> {startAudioButton()}}>Start Audio</button> :
                !isMuted ? <button onClick={()=> {startAudioButton()}}>Mute Audio</button> : 
                <button onClick={()=> {startAudioButton()}}>unMute Audio</button>}

            
            {/* <div className="video-footer">
                <Tooltip title={`${videoStarted ? 'stop camera' : 'start camera'}`}>
                    <Button className='camera-button'
                    icon={videoStarted ? <VideoCameraOutlined/> : <VideoCameraAddOutlined/>}
                    ghost={true} 
                    shape="circle"
                    size='large' 
                    onClick={startVideoButton}
                    />
                </Tooltip>

                <Tooltip title={`${audioStarted ? isMuted ? 'unmute' : 'mute' : 'Start Audio'}`}>
                    <Button className = 'camera-button'
                    // icon={audioStarted ? !isMuted ? <AudioMutedOutlined/> : <AudioOutlined/> : }
                    ghost={true}
                    shape="circle"
                    onClick={startAudioButton}
                    />
                </Tooltip> */}
            </div>
            // </div> 
        )
    }

    export default VideoContainer;
    