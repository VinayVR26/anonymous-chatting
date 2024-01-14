import React, { useEffect, useRef } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useUserChat } from '../../context/UserChatContext';

const Message = ({message}) => {

  const { user } = useUserAuth();
  const { data } = useUserChat();
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const getTime = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleTimeString('en-GB', options);
  };

  console.log('current user photo', user.photoURL)
  console.log('other user photo', data.photoURL)
  
  // return function for each message passed from Messages.jsx
  return (
    <div ref={ref} className={`message ${message.senderId == user.displayName && "owner"}`}>
      <div className="messageInfo">
        {/*{(message.text || message.image) && <img src={message.senderId === user.displayName ? user.photoURL : data.user.photoURL} alt='' />}*/}
        {(message.text || message.image) && <span>{getTime(message.date)}</span>}
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.image && <img src={message.image} alt='' />}
      </div>
    </div>
  )
}

export default Message;