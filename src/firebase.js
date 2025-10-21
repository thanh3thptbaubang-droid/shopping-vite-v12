
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_FIREBASE_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_FIREBASE_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_FIREBASE_APP_ID'
}

const app = (typeof window !== 'undefined') ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : initializeApp(firebaseConfig)
export const auth = typeof window !== 'undefined' ? getAuth(app) : null
export const db = typeof window !== 'undefined' ? getFirestore(app) : null
export const storage = typeof window !== 'undefined' ? getStorage(app) : null
export default app
