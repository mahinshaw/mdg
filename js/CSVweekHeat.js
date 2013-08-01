"use strict";
function CSVweekHeat(dataUrl, parentNode){
    var margin = {top: 100, right: 40, bottom: 40, left: 140 },
        svgW = 700,
        svgH = 700,
        width = svgW - margin.right - margin.left,
        height = svgH - margin.top - margin.bottom,
        colors = ["#d7191c","#fdae61","#ffffdf","#a6d96a","#1a9641"],
        stores = [],
        dayNames = [ ["Sunday"], ["Monday"], ["Tuesday"], ["Wednesday"], ["Thursday"], ["Friday"], ["Saturday"] ],
        days = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        weekDays = [["30-May-13"],["01-Jul-13"],["02-Jul-13"],["03-Jul-13"],["04-Jul-13"],["05-Jul-13"],["06-Jul-13"],["07-Jul-13"],["Week 1"],["08-Jul-13"],["09-Jul-13"],["10-Jul-13"],["11-Jul-13"],["12-Jul-13"],["13-Jul-13"],["14-Jul-13"],["Week 2"],["15-Jul-13"],["16-Jul-13"],["17-Jul-13"],["18-Jul-13"],["19-Jul-13"],["20-Jul-13"],["21-Jul-13"],["Week 3"],["22-Jul-13"],["23-Jul-13"],["24-Jul-13"],["25-Jul-13"],["26-Jul-13"],["27-Jul-13"],["28-Jul-13"],["Week 4"],["29-Jul-13"],["30-Jul-13"],["31-Jul-13"]];
    
               /* Ajax call to get data and draw grids */
    d3.csv(dataUrl,
        function(error, csv) {
        console.log(csv);
        
        (function (s) {
            // s holds the number of stores
            var i;
            for (i = 1; i <= s; i++) {
                stores.push(i);
            }
        })(20);
        
        var gridsizeW = Math.floor(width / stores.length);
        var gridsizeH = Math.floor(height / 36);
        // generate color scale for blocks 
        var colorscale = d3.scale.quantile()
            .domain([0, 4])
            .range(colors);
        
        // build svg for image
        var svg = d3.select(parentNode)
            .append("svg")
            .attr("width", svgW)
            .attr("height", svgH)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        
        // labels for stores
        var storeLabels = svg.selectAll(".storelabels")
            .data(stores)
            .enter()
            .append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) {
                return i * gridsizeW;
            })    
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridsizeW/2 + ", -6)")
            .attr("class", "storelabels mono");
        
        // labels for weekday
        var weekLabels = svg.selectAll(".weeklabels")
            .data(weekDays)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridsizeH;
            })
            .style("text-achor", "middle")
            .attr("transform", "translate( -100, " + gridsizeH / 1.5 + ")")
            .attr("class", "hourlabels mono")
        
        
        
        function update (data) {
            
            // Draw the heatmap rectangles
            var heatMap = svg.selectAll("rect.grid")
                .data(data, function(d){return [d.label, d.store, d.value];});
            
            heatMap.attr("class", "update border");
    
            heatMap.enter()
                .append("rect")
                .attr("class", "grid border")
                .attr("x", function (d) { return (d.store - 1) * gridsizeW; })
                .attr("y", function (d, i) { return (i % 36) * gridsizeH; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", gridsizeW)
                .attr("height", gridsizeH)
                .style("fill", function(d) {
                    return colorscale(d.value);
                })
                ;
            
            heatMap.exit()
                .remove();
        }
        var current = 0;
        update(csv);

    });
}