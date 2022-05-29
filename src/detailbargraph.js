import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { firebaseConfig } from '../config';

initializeApp(firebaseConfig);

const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

//create margins and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

//scales
const y = d3.scaleLinear().range([graphHeight, 0]);

const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

const xAxis = d3.axisBottom(x);
const yAxis = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((d) => d + ' orders');

//update xaxis
xAxisGroup
  .selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange');

//update function
const update = (data) => {
  x.domain(data.map((item) => item.name));
  y.domain([0, d3.max(data, (d) => d.orders)]);

  //join the data to rects
  const rects = graph.selectAll('rect').data(data);
  //remove exit selection
  rects.exit().remove();
  //update current shapes in DOM
  rects
    .attr('width', x.bandwidth)
    .attr('height', (d) => graphHeight - y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => y(d.orders));

  //append enter selection to DOM
  rects
    .enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', (d) => graphHeight - y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => y(d.orders));

  //call axies

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

const db = getFirestore();
const colRef = collection(db, 'dishes');

let data = [];
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

// getDocs(colRef).then((snapshot) => {
//   snapshot.docChanges().forEach((change) => {
//     const doc = { ...change.doc.data(), id: change.doc.id };
//     console.log(doc);
//     console.log(change);

//     switch (change.type) {
//       case 'added':
//         data.push(doc);
//         break;
//       case 'modified':
//         const index = data.findIndex((item) => item.id == doc.id);
//         data[index] = doc;
//         break;
//       case 'removed':
//         data = data.filter((item) => item.id !== doc.id);
//         break;
//       default:
//         break;
//     }
//   });
//   update(data);
// });

// const y = d3
//   .scaleLinear()
//   .domain([0, d3.max(data, (d) => d.orders)])
//   .range([graphHeight, 0]);

//min
// const min = d3.min(data, (d) => d.orders);

// //max
// const max = d3.max(data, (d) => d.orders);

// //extent (min and max)
// const extent = d3.extent(data, (d) => d.orders);
//bandscale
// const x = d3
//   .scaleBand()
//   .domain(data.map((item) => item.name))
//   .range([0, 500])
//   .paddingInner(0.2)
//   .paddingOuter(0.2);

//join data to rects
// const rects = graph.selectAll('rect').data(data);

// rects
//   .attr('width', x.bandwidth)
//   .attr('height', (d) => graphHeight - y(d.orders))
//   .attr('fill', 'orange')
//   .attr('x', (d) => x(d.name))
//   .attr('y', (d) => y(d.orders));

// //append enter selection to DOM
// rects
//   .enter()
//   .append('rect')
//   .attr('width', x.bandwidth)
//   .attr('height', (d) => graphHeight - y(d.orders))
//   .attr('fill', 'orange')
//   .attr('x', (d) => x(d.name))
//   .attr('y', (d) => y(d.orders));

//create and call axis
// const xAxis = d3.axisBottom(x);
// const yAxis = d3
//   .axisLeft(y)
//   .ticks(3)
//   .tickFormat((d) => d + ' orders');

// xAxisGroup.call(xAxis);
// yAxisGroup.call(yAxis);

// xAxisGroup
//   .selectAll('text')
//   .attr('transform', 'rotate(-40)')
//   .attr('text-anchor', 'end')
//   .attr('fill', 'orange');

// const update = (data) => {
//   //update scales (domeains) if they use the data
//   y.domain([0, d3.max(data, (d) => d.orders)]);

//   // join updated data to elements
//   const rects = graph.selectAll('rect').data(data);

//   //remove unwanted shapes using the exit selection
//   rects.exit().remove();

//   //update current shapes in the DOM
//   rootCertificates.attr(...etc);

//   //append the endter selection to the DOM
//   rects
//     .enter()
//     .append('rect')
//     .attr(...etc);
// };
