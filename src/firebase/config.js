// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQIqescdtt25iKlvsf0zDpofMZzxhKlEY",
  authDomain: "vanessa-riffo-eje2-formulario.firebaseapp.com",
  projectId: "vanessa-riffo-eje2-formulario",
  storageBucket: "vanessa-riffo-eje2-formulario.firebasestorage.app",
  messagingSenderId: "236940296319",
  appId: "1:236940296319:web:0a2f93b4f0141d0e243f4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);