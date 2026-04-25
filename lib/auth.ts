import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp, Unsubscribe } from 'firebase/firestore';
import { auth, db } from './firebase';
import { PUUser } from './types';

const PU_DOMAINS = ['@poornima.org', '@poornima.edu.in'];

export function isPUEmail(email: string): boolean {
  return PU_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}

export async function signInWithEmail(email: string, password: string) {
  if (!isPUEmail(email)) {
    throw new Error('Only Poornima University email addresses (@poornima.org or @poornima.edu.in) are allowed.');
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
  studentId: string,
  routeId: string
) {
  if (!isPUEmail(email)) {
    throw new Error('Only Poornima University email addresses (@poornima.org or @poornima.edu.in) are allowed.');
  }
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // Create user profile in Firestore
  const isAdmin = email.toLowerCase().startsWith('admin');
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    name,
    studentId,
    email,
    routeId,
    role: isAdmin ? 'admin' : 'student',
    createdAt: serverTimestamp(),
  });
  return cred;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ hd: 'poornima.org' }); // hint domain for Google picker
  const result = await signInWithPopup(auth, provider);
  const email = result.user.email || '';
  if (!isPUEmail(email)) {
    await signOut(auth);
    throw new Error('Only Poornima University email addresses are allowed.');
  }
  // Create user document if first-time login
  const userRef = doc(db, 'users', result.user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    const isAdmin = email.toLowerCase().startsWith('admin');
    await setDoc(userRef, {
      uid: result.user.uid,
      name: result.user.displayName || 'PU Student',
      studentId: '',
      email,
      routeId: '',
      role: isAdmin ? 'admin' : 'student',
      createdAt: serverTimestamp(),
    });
  }
  return result;
}

export async function logOut() {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<PUUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as PUUser;
}

export function subscribeUserProfile(uid: string, callback: (profile: PUUser | null) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback(snap.data() as PUUser);
    }
  }, (error) => {
    console.error("Profile sync error:", error);
    callback(null);
  });
}
