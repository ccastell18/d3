import { initializeApp } from 'firebase/app';
import {
  doc,
  getFirestore,
  collection,
  deleteDoc,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firebaseConfig } from '../config';

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, 'activities');
