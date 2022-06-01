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

const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

let activity = 'cycling';

btns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    //get activity
    activity = e.target.dataset.activity;

    //remove and add active class
    btns.forEach((btn) => btn.classList.remove('active'));
    e.target.classList.add('active');

    //set id of input field
    input.setAttribute('id', activity);

    //set text of form span
    formAct.textContent = activity;
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const distance = parseInt(input.value);

  if (distance) {
    addDoc(colRef, {
      distance: distance,
      activity: activity,
      date: new Date().toString(),
    }).then(() => {
      form.reset();
    });
  } else {
    error.textContent = 'Please enter values before submitting';
  }
});

const margin = { top: 40, right: 20, bottom: 50, left: 100 };

const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', graphWidth + margin.left + margin.right)
  .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//graph update
const update = (data) => {
  console.log(data);
};

//graph
let data = [];

onSnapshot(colRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });
  update(data);
});
