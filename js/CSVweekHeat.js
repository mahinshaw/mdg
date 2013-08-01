"use strict";
function CSVweekHeat(dataUrl, parentNode){
    var margin = {top: 100, right: 40, bottom: 40, left: 140 },
        svgW = 700,
        svgH = 700,
        width = svgW - margin.right - margin.left,
        height = svgH - margin.top - margin.bottom,
        colors = ["#ffffdf","#fdae61","#d7191c","#a6d96a","#1a9641"],
        stores = [],
        dayNames = [ ["Sunday"], ["Monday"], ["Tuesday"], ["Wednesday"], ["Thursday"], ["Friday"], ["Saturday"] ],
        days = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        weekDays = [["June 30, 2013"],["July 01, 2013"],["July 02, 2013"],["July 03, 2013"],["July 04, 2013"],["July 05, 2013"],["July 06, 2013"],["July 07, 2013"],["Week 1"],["July 08, 2013"],["Jul 09, 2013"],["July 10, 2013"],["July, 11, 2013"],["July 12, 2013"],["July 13, 2013"],["July 14, 2013"],["Week 2"],["July 15, 2013"],["July 16, 2013"],["July 17, 2013"],["July, 18, 2013"],["July, 19, 2013"],["July 20, 2013"],["July 21, 2013"],["Week 3"],["July 22, 2013"],["July 23, 2013"],["July 24, 2013"],["July 25, 2013"],["July 26, 2013"],["July 27, 2013"],["July 28, 2013"],["Week 4"],["July 29, 2013"],["July 30, 2013"],["July 31, 2013"]];
    
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