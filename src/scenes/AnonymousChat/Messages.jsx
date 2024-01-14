import React, { useEffect, useState } from 'react';
import Message from './Message';
import { useUserChat } from '../../context/UserChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useUserChat();

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(()=> {
    const unsubscribe = onSnapshot(doc(db,"chats", data.chatId), (doc)=> {
      doc.exists() && setMessages(doc.data().messages)
    });

    return()=>{
      unsubscribe()
    }
  }, [data.chatId])

  const groupMessagesByDate = () => {
    const groupedMessages = [];
    let currentDate = null;

    const formatDate = (date) => {
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      };
    
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    
      return `${day} ${month} ${year} (${weekday})`;
    };

    messages.forEach((message) => {
      const messageDate = message.date.toDate();
  
      if (!currentDate || !isSameDay(messageDate, currentDate)) {
        currentDate = messageDate;
        groupedMessages.push({
          date: formatDate(messageDate),
          messages: [message],
        });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(message);
      }
    });
  
    return groupedMessages;
  };

  const groupedMessages = groupMessagesByDate();

  console.log('messages', messages)


  return (
    <div className='messages'>
      {groupedMessages.map((group) => (
        <React.Fragment key={group.date}>
          <div className="messageDate text-center">{group.date}</div>
          {group.messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Messages;