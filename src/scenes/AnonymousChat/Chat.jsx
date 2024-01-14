import React, { useContext } from 'react';
import Messages from './Messages';
import Input from './Input';
import More from '../../constants/more.png'
import { useUserChat } from '../../context/UserChatContext';
import { useUserAuth } from '../../context/UserAuthContext';

const Chat = () => {
  const { data } = useUserChat();
  const { user } = useUserAuth();

  console.log("Chat.jsx, other user's display name", data.user?.displayName)

  return (
    <div className='chat'>
      {data.user?.displayName && data.user?.displayName !== user.displayName ? (
        <>
      <div className="chatInfo">
        <span>{data.user?.photoURL && <img className="otherUser-photo" src={data.user.photoURL} alt='' />}{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src='' alt='' /> 
          <img src='' alt='' />
          <img src={More} alt='' />
        </div>
      </div>
      <Messages />
      <Input />
      </>
      ) : (
        <div className="chatPlaceholder">
          Select a chat to start chatting
        </div>
      )}
    </div>
  );
}

export default Chat;