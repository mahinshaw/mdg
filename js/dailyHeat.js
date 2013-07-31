"use strict";
var heatMap = function(url, storeCount, selection) {
    
    var margin = {top: 40, right: 40, bottom: 100, left: 40 },
        svgW = 600,
        svgH = 700,
        width = svgW - margin.right - margin.left,
        height = svgH - margin.top - margin.bottom,
        colors = colorbrewer.Blues[8],
        stores = [],
        days = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        hours = [ "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p" ];
        
    
    
    /* Ajax call to get data andd draw grids */
    d3.json(url, function(json) {
        var dataset = [ json.sunday, json.monday, json.tuesday, json.wednesday, json.thursday, json.friday, json.saturday ];
        
        (function (s) {
            // s holds the number of stores
            var i;
            for (i = 1; i <= s; i++) {
                stores.push(i);
            }
        })(storeCount);
        
        var gridsizeW = Math.floor(width / stores.length);
        var gridsizeH = Math.floor(height / 24);
        // generate color scale for blocks 
        var colorscale = d3.scale.quantile()
            .domain([0, d3.max(dataset[0], function(d){return d.value;})])
            .range(colors);
        
        // buld svg for image
        var svg = d3.selectAll(selection)
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
                .data(data);
            
            // update old elements
            heatMap.attr("class", "update border")
                .transition()
                /*.delay(function(d, i) {
                    return i * 5;
                })*/
                .duration(750)
                .style("fill", colors[0]);
            
            heatMap.enter()
                .append("rect")
                .attr("class", "grid border")
                .attr("x", function (d) { return (d.store - 1) * gridsizeW; })
                .attr("y", function (d) { return (d.hour - 1) * gridsizeH; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", gridsizeW)
                .attr("height", gridsizeH)
                .style("fill", colors[0])
                .transition()
                /*.delay(function(d, i) {
                    return i * 5;
                })*/
                .duration(750)
                .style("fill", function(d) {
                    return colorscale(d.value);
                })
                .style("fill-opacity", 1);
            
            heatMap.exit()
                .attr("class", "exit")
                .transition()
                .duration(1500)
                //.attr("x", width)
                .remove();
        }
        
//        update(dataset[0]);
        
        var current = 0;
        setInterval(function() {
            update(dataset[current]);
            current++;
            current %= dataset.length;
        }, 3000);
        
        function nextSet() {
            
            return current++ % dataset.length;
        }
    });
};