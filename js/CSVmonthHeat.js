"use strict";
function CSVmonthHeat(dataUrl, parentNode){
    var margin = {top: 100, right: 40, bottom: 40, left: 140 },
        svgW = 700,
        svgH = 700,
        width = svgW - margin.right - margin.left,
        height = svgH - margin.top - margin.bottom,
        colors = ["#d7191c","#fdae61","#ffffdf","#a6d96a","#1a9641"],
        stores = [],
        dayNames = [ ["Sunday"], ["Monday"], ["Tuesday"], ["Wednesday"], ["Thursday"], ["Friday"], ["Saturday"] ],
        days = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        monthLabel = [["Week 1"],["Week 2"],["Week 3"],["Week 4"],["Week 5"],["Week 6"],["Week 7"],["Week 8"],["Week 9"],["Week 10"],["Week 11"],["Week 12"],["Week 13"],["Week 14"],["Week 15"],["Week 16"],["Week 17"],["Week 18"],["Week 19"],["Week 20"],["Week 21"],["Week 22"],["Week 23"],["Week 24"],["Week 25"],["Week 26"],["Week 27"],["Week 28"],["Week 29"],["Week 30"],["Week 31"]];
    
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
        var gridsizeH = Math.floor(height / 31);
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
        
        // labels for weeks
        var weekLabels = svg.selectAll(".weeklabels")
            .data(monthLabel)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridsizeH;
            })
            .style("text-achor", "middle")
            .attr("transform", "translate( -60, " + gridsizeH / 1.5 + ")")
            .attr("class", "weeklabels mono")
        
        
        
        function update (data) {
            
            // Draw the heatmap rectangles
            var heatMap = svg.selectAll("rect.grid")
                .data(data, function(d){return [d.week, d.store, d.value];});
            
            heatMap.attr("class", "update border");
    
            heatMap.enter()
                .append("rect")
                .attr("class", "grid border")
                .attr("x", function (d) { return (d.store - 1) * gridsizeW; })
                .attr("y", function (d, i) { return (i % 31) * gridsizeH; })
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