// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyD9HSh-IzeJbyNGj8W48cHwm-sIuAav228",
//   authDomain: "golden-spark-6e460.firebaseapp.com",
//   projectId: "golden-spark-6e460",
//   storageBucket: "golden-spark-6e460.firebasestorage.app",
//   messagingSenderId: "113759806740",
//   // appId: "1:113759806740:web:e413c068b8a02beb4f8e01",
//   appId: "1:113759806740:web:7ae683d1acfafb2a4f8e01",
//   measurementId: "G-PN0P4BEBZL",
// };

const firebaseConfig = {
  apiKey: "AIzaSyD9HSh-IzeJbyNGj8W48cHwm-sIuAav228",
  authDomain: "golden-spark-6e460.firebaseapp.com",
  projectId: "golden-spark-6e460",
  storageBucket: "golden-spark-6e460.firebasestorage.app",
  messagingSenderId: "113759806740",
  appId: "1:113759806740:web:7ae683d1acfafb2a4f8e01",
  measurementId: "G-G6RECJF3KD"
};


// appId: "1:113759806740:web:7ae683d1acfafb2a4f8e01",

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export { app, auth, provider };
