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

const modal = document.getElementById('modal');
const modButton = document.getElementById('mod-button');

modButton.addEventListener('click', () => {
  modal.focus();
});
