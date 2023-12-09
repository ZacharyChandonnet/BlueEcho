// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9Quiu0BYcs_xEweSy35ptKb9Fs8Y5X80",
  authDomain: "synthese-web05-07.firebaseapp.com",
  projectId: "synthese-web05-07",
  storageBucket: "synthese-web05-07.appspot.com",
  messagingSenderId: "956565790671",
  appId: "1:956565790671:web:38389f6aa49946b3693cba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();