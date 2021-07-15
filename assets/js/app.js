// Read in csv file
d3.csv("assets/data/data.csv").then(function(data) {
    
    // Console log csv file 
    console.log(data);

    // Create empty arrays to hold data from csv
    poverty_pct = [];
    healthcare_pct = [];
    dataset = [];

    // Loop through csv and append data to empty arrays
    for (var i=0; i<data.length; i++) {
        poverty_pct.push(parseFloat(data[i].poverty));
        healthcare_pct.push(parseFloat(data[i].healthcare));
        dataset.push([parseFloat(data[i].poverty), parseFloat(data[i].healthcare), data[i].abbr]);
    };
    
    // Function that resizes chart
    function makeResponsive() {

        // If SVG area isn't empty when browser loads, remove it and replace it with resized chart
        var svgArea = d3.select("body").select("svg");
        if (!svgArea.empty()) {
            svgArea.remove();
        }

        // Determine the current width and height of browser window
        var svgHeight = window.innerHeight;
        var svgWidth = window.innerWidth;
        var margin = {
            top: 50,
            right: 300,
            bottom: 50,
            left: 50
        };
        var chartHeight = svgHeight - margin.top - margin.bottom;
        var chartWidth = svgWidth - margin.left - margin.right;

        // Append svg
        var svg = d3.select("#scatter").append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

        // Append group
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // Scale y
        var yScale = d3.scaleLinear()
            .domain([2, d3.max(healthcare_pct)])
            .range([chartHeight, 0]);
    
        // Scale x
        var xScale = d3.scaleLinear()
            .domain([8, d3.max(poverty_pct)])
            .range([0, chartWidth]);
        
        // Create axes
        var yAxis = d3.axisLeft(yScale);
        var xAxis = d3.axisBottom(xScale);

        // Set x to the bottom of the chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        // Set y to the y axis
        chartGroup.append("g")
            .call(yAxis);

        // Append circles to datapoints and scale them to chart
        chartGroup.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return xScale(d[0]);
            })
            .attr("cy", function(d) {
                return yScale(d[1]);
            })
            .attr("r", 10)
            .attr("fill", "gray");

        // Add labels to circles
        chartGroup.selectAll(".label")
            .data(dataset)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(function(d) {
                return d[2];
            })
            .attr("x", function(d) {
                return xScale(d[0]);
            })
            .attr("y", function(d) {
                return yScale(d[1]);
            })
            .attr("font-size", "12px")
            .attr("fill", "white");

        // Create y axis label
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (yScale(10)))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("fill", "black");

        // Create x axis label
        chartGroup.append("text")
            .attr("transform", `translate(${xScale(12)}, ${chartHeight + 40})`)
            .attr("class", "axisText")
            .text("In Poverty (%)")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .attr("fill", "black");
    }

    // Call function
    makeResponsive();

    // Call function whenever window is resized
    d3.select(window).on("resize", makeResponsive);
});