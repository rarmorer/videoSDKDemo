import ZoomContext from '../../context/zoom-context';
import MediaContext from '../../context/media-context';
import { useContext, useState, useCallback } from 'react';
import './Preview.scss';

const VideoContainer  = (props) => {
    const { mediaStream } = useContext(MediaContext)
    const [startVideo, setStartVideo] = useState(false);

    // const mediaStream = useContext(MediaContext);

    const onCameraClick = useCallback(async () => {
        if (startVideo) {
            await mediaStream.stopVideo();
            setStartVideo(false);
        }
        else{
            await mediaStream.startVideo({videoElement: document.getElementById('js-preview-video')});
            setStartVideo(true);
        }
    }, [startVideo])

    return (
        <div className = "js-preview-view">
            <div id = "js-preview-video">
                <span>
                    Video Preview
                </span>
                <video id = "js-preview-video" className = "preview-video"/>
            <button onClick={(() => onCameraClick())}>Start Video</button>
            </div>
        </div>
    )
}

export default VideoContainer;