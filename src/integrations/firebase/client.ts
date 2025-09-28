import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBouUqJHuUjiQeHR8iOhrjvL_6IMnsbSJs",
  authDomain: "forexproan.firebaseapp.com",
  databaseURL: "https://forexproan-default-rtdb.firebaseio.com",
  projectId: "forexproan",
  storageBucket: "forexproan.firebasestorage.app",
  messagingSenderId: "547483505293",
  appId: "1:547483505293:web:2f665645a3589437c708c4",
  measurementId: "G-614Z65HVS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;