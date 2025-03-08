import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDnr-2beh0YJnzh3jmd8HYb7moWsZQfRTQ",
    authDomain: "nares-sandbox.firebaseapp.com",
    projectId: "nares-sandbox",
    storageBucket: "nares-sandbox.firebasestorage.app",
    messagingSenderId: "677380498998",
    appId: "1:677380498998:web:808f8f38ae2d7a139e9a97"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

