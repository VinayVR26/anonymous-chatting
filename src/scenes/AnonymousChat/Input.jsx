import React, { useState } from 'react';
import Attach from "../../constants/attach.png";
import Img from "../../constants/img.png";
import { useUserAuth } from '../../context/UserAuthContext';
import { useUserChat } from '../../context/UserChatContext';
import { v4 as uuid } from "uuid";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { user } = useUserAuth();
  const { data } = useUserChat();

  const handleSend = async () => {
    if (text == "" && image == null) {
      return
    }

    if (text == "") {
      setText(null)
    }

    console.log("IMAGE in Input.jsx", image)
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can track the upload progress if needed
          },
          (error) => {
            console.error("Error uploading avatar:", error);
            reject(error);
          },
          async () => {
            // Avatar uploaded successfully, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Update Firestore with the downloadURL
            await updateDoc(doc(db, "chats", data.chatId),{
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: user.displayName,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            }); 

            resolve();
          }
        );
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId),{
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId:user.displayName,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db,"userChats", user.displayName), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(), //cannot use serverTimestamp() in arrayUnion
    });
    await updateDoc(doc(db,"userChats", data.user.displayName), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    })

    setText("");
    setImage(null);
  };

  return (
    <div className='input'>
      <input type='text' placeholder="Don't be afraid to speak up. We are here for you." onChange={e=>setText(e.target.value)} value={text}/>
      <div className="send">
        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImage(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={Attach} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input