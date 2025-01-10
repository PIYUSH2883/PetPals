// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDucg2qkmHHHIe2-lLsD8Nohg9fwxDPujI",
    authDomain: "patadoption.firebaseapp.com",
    projectId: "patadoption",
    storageBucket: "patadoption.appspot.com",
    messagingSenderId: "626241493713",
    appId: "1:626241493713:web:95e02160529adda656c3f0"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
