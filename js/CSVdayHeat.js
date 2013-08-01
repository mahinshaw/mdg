"use strict";
function CSVdayHeat(dataUrl, parentNode){
    var margin = {top: 100, right: 40, bottom: 40, left: 40 },
        svgW = 600,
        svgH = 700,
        width = svgW - margin.right - margin.left,
        height = svgH - margin.top - margin.bottom,
        colors = ["#ffffdf","#fdae61","#d7191c","#a6d96a","#1a9641"],
        stores = [],
        dayNames = [ ["Sunday"], ["Monday"], ["Tuesday"], ["Wednesday"], ["Thursday"], ["Friday"], ["Saturday"] ],
        days = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        hours = [ "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p" ];
    
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
        var gridsizeH = Math.floor(height / 24);
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
        
        // labels for hours
        var hourLabels = svg.selectAll(".hourlabels")
            .data(hours)
            .enter()
            .append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return i * gridsizeH;
            })
            .style("text-achor", "middle")
            .attr("transform", "translate( -30, " + gridsizeH / 1.5 + ")")
            .attr("class", "hourlabels mono")
        
        
        
        function update (data) {
            
            // Draw the heatmap rectangles
            var heatMap = svg.selectAll("rect.grid")
                .data(data, function(d){return [d.hour, d.store, d.value];});
            
            heatMap.attr("class", "update border");
    
            heatMap.enter()
                .append("rect")
                .attr("class", "grid border")
                .attr("x", function (d) { return (d.store - 1) * gridsizeW; })
                .attr("y", function (d) { return (d.hour) * gridsizeH; })
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