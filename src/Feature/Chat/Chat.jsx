import React, {useState, useContext, useCallback, useRef, useEffect} from 'react';
import ZoomContext from '../../context/zoom-context';
import ChatContext from '../../context/chat-context';
import { Input } from 'antd';
import produce from 'immer';
import './chat.scss';
import ChatMessageItem from './chat-message-item'
import ChatReceiverContainer from './chat-receiver'

const { TextArea } = Input;

const Chat = () => {
    const client = useContext(ZoomContext);
    const chatClient = useContext(ChatContext);
    const [chatMessage, setChatMessage] = useState('');
    const [chatUser, setChatUser] = useState(null);
    const [chatReceivers, setChatReceivers] = useState([]);
    const [userId, setUserId] = useState(0);
    const [chatRecords, setChatRecords] = useState([]);
    const chatWrapRef = useRef(null);
    

   const onChatMessage = useCallback((payload) => {
        setChatRecords(produce((records) => {
            const length = records.length;
            if (length > 0) {
                const lastRecord = records[length-1];
                if (
                    payload.sender.userId === lastRecord.sender.userId &&
                    payload.receiver.userId === lastRecord.sender.userId &&
                    payload.timestamp - lastRecord.timestamp < 1000 * 60 * 5
                ) {
                    if (Array.isArray(lastRecord.message)) {
                        lastRecord.message.push(payload.message)
                    } else {
                        lastRecord.message = [lastRecord.message, payload.message]
                    }
                } else {
                    records.push(payload)
                }
            } else {
                records.push(payload)
            }
        }),
        );
        if (chatWrapRef.current) {
            chatWrapRef.current.scrollTo(0, chatWrapRef.current.scrollHeight)
        }
   }, [chatWrapRef]);

   const onInput = useCallback((e) => {
    setChatMessage(e.target.value)
   }, []);

   useEffect(() => {
    client.on('chat-on-message', onChatMessage);
    return () => {
        client.off('chat-on-message', onChatMessage);
    }
   }, [client, onChatMessage]);

   useEffect(() => {
    if (chatUser) {
        const index = chatReceivers.findIndex((user) => user.userId === chatUser.userId)
        if (index === -1) {
            setChatUser(chatReceivers[0])
        }
    } else {
        if (chatReceivers.length > 0) {
            setChatUser(chatReceivers[0])
        }
    }
   }, [chatReceivers, chatUser])

   const sendMessage = useCallback((e) => {
        e.preventDefault();
        if (chatMessage && chatUser) {
            chatClient.send(chatMessage, chatUser.userId);
            setChatMessage('');
        }
   }, [chatClient, chatMessage, chatUser]);

   return (
    <div className = "chat-container">
        <div className = "chat-wrap">
            <h2>Chat</h2>
            <div className="chat-message-wrap" ref={chatWrapRef}>
                {chatRecords.map((record) => (
                    <ChatMessageItem
                    record={record}
                    // currentUserId={currentUserId}
                    // setChatUser={setChatUserId}
                    key={record.timestamp}
                    />
                ))}
            </div>
            <ChatReceiverContainer
              chatUsers={chatReceivers}
              selectedChatUser={chatUser}
            //   isHostOrManager={isHost || isManager}
            //   chatPrivilege={chatPrivilege}
            //   setChatUser={setChatUserId}
            />
            <div className="chat-message-box">
                <TextArea
                    onPressEnter={sendMessage}
                    onChange={onInput}
                    value={chatMessage}
                    placeholder="Type Message Here..."
                />
            </div>
        </div>
    </div>
   )

}
export default Chat;