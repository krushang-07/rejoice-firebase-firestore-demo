import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYS95DVfu4-s3SHh8voY1tAS9CMGJz1js",
  authDomain: "learning-task-c2bc7.firebaseapp.com",
  projectId: "learning-task-c2bc7",
  storageBucket: "learning-task-c2bc7.firebasestorage.app",
  messagingSenderId: "818513465890",
  appId: "1:818513465890:web:aef8a4b0e5ff4a92f4307b",
  databaseURL: "https://learning-task-c2bc7-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
