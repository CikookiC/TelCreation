// src/config/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDJ9X2V9m64n-6tYBok7s6zkxx9VHDSGcw",
  authDomain: "tel-creation.firebaseapp.com",
  projectId: "tel-creation",
  storageBucket: "tel-creation.firebasestorage.app",
  messagingSenderId: "740618504184",
  appId: "1:740618504184:web:0b33ad3af17c9812a3780d"
};

// Mencegah re-initialization ganda pada Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Konfigurasi Sesi Log-In adaptif (Aman untuk Web Browser & HP)
const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? undefined 
    : getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };