import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ZoomContext from './context/zoom-context';
import { devConfig } from './config/dev';
import { generateVideoToken } from './tools/tools.jsx'
import ZoomVideo from '@zoom/videosdk';

let meetingArgs = {...devConfig};

// if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingArgs.topic) {
//   meetingArgs.signature = generateVideoToken(
//     meetingArgs.sdkKey,
//     meetingArgs.sdkSecret,
//     meetingArgs.topic,
//     meetingArgs.password,
//     meetingArgs.userIdentity,
//     meetingArgs.sessionKey,
//     meetingArgs.role
//   );
// }

const getToken = async({options}) => {
  let result; 
  result = await fetch("http://localhost:3001", options);
  result = await result.json();
  return result;
 
}

if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingArgs.topic) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({meetingArgs}) 
  }
  meetingArgs.signature = getToken(requestOptions);
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
