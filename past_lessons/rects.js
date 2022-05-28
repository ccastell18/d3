const data = [
  { width: 200, height: 100, fill: 'purple' },
  { width: 100, height: 60, fill: 'pink' },
  { width: 50, height: 30, fill: 'red' },
];

//joins data to rects
const svg = d3.select('svg');

//adds attributes to rects already in DOM
const rects = svg
  .selectAll('rect')
  .data(data)
  .attr('width', (d) => d.width)
  .attr('height', (d) => d.height)
  .attr('fill', (d) => d.fill);

//append the enter selection to DOM
rects
  .enter()
  .append('rect')
  .attr('width', (d) => d.width)
  .attr('height', (d) => d.height)
  .attr('fill', (d) => d.fill);
