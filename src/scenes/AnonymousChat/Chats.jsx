import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserAuth } from '../../context/UserAuthContext';
import { useUserChat } from '../../context/UserChatContext';

const Chats = () => {

  const { user } = useUserAuth();
  const { dispatch } = useUserChat();
  const [chats, setChats] = useState([]);
  

  //IMPORTANT
  useEffect(() => { // get real-time updates when db has changes
    const getChats = () => {
      const unsubscribe = onSnapshot(doc(db, "userChats", user.displayName), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsubscribe();
      };
    };

    user.displayName && getChats()
  }, [user.displayName]);

  const handleSelect = (u) => {
    console.log('u', u);
    dispatch({type: "CHANGE_USER", payload: u});
  }


  console.log("CHATS", chats)

  // Return the list of chats on the left side
  return ( 
    <div className='chats'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
      <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
        <img src={chat[1].userInfo.photoURL} alt ='' />
        <div className="userChatInfo">
          <span>{chat[1].userInfo.displayName}</span>
          <p>{chat[1].lastMessage?.text === "" ? '<image sent>' : chat[1].lastMessage?.text}</p>
        </div>
      </div>
      ))}
    </div>
  )
}

export default Chats;