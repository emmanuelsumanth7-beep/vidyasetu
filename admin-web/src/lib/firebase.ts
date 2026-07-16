// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBC07TLzm2uetF4OTgbb54VQgos9L5swWo",
  authDomain: "vidyasetu-e7447.firebaseapp.com",
  projectId: "vidyasetu-e7447",
  storageBucket: "vidyasetu-e7447.firebasestorage.app",
  messagingSenderId: "541441817503",
  appId: "1:541441817503:web:9f868e94dd9a27167f1baa",
  measurementId: "G-4SGJK4FBQJ"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
