document.addEventListener('DOMContentLoaded', function() {
    // Load and render the obesity chart
    d3.csv('data/obesitydata.csv').then(function(data) {
        renderLineChart(data, '#obesity-chart', 'Year', 'Obesity rate', 'steelblue');
    });

    // Load and render the life expectancy chart
    d3.csv('data/life-expectancy.csv').then(function(data) {
        renderLineChart(data, '#life-expectancy-chart', 'Year', 'Life expectancy', 'green');
    });

    // Load and render the emissions chart
    d3.csv('data/CO2emissions.csv').then(function(data) {
        renderLineChart(data, '#emissions-chart', 'Year', 'Annual CO₂ emissions', 'red');
    });

    // Function to render line chart
    function renderLineChart(data, selector, xKey, yKey, strokeColor) {
        data.forEach(d => {
            d[xKey] = +d[xKey];
            d[yKey] = +d[yKey];
        });

        const margin = { top: 20, right: 80, bottom: 50, left: 50 },
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        const svg = d3.select(selector)
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
                    .domain(d3.extent(data, d => d[xKey]))
                    .range([0, width]);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[yKey])])
                    .nice()
                    .range([height, 0]);

        const line = d3.line()
                       .x(d => x(d[xKey]))
                       .y(d => y(d[yKey]));

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        svg.append("g")
           .call(d3.axisLeft(y));

        svg.append("path")
           .datum(data)
           .attr("fill", "none")
           .attr("stroke", strokeColor)
           .attr("stroke-width", 1.5)
           .attr("d", line);

        svg.selectAll("dot")
           .data(data)
           .enter().append("circle")
           .attr("cx", d => x(d[xKey]))
           .attr("cy", d => y(d[yKey]))
           .attr("r", 5)
           .attr("fill", strokeColor)
           .on("mouseover", function(event, d) {
               d3.select(this).attr("r", 8).attr("fill", "orange");
               svg.append("text")
                  .attr("id", "tooltip")
                  .attr("x", x(d[xKey]) + 10)
                  .attr("y", y(d[yKey]))
                  .attr("dy", ".35em")
                  .attr("font-size", "12px")
                  .attr("font-weight", "bold")
                  .text(`${xKey}: ${d[xKey]}, ${yKey}: ${d[yKey]}`);
           })
           .on("mouseout", function(d) {
               d3.select(this).attr("r", 5).attr("fill", strokeColor);
               d3.select("#tooltip").remove();
           });
    }
});

