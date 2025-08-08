import { auth,db  } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types/user';

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password); // ← throws on bad email
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    email: user.email,
    name,
    createdAt: new Date(),
    lastLogin: new Date(),
    isPro: false,
  });

  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUser = async (userId: string): Promise<User> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('User not found');
  }
  
  return {
    id: docSnap.id,
    email: docSnap.data().email,
    name: docSnap.data().name,
    photoURL: docSnap.data().photoURL,
    createdAt: docSnap.data().createdAt.toDate(),
    lastLogin: docSnap.data().lastLogin.toDate(),
    isPro: docSnap.data().isPro,
    subscriptionId: docSnap.data().subscriptId,
  };
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  await setDoc(doc(db, 'users', userId), updates, { merge: true });
};