import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firebaseConfig } from '../config';

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, 'expenses');

const form = document.querySelector('form');
const name = document.getElementById('name');
const cost = document.getElementById('cost');
const error = document.getElementById('error');

let data = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (name.value && cost.value) {
    addDoc(colRef, {
      name: form.name.value,
      cost: parseInt(form.cost.value),
    }).then(() => {
      form.reset();
    });
    // onSnapshot(colRef, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     let doc = { ...change.doc.data() };

    //     data.push(doc);
    //   });
    // });
  } else {
    error.textContent = 'Please enter values before submitting';
  }
});

//Graph
const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

const graph = svg
  .append('g')
  .attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);

const arcPath = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);
