import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApjFq9ZkNjyKdeyNENCLhLiP8Gq7g65Ao",
    authDomain: "memeverse-31659.firebaseapp.com",
    projectId: "memeverse-31659",
    storageBucket: "memeverse-31659.firebasestorage.app",
    messagingSenderId: "45358614855",
    appId: "1:45358614855:web:e918a5a9db4eeb4bfa2462",
    measurementId: "G-8N5QTVD2EF"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);