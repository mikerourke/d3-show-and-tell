const stocksChart = `var margin = { top: 10, right: 20, bottom: 30, left: 30 };
var width = 800 - margin.left - margin.right;
var height = 770 - margin.top - margin.bottom;

var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', \`translate(\${margin.left}, \${margin.top})\`);

var data = stocksData.map(company => ({
  ...company,
  values: company.values.map(d => ({
    date: d3.timeParse('%Y/%m/%d')(d.date),
    close: +d.close
  }))
}));

var xScale = d3.scaleTime()
  .domain([
    d3.min(data, co => d3.min(co.values, d => d.date)),
    d3.max(data, co => d3.max(co.values, d => d.date)),
  ])
  .range([margin.left, width - margin.right])

var xAxis = g => g
  .attr("transform", \`translate(0, \${height - margin.bottom})\`)
  .call(d3.axisBottom(xScale).ticks(width / 80));

svg
  .append("g")
  .call(xAxis);

var yScale = d3.scaleLinear()
  .domain([
    d3.min(data, co => d3.min(co.values, d => d.close)),
    d3.max(data, co => d3.max(co.values, d => d.close)),
  ])
  .range([height - margin.bottom, margin.top])

var yAxis = g => g
  .attr("transform", \`translate(\${margin.left},0)\`)
  .call(d3.axisLeft(yScale));

svg
  .append("g")
  .call(yAxis);

var line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.close))
  .curve(d3.curveCatmullRom.alpha(0.5))

svg
  .selectAll('.line')
  .data(data)
  .enter()
  .append('path')
  .attr('class', 'line')
  .attr('d', d => line(d.values))
  .attr('stroke', (d, i) => ['#FF9900', '#3369e8'][i])
  .attr('stroke-width', 2)
  .attr('fill', 'none');
`;

export default {
  stocksChart,
};
