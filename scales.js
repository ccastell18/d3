const svg = d3.select('svg');

d3.json('menu.json').then((data) => {
  //join data to rects
  const rects = svg.selectAll('rect').data(data);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.orders)])
    .range([0, 500]);

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

  rects
    .attr('width', x.bandwidth)
    .attr('height', (d) => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name));

  //append enter selection to DOM
  rects
    .enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', (d) => y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name));
});
