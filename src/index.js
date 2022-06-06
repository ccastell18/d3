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

    update(data);
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

//scales
const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

//axes group
const xAxisGroup = graph
  .append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`);

const yAxisGroup = graph.append('g').attr('class', 'y-axis');

//line path generator
const line = d3
  .line()
  .x(function (d) {
    return x(new Date(d.date));
  })
  .y(function (d) {
    return y(d.distance);
  });

const path = graph.append('path');

//create dotted lines
const dottedLine = graph.append('g').attr('class', 'line').style('opacity', 0);

const xDottedLine = dottedLine
  .append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

const yDottedLine = dottedLine
  .append('line')
  .attr('stroke', '#aaa')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', 4);

//graph update
const update = (data) => {
  //filter for activity
  data = data.filter((item) => item.activity == activity);
  console.log(data);
  //sort data by date objects
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  //domains
  x.domain(d3.extent(data, (d) => new Date(d.date)));
  y.domain([0, d3.max(data, (d) => d.distance)]);

  //update path data
  path
    .data([data])
    .attr('fill', 'none')
    .attr('stroke', '#00bfa5')
    .attr('stroke-width', 2)
    .attr('d', line);
  //create circles
  const circles = graph.selectAll('circle').data(data);

  //remove unwanted
  circles.exit().remove();

  //update current points
  circles
    .attr('cx', (d) => x(new Date(d.date)))
    .attr('cy', (d) => y(d.distance));

  //add points
  circles
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('cx', (d) => x(new Date(d.date)))
    .attr('cy', (d) => d.distance)
    .attr('fill', '#ccc');

  graph
    .selectAll('circle')
    .on('mouseover', (event, d) => {
      d3.select(event.currentTarget)
        .transition()
        .duration(100)
        .attr('r', 8)
        .attr('fill', '#fff');

      xDottedLine
        .attr('x1', x(new Date(d.date)))
        .attr('x2', x(new Date(d.date)))
        .attr('y1', graphHeight)
        .attr('y2', y(d.distance));

      yDottedLine
        .attr('x1', 0)
        .attr('x2', x(new Date(d.date)))
        .attr('y1', y(d.distance))
        .attr('y2', y(d.distance));

      dottedLine.style('opacity', 1);
    })
    .on('mouseleave', (event, d) => {
      d3.select(event.currentTarget)
        .transition()
        .duration(100)
        .attr('r', 4)
        .attr('fill', '#ccc');

      dottedLine.style('opacity', 0);
    });
  //axes
  const xAxis = d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat('%b %d'));
  const yAxis = d3
    .axisLeft(y)
    .ticks(4)
    .tickFormat((d) => d + ' miles');

  //call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  //rotate text
  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');
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
