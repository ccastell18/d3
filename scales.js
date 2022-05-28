const svg = d3.select('svg');

d3.json('menu.json').then((data) => {
  //join data to rects
  const rects = svg.selectAll('rect').data(data);
  const y = d3.scaleLinear().domain([0, 1000]).range([0, 500]);

  rects
    .attr('width', 50)
    .attr('height', (d) => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70);

  //append enter selection to DOM
  rects
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', (d) => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d, i) => i * 70);
});