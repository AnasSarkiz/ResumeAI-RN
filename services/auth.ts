import { auth, db } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types/user';

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Ensure Firebase Auth profile also has the display name for fallback usage
  try {
    await updateProfile(user, { displayName: name });
  } catch (e) {
    // Non-fatal; continue writing user doc
    console.warn('Failed to update auth profile displayName', e);
  }

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

  const data = docSnap.data() as any;
  const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt;
  const lastLogin = data?.lastLogin?.toDate ? data.lastLogin.toDate() : data?.lastLogin;

  return {
    id: docSnap.id,
    email: data?.email ?? auth.currentUser?.email ?? '',
    name: data?.name ?? auth.currentUser?.displayName ?? undefined,
    photoURL: data?.photoURL ?? auth.currentUser?.photoURL ?? undefined,
    createdAt: createdAt ?? new Date(),
    lastLogin: lastLogin ?? new Date(),
    isPro: Boolean(data?.isPro),
    // Fix key: subscriptionId was previously misspelled as subscriptId in mapping
    subscriptionId: data?.subscriptionId ?? undefined,
  };
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  await setDoc(doc(db, 'users', userId), updates, { merge: true });
};
