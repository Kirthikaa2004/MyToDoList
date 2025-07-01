// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup as firebaseSignInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from "firebase/auth";

// 🔑 Paste your actual Firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyAXcwnGCqBXbcIWOlJmc0nxFxvvOzK1H48",
  authDomain: "todolist-7b0c4.firebaseapp.com",
  projectId: "todolist-7b0c4",
  storageBucket: "todolist-7b0c4.appspot.com",   // <---- fixed here
  messagingSenderId: "770743236950",
  appId: "1:770743236950:web:e79ceb4590e99276df3ef7",
  measurementId: "G-0LFDK9NG0D",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase auth
export const auth = getAuth(app);

// Create Google auth provider instance
export const provider = new GoogleAuthProvider();

// Wrap firebase auth functions for easier imports
export const signInWithPopup = (authInstance, providerInstance) => {
  return firebaseSignInWithPopup(authInstance, providerInstance);
};

export const signOut = (authInstance) => {
  return firebaseSignOut(authInstance);
};
