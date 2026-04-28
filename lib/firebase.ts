import { initializeApp, getApps } from 'firebase/app';
import {
  browserLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyA2Zw7mOR4nZV-2UwpyaPObVz7gV7Evxnw',
  authDomain: 'pu-buslink.firebaseapp.com',
  projectId: 'pu-buslink',
  storageBucket: 'pu-buslink.firebasestorage.app',
  messagingSenderId: '990121034148',
  appId: '1:990121034148:web:7e5f6db75c20a5c2158131',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

// Prevent multiple Firebase app initializations (important for Next.js HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize auth with local persistence to maintain session across page refreshes
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: undefined,
});
export const db = getFirestore(app);
export default app;
