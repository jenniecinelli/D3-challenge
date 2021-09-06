var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(stateData) {
  console.log(stateData);

  stateData.forEach(function(data){
    data.poverty = +data.poverty;
    data.age = +data.age;
  })

  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(stateData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([28, d3.max(stateData, d => d.age)])
    .range([height, 0]);
  
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.age))
  .attr("r", "15")
  .attr("fill", "darkgreen");


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return(`${d.state}<br>In Poverty: ${d.poverty}%<br>Median Age: ${d.age}`)
    });
  
    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data){
      toolTip.show(data, this);
    })

    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    
    chartGroup.selectAll(".label")
    .data(stateData)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.age))
    .text(d => (d.abbr))
    .attr("font-size", "10px")
    .attr("fill", "white");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Age (Median)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
});
