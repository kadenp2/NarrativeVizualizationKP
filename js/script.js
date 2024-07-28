// Load the data and create the chart
d3.csv('obesitydata.csv').then(function(data) {
    // Convert string data to numbers
    data.forEach(d => {
        d.Year = +d.Year;
        d['Obesity rate'] = +d['Obesity rate'];
    });

    // Set up the SVG canvas dimensions
    const margin = { top: 20, right: 80, bottom: 50, left: 50 },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the scales
    const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.Year))
                .range([0, width]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d['Obesity rate'])])
                .nice()
                .range([height, 0]);

    // Set up the line generator
    const line = d3.line()
                   .x(d => x(d.Year))
                   .y(d => y(d['Obesity rate']));

    // Add the x-axis
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add the y-axis
    svg.append("g")
       .call(d3.axisLeft(y));

    // Add the line path
    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 1.5)
       .attr("d", line);

    // Add the points
    svg.selectAll("dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.Year))
       .attr("cy", d => y(d['Obesity rate']))
       .attr("r", 5)
       .attr("fill", "red")
       .on("mouseover", function(event, d) {
           d3.select(this).attr("r", 8).attr("fill", "orange");
           svg.append("text")
              .attr("id", "tooltip")
              .attr("x", x(d.Year) + 10)
              .attr("y", y(d['Obesity rate']))
              .attr("dy", ".35em")
              .attr("font-size", "12px")
              .attr("font-weight", "bold")
              .text(`Year: ${d.Year}, Rate: ${d['Obesity rate']}%`);
       })
       .on("mouseout", function(d) {
           d3.select(this).attr("r", 5).attr("fill", "red");
           d3.select("#tooltip").remove();
       });
}).catch(function(error) {
    console.error('Error loading data: ', error);
});

