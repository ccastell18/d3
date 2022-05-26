//selects the div to attach to
const canvas = d3.select('.canvas');

//creates an svg canvas for items
// const svg = canvas.append('svg');

// //assigning attributes to the canvas
// svg.attr('height', 600);
// svg.attr('width', 600);

// appending shapes to the canvas
// svg.append('rect');
// svg.append('circle');
// svg.append('line');

//chaining attributes
const svg = canvas.append('svg').attr('height', 600).attr('width', 600);

//group
const group = svg.append('g').attr('transform', 'translate(0, 100)');

group
  .append('rect')
  .attr('width', 200)
  .attr('height', 100)
  .attr('fill', 'blue')
  .attr('x', 20)
  .attr('y', 20);

group
  .append('circle')
  .attr('r', 50)
  .attr('cx', 300)
  .attr('cy', 70)
  .attr('fill', 'pink');

group
  .append('line')
  .attr('x1', 370)
  .attr('x2', 400)
  .attr('y1', 20)
  .attr('y2', 120)
  .attr('stroke', 'red');

//Text
svg
  .append('text')
  .attr('x', 20)
  .attr('y', 200)
  .attr('fill', 'grey')
  .text('Hello World')
  .style('font-family', 'arial');
