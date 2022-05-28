import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAuAz0fGO79Pdtama_N8A3Ov-SAbyuSjDA',
  authDomain: 'd3firebase-157bb.firebaseapp.com',
  projectId: 'd3firebase-157bb',
  storageBucket: 'd3firebase-157bb.appspot.com',
  messagingSenderId: '226060521444',
  appId: '1:226060521444:web:89c898a34c5ad3ac2201f1',
};

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

const db = getFirestore();
const colRef = collection(db, 'dishes');

getDocs(colRef).then((snapshot) => {
  let data = [];
  snapshot.docs.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.orders)])
    .range([graphHeight, 0]);

  //min
  // const min = d3.min(data, (d) => d.orders);

  // //max
  // const max = d3.max(data, (d) => d.orders);

  // //extent (min and max)
  // const extent = d3.extent(data, (d) => d.orders);
  //bandscale
  const x = d3
    .scaleBand()
    .domain(data.map((item) => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  //join data to rects
  const rects = graph.selectAll('rect').data(data);

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

  //create and call axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3
    .axisLeft(y)
    .ticks(3)
    .tickFormat((d) => d + ' orders');

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange');
});
