// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5yWf-Vh0i-k_QIDtW6bPXLkx_UUXdco8",
  authDomain: "codecollaborationapp.firebaseapp.com",
  projectId: "codecollaborationapp",
  storageBucket: "codecollaborationapp.appspot.com",
  messagingSenderId: "66611412780",
  appId: "1:66611412780:web:393ed476ebb26124d97689"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
const db = getFirestore(app);

export { db, doc, setDoc, getDoc, collection, addDoc };