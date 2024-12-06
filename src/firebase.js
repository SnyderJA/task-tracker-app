import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Copy the EXACT config from your Firebase Console
  apiKey: "AIzaSyAEgobumNy5XYjpsGvII_JBU3VD1lr-lFM",
  authDomain: "team-task-tracker-fc7ca.firebaseapp.com",
  projectId: "team-task-tracker-fc7ca",
  storageBucket: "team-task-tracker-fc7ca.firebasestorage.app",
  messagingSenderId: "35803125412",
  appId: "1:35803125412:web:894440534476f21df97831"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;

console.log('Firebase initialized with Firestore'); 