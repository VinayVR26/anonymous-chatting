import React, { useState, useEffect } from 'react';
import { collection, query, where, getDoc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserAuth } from '../../context/UserAuthContext';
import { doc, setDoc } from 'firebase/firestore';

const Search = () => {
  const { user } = useUserAuth();
  const [userInput, setUserInput] = useState("");
  const [userResults, setUserResults] = useState([]); 
  const [err, setErr] = useState(false);

  console.log('loggedInUser', user);
  

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", ">=", userInput),
      where("displayName", "<=", userInput + "\uf8ff")
    );
    console.log('query,q = ', q);
    try {
      const querySnapshot = await getDocs(q);  
      const results = [];
      console.log('query snapshot', querySnapshot)
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log('userData = ', userData)
        console.log('userData', userData)
        if (userData.displayName !== user.displayName) {
          results.push(userData);
        }
        console.log('searchResults', userResults)
      });
      setUserResults(results);
    } catch(err) {
      console.log(err);
      setErr(err);
    }
  };

  useEffect(() => {
    const fetchBestMatches = async () => {
      try {
        if (userInput) {
          handleSearch();
        } else {
          setUserResults([]);
        }
      } catch (error) {
        setUserResults([]);
        console.log(error);
      }
    };

    fetchBestMatches();
  }, [userInput]);

  const handleKey = e=> {
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async (selectedUser) => {
    const combinedId = 
      user.displayName > selectedUser.displayName
        ? user.displayName + selectedUser.displayName
        : selectedUser.displayName + user.displayName;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()){
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", user.displayName), {
          [combinedId+".userInfo"]: { //variable n string tgt
            uid:selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        })

        await updateDoc(doc(db, "userChats", selectedUser.displayName), {
          [combinedId+".userInfo"]: { //variable n string tgt
            uid:user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId+".date"]: serverTimestamp()
        })
        


      }

    } catch(err) {
      console.log("ERROR", err)
    }

    setUserResults([]);
    setUserInput("");
  }

  console.log('userResults', userResults)


  return (
    <div className='search'>
      <div className='searchForm'>
        <input 
        type='text' 
        placeholder='Find user' 
        //onKeyDown={handleKey} 
        onChange={e=>setUserInput(e.target.value)}
        value={userInput}/>
      </div>

      {err && <span>User not found</span>}
      {userResults.length > 0 && userResults.map((result, index) => (<div className="userChat" key={index} onClick={() => handleSelect(result)}>
        <img src={result.photoURL} alt ='' />
        <div className="userChatInfo">
          <span>{result.displayName}</span>
        </div>
      </div>
      ))}
    </div>
  )
}

export default Search