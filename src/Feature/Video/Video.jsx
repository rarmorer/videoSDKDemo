    import React, {useState, useContext, useCallback} from 'react';
    import { Button, Tooltip } from 'antd';
    import { AudioOutlined, AudioMutedOutlined, VideoCameraAddOutlined, VideoCameraOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
    import { IconFont } from '../../components/icon-font';
    import ZoomContext from '../../context/zoom-context';
    import MediaContext from '../../context/media-context';
    import './Video.scss';

    const VideoContainer = () => {
        const [videoStarted, setVideoStarted] = useState(false);
        const [audioStarted, setAudioStarted] = useState(false);
        const [isMuted, setIsMuted] = useState(false);
        const [isShareScreen, setIsShareScreen] = useState(false);
        const [isSAB, setIsSAB] = useState(false);
        const client = useContext(ZoomContext);
        const mediaStream = useContext(MediaContext);
        const isSupportWebCodecs = () => {
            return typeof window.MediaStreamTrackProcessor === 'function';
        }

        const startVideoButton = useCallback(async () => {
            if (videoStarted) {
                await mediaStream.stopVideo();
                //need this to not hold last image
                await mediaStream.stopRenderVideo( document.querySelector('#self-view-canvas'), client.getCurrentUserInfo().userId);
                setVideoStarted(false)
            } else {
                if(!!window.chrome && !(typeof SharedArrayBuffer === 'function')) {
                    // if desktop Chrome or Edge (Chromium) with SharedArrayBuffer not enabled
                    setIsSAB(false)
                    mediaStream.startVideo({ videoElement: document.querySelector('#self-view-video') });
                  } else {
                    setIsSAB(true);
                    // all other browsers and desktop Chrome or Edge (Chromium) with SharedArrayBuffer enabled
                    mediaStream.startVideo()
                        .then(async () => {
                            await mediaStream.renderVideo(
                                document.querySelector('#self-view-canvas'), 
                                client.getCurrentUserInfo().userId, 
                                1920, 1080, 0, 0, 3
                                )
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

        const shareScreen = useCallback(async () => {
            if (isShareScreen) {
                await mediaStream.stopShareScreen();
                setIsShareScreen(false)
            }
            else if (!isShareScreen) {
                if (isSupportWebCodecs()) {
                    await mediaStream.startShareScreen(document.querySelector('#self-view-video'));
                    setIsShareScreen(true);
                } else {
                    await mediaStream.startShareScreen(document.querySelector('#self-view-canvas'));
                    setIsShareScreen(true);
                }
            }
        }, [isShareScreen, mediaStream])


        return (
            <div>
                    { isSAB ?
                        <canvas id="self-view-canvas" width="1920" height="1080"></canvas> :
                        <video id="self-view-video" width="1920" height="1080"></video>
                    }
                <div className="video-footer">
                    <Tooltip title={`${videoStarted ? 'Stop Camera' : 'Start Camera'}`}>
                        <Button
                            className='camera-button'
                            icon={videoStarted ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />}
                            shape='circle'
                            size='large'
                            onClick={startVideoButton}
                        />
                    </Tooltip>
                    <Tooltip title={`${!isShareScreen ? 'Share Screen' : 'Stop Sharing Screen'}`}>
                        <Button
                            className='camera-button'
                            icon={isShareScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
                            shape='circle'
                            size='large'
                            onClick={shareScreen}
                        />
                    </Tooltip>
                    <Tooltip title={`${audioStarted ? isMuted ? 'unmute' : 'mute' : 'Start Audio'}`}>
                        <Button
                            className='camera-button'
                            icon={audioStarted ? isMuted ? <AudioMutedOutlined /> : <AudioOutlined/> : <IconFont type ="icon-headset" />}
                            shape="circle"
                            size="large"
                            onClick={startAudioButton}
                        />
                    </Tooltip>
                </div>
            </div>
        )
    }
    export default VideoContainer;
    