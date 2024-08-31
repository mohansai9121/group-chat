import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwdEVhS05VT9RQ6RhVdhQcp3XE1HGdGfE",
  authDomain: "group-chat-ce5c0.firebaseapp.com",
  projectId: "group-chat-ce5c0",
  storageBucket: "group-chat-ce5c0.appspot.com",
  messagingSenderId: "119374283774",
  appId: "1:119374283774:web:f066c63f4119fc129776af",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(
  app,
  "https://group-chat-ce5c0-default-rtdb.asia-southeast1.firebasedatabase.app/"
);
export const storage = getStorage(app, "gs://group-chat-ce5c0.appspot.com");
