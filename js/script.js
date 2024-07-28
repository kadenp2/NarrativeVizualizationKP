document.addEventListener('DOMContentLoaded', function() {
    // Load and render the CO₂ emissions chart
    d3.csv('data/CO2emissions.csv').then(function(data) {
        console.log('CO2 Emissions Data:', data); // Debugging
        renderScatterPlot(data, '#emissions-chart', 'Year', 'Annual CO₂ emissions', 'Population', 'red');
    }).catch(function(error) {
        console.error('Error loading CO2 emissions data:', error);
    });

    // Function to render scatter plot
    function renderScatterPlot(data, selector, xKey, yKey, sizeKey, color) {
        data.forEach(d => {
            d[xKey] = +d[xKey];
            d[yKey] = +d[yKey];
            d[sizeKey] = +d[sizeKey];
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

        const x = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[xKey]))
                    .range([0, width]);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[yKey])])
                    .nice()
                    .range([height, 0]);

        const size = d3.scaleSqrt()
                       .domain([0, d3.max(data, d => d[sizeKey])])
                       .range([1, 40]);

        svg.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x).ticks(10, d3.format(",.0f")));

        svg.append("g")
           .call(d3.axisLeft(y));

        svg.append("text")
           .attr("x", width / 2)
           .attr("y", height + margin.bottom)
           .attr("text-anchor", "middle")
           .attr("font-size", "16px")
           .text(xKey);

        svg.append("text")
           .attr("x", -height / 2)
           .attr("y", -margin.left)
           .attr("text-anchor", "middle")
           .attr("font-size", "16px")
           .attr("transform", "rotate(-90)")
           .text(yKey);

        const tooltip = d3.select("body")
                          .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);

        const mouseover = function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(`${xKey}: ${d[xKey]}<br>${yKey}: ${d[yKey]}<br>${sizeKey}: ${d[sizeKey]}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
        };

        const mouseout = function() {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
        };

        svg.selectAll("dot")
           .data(data)
           .enter().append("circle")
           .attr("cx", d => x(d[xKey]))
           .attr("cy", d => y(d[yKey]))
           .attr("r", d => size(d[sizeKey]))
           .attr("fill", color)
           .style("opacity", 0.7)
           .on("mouseover", mouseover)
           .on("mouseout", mouseout);
    }
});
