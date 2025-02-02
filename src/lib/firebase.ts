import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6kO8-E2AisfwIt81aKuy1pT1-5Mtkzu8",
  authDomain: "tasklist-9ab4d.firebaseapp.com",
  projectId: "tasklist-9ab4d",
  storageBucket: "tasklist-9ab4d.firebasestorage.app",
  messagingSenderId: "352648258500",
  appId: "1:352648258500:web:3ba675d01a5a4eeff5ba91"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
