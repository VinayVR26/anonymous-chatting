import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useUserAuth } from "./UserAuthContext";

const userChatContext = createContext();

export function UserChatContextProvider({ children }) {

  const { user } = useUserAuth();

  // use useReducer if >= 2 states change at the same time or a complex state like form data or if using the updating function -> {...prev, tags: [...prev.tags, tag]}

  
  const INITIAL_STATE = {
    chatId:"null",
    user:{}
  }

  const chatReducer = (state,action) => {
    switch(action.type){
      case "CHANGE_USER":
        return {
          user:action.payload,
          chatId: user.displayName > action.payload.displayName
          ? user.displayName + action.payload.displayName
          : action.payload.displayName + user.displayName,
        };

      default:
        return state;
    }
  };
  


  const [state,dispatch] = useReducer(chatReducer, INITIAL_STATE);


  return (
    <userChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </userChatContext.Provider>
  );
}

export function useUserChat() {
  return useContext(userChatContext);
}