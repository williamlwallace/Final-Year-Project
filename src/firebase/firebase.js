import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCAeCyt2mH10ze_LezGzc8h3nF6feakyLo",
    authDomain: "coki-explorer.firebaseapp.com",
    databaseURL: "https://coki-explorer.firebaseio.com",
    projectId: "coki-explorer",
    storageBucket: "coki-explorer.appspot.com",
    messagingSenderId: "1009140869228",
    appId: "1:1009140869228:web:24d57b1a6b91c74a5c9049",
    measurementId: "G-YRKJ3E1Q6N"
  };

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDb = myFirebase.firestore();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const db = baseDb;