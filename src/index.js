import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ZoomContext from './context/zoom-context';
import { devConfig } from './config/dev';
import { generateVideoToken } from './tools/tools.jsx'
import ZoomVideo from '@zoom/videosdk';

let meetingArgs = {...devConfig};

if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingArgs.topic) {
  meetingArgs.signature = generateVideoToken(
    meetingArgs.sdkKey,
    meetingArgs.sdkSecret,
    meetingArgs.topic,
    meetingArgs.password,
    meetingArgs.userIdentity,
    meetingArgs.sessionKey,
    meetingArgs.role
  );
}

const client = ZoomVideo.createClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ZoomContext.Provider value = {client}>
        <App meetingArgs = {meetingArgs}/>
      </ZoomContext.Provider>
  </React.StrictMode>
);
