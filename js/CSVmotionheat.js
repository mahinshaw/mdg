"use strict";
function CSVmotionHeat(parentNode){
    var margin = {top: 100, right: 40, bottom: 40, left: 40 },
        svgW = 600,
        svgH = 700,
        width = svgW - margin.right - margin.left,
        height = svgH - margin.top - margin.bottom,
        colors = ["#ffffdf","#fdae61","#d7191c","#a6d96a","#1a9641"],
        stores = [],
        dayNames = [ ["Thursday 04-Jul-13"], ["Friday 05-Jul-13"], ["Saturday 06-Jul-13"], ["Sunday 30-Jun-13"], ["Monday 01-Jul-13"], ["Tuesday 02-Jul-13"], ["Wednesday 03-Jul-13"] ],
        days = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        hours = [ "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p" ],
        dataset = [],
        intervalArray = [500, 1000, 1500, 2000, 3000, 4000],
        interval = intervalArray[2];
    
    var slower = d3.select("button.slower");
    var faster = d3.select("button.faster");
    
    function intervalSlower(currInt) {
        var intIndex = intervalArray.indexOf(currInt);
        if (intIndex < intervalArray.length - 1){
            intIndex++;
            enableDisableButton(intIndex);
        }
        return intervalArray[intIndex];
    }
    
    function intervalFaster(currInt) {
        var intIndex = intervalArray.indexOf(currInt);
        if (intIndex > 0){
            intIndex--;
            enableDisableButton(intIndex);
        }
        return intervalArray[intIndex];
    }
    
    function enableDisableButton(index){
        if (index <= 0){
            faster.attr("disabled", "disabled");
            slower.attr("disabled", null);
        }
        else if (index >= intervalArray.length -1) {
            slower.attr("disabled", "disabled");
            faster.attr("disabled", null);
        }
        else {
            slower.attr("disabled", null);
            faster.attr("disabled", null);
        }
    }
    
    /* Ajax call to get data and draw grids */
    queue()
        .defer(d3.csv, "data/csv/Thursday.csv")
        .defer(d3.csv, "data/csv/Friday.csv")
        .defer(d3.csv, "data/csv/Saturday.csv")
        .defer(d3.csv, "data/csv/Sunday.csv")
        .defer(d3.csv, "data/csv/Monday.csv")
        .defer(d3.csv, "data/csv/Tuesday.csv")
        .defer(d3.csv, "data/csv/Wednesday.csv")
        .await(motion);
    
    function motion(error, thursday, friday, saturday, sunday, monday, tuesday, wednesday) {
        console.log(thursday);
        console.log(friday);
        console.log(saturday);
        console.log(sunday);
        console.log(monday);
        console.log(tuesday);
        console.log(wednesday);
        
        // load days into dataset
        dataset.push(thursday);
        dataset.push(friday);
        dataset.push(saturday);
        dataset.push(sunday);
        dataset.push(monday);
        dataset.push(tuesday);
        dataset.push(wednesday);
        
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
        
        // set on click for slower
        slower.on("click", function() {
                interval = intervalSlower(interval);
            });
        
        // set on click for slower
        faster.on("click", function() {
                interval = intervalFaster(interval);
            });
        
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
            .attr("class", "storelabels");
        
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
            .attr("class", "hourlabels")
        
        
        
        function update (data, days) {
            // Draw title text
            var title = svg.selectAll("text.title")
                .data(days, function(d){return d;});
            
            // Draw the heatmap rectangles
            var heatMap = svg.selectAll("rect.grid")
                .data(data, function(d){return [d.day, d.hours, d.store, d.value];});
            
            // update old elements
            title.attr("class", "update");
            
            title.enter()
                .append("text")
                .attr("class", "title")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .style("text-anchor", "middle")
                .text(function(d) { return d; } )
                ;
            
            title.exit()
                .remove();
            
            heatMap.attr("class", "update border");
    
            heatMap.enter()
                .append("rect")
                .attr("class", "grid border")
                .attr("x", function (d) { return (d.store - 1) * gridsizeW; })
                .attr("y", function (d) { return (d.hours) * gridsizeH; })
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
        update(dataset[current], dayNames[current]);
        
        (function animateLoop(){
            setTimeout(function(){
                var next = nextIndex();
                update(dataset[next], dayNames[next]);
                animateLoop();
                console.log(interval);
            }, interval);
        })();
        
        function nextIndex() {
            current++;
            current %= dataset.length;
            return current;
        }
            
    };
}