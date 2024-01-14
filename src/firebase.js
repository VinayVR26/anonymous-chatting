import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Storage
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVUR1LdbAP7t4iliuIxwrApXs8uUwNQuM",
  authDomain: "anonymous-chatting-bd9b7.firebaseapp.com",
  projectId: "anonymous-chatting-bd9b7",
  storageBucket: "anonymous-chatting-bd9b7.appspot.com",
  messagingSenderId: "812981729280",
  appId: "1:812981729280:web:5fcec052a74680f1d2c0e5",
  measurementId: "G-H060J3ZX3J"
};

// Initialize Firebase with the provided configuration
const app = initializeApp(firebaseConfig);
// Create an auth instance to handle user authentication
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
