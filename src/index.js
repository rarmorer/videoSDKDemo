/* eslint-disable no-restricted-globals */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ZoomContext from './context/zoom-context';
import { devConfig } from './config/dev';
import { generateVideoToken } from './tools/tools.jsx'
import ZoomVideo from '@zoom/videosdk';

let meetingArgs = Object.fromEntries(new URLSearchParams(location.search));

if (!meetingArgs.sdkKey || !meetingArgs.topic || !meetingArgs.name || !meetingArgs.signature) {
  meetingArgs = {...meetingArgs, ...devConfig};
  meetingArgs.enforceGalleryView = true;
}
if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingArgs.topic) {
  meetingArgs.signature = generateVideoToken(
    meetingArgs.sdkKey,
    meetingArgs.sdkSecret,
    meetingArgs.topic,
    meetingArgs.password,
    '',
    ''
  );
}

const zmClient = ZoomVideo.createClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ZoomContext.Provider value = {zmClient}>
        <App meetingArgs = {meetingArgs}/>
      </ZoomContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
