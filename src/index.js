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

//ordinal scale
const color = d3.scaleOrdinal(d3['schemeSet3']);

//legend
const legendGroup = svg
  .append('g')
  .attr('transform', `translate(${dims.width + 40},10 )`);

const legend = d3.legendColor().shape('circle').shapePadding(10).scale(color);

const update = (data) => {
  //update color scale domain
  color.domain(data.map((d) => d.name));

  //join ehanced pie data to path elements
  const paths = graph.selectAll('path').data(pie(data));

  //update call legend
  legendGroup.call(legend);
  legendGroup.selectAll('text').attr('fill', '#fff');

  //handle exit selection
  paths.exit().transition().duration(750).attrTween('d', arcTweenExit).remove();

  //update
  paths
    .attr('d', arcPath)
    .transition()
    .duration(750)
    .attrTween('d', arcTweenUpdate);

  paths
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('stroke', '#fff')
    .attr('stroke-width', '#000')
    .attr('fill', (d) => color(d.data.name))
    .each(function (d) {
      this._current = d;
    })
    .transition()
    .duration(750)
    .attrTween('d', arcTweenEnter);
};

onSnapshot(colRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };
    console.log(doc);
    console.log(change);

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

const arcTweenEnter = (d) => {
  let i = d3.interpolate(d.endAngle, d.startAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenExit = (d) => {
  let i = d3.interpolate(d.startAngle, d.endAngle);

  return function (t) {
    d.endAngle = i(t);
    return arcPath(d);
  };
};

function arcTweenUpdate(d) {
  //interpolate between two objects
  let i = d3.interpolate(this._current, d);

  //update the current prop with new updated data
  this._current = i(1);

  return function (t) {
    return arcPath(i(t));
  };
}
