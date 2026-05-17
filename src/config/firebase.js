import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJ9X2V9m64n-6tYBok7s6zkxx9VHDSGcw",
  authDomain: "tel-creation.firebaseapp.com",
  projectId: "tel-creation",
  storageBucket: "tel-creation.firebasestorage.app",
  messagingSenderId: "740618504184",
  appId: "1:740618504184:web:0b33ad3af17c9812a3780d"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

const db = getFirestore(app);

export { auth, db };