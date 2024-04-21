// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  
  initializeAuth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyCUzS2UMkJnb_Lhmyv2hVI-NhuXjfUUlE8",
  authDomain: "expense-tracker-c8a2d.firebaseapp.com",
  projectId: "expense-tracker-c8a2d",
  storageBucket: "expense-tracker-c8a2d.appspot.com",
  messagingSenderId: "140309395963",
  appId: "1:140309395963:web:7b58218b6c768cbfe3f35e",
  measurementId: "G-B9HDKDZPS1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const db = getFirestore();
