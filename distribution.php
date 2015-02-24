<?php include("header.php"); ?>

<style type="text/css" media="screen">


.area {
	/* shape-rendering: geometricPrecision; */
	fill: url(#grad1);
}

.box {
  font: 10px sans-serif;
}

.box line,
.box rect,
.box circle {
  fill: #fff;
  stroke: #000;
  stroke-width: 1px;
}

.box .center {
  stroke-dasharray: 3,3;
}

.box .outlier {
  fill: none;
  stroke: #aaa;
}

.box .median {
	stroke-width: 2px;
}


.axis path, .axis line {
  fill: none;
  stroke: #999;
  stroke-width: 1px;
  color-rendering: optimizeQuality !important;
  shape-rendering: crispEdges !important;
  text-rendering: geometricPrecision !important; 

}
svg {
	background: #eee;
}

rect.background {
	fill: #ddd;
}

defs lineargradient {
	
}

</style>


<div class="row">
	
	<div class="col-xs-12">
		<div id="distribution"></div>
		<input type="button" value="Update" id="update">
		
	</div>
	
</div>

<script src="js/d3.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/jquery-2.0.3.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/box.js"></script>

<script type="text/javascript">
	
$(document).ready(function() {
	$("#update").click(function() {
		update();
	});
});
// Generate a Bates distribution of 10 random variables.



var dataRange,
	margin = 30,
    width = 100,
    height = 200,
	x, y,			// scales
	values,
	data;




var init = function(r) {
	dataRange = [0, r];
	
	x = d3.scale.linear()
		.domain(dataRange)
		.range([height,0]);	// 0 at bottom
	
	values = d3.range(100).map(d3.random.irwinHall(dataRange[1])).sort();
		// Generate a histogram using (max) uniformly-spaced bins.
	
	data = d3.layout.histogram().bins(x.ticks(50))(values);
	
	y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
		.range([0, width]);
}
init(2);


var update = function() {
	var d = 1000;	// duration
	
	init(2+Math.floor(Math.random()*10));	// reinitialize

	boxplot.datum(values)
		.call(chart.domain(dataRange).duration(d));		// don't forget to update chart domain
		
	updateGradient("grad1", [x(d3.max(values))/height, x(d3.min(values))/height], d);
	
	// update axis
	xA.transition().duration(d)
		.call(d3.svg.axis().scale(x).orient("left"));  
	
	// update area with new scales
	area = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.x+d.dx/2); })
		.y0(0)
		.y1(function(d) { return y(d.y); });
				
	// update kdf with new data
	kdf.selectAll(".area path")
			.datum(data)
		.transition()
			.attr("d", area)
			.duration(d);
}




var svg = d3.select("#distribution").append("svg")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2);

// definition for gradient
var defs = svg.append("defs");

// standard def

var updateGradient = function(id, range, duration, endColor) {
	
	if (endColor===undefined) endColor = "red";
	if (duration===undefined) duration = 0;
	
	var d = [
		{offset: (range[0]*100)+"%", color: "white"},
		{offset: (range[1]*100)+"%", color: endColor}
	];
	
	// generates or updates Gradient
	var gradient = defs.select("#"+id);
	if (gradient.empty()) {
		gradient = defs.append("linearGradient")
			.attr("id", id)
			.attr("x1", 1).attr("y1", 0)
			.attr("x2", 0).attr("y2", 0);
	}
	
	var up = function(s) {	// helper
		s.transition()
			.duration(0 || duration)
			.attr("offset", function(d) { return d.offset; })			// enter
			.attr("stop-color", function(d) { return d.color; })
	}
	
	gradient.selectAll("stop")			// reselect
		.data(d)
		.call(up)				// update
	.enter()
		.append("stop")
		.call(up);					// enter
}

//updateGradient("grad", [0,1]);
updateGradient("grad1", [x(d3.max(values))/height, x(d3.min(values))/height]);



// violin group
var violin = svg.append("g")
	.attr("class", "violin")
	.attr("transform", "translate("+margin+","+margin+")");
	
// background rect
violin.append("rect")
	.attr("class", "background")
	.attr("width", width)
	.attr("height", height)

// area generator
var area = d3.svg.area()
	.interpolate("basis")
	.x(function(d) { return x(d.x+d.dx/2); })
	.y0(0)
	.y1(function(d) { return y(d.y); })

// kdf grounp
var kdf = violin.append("g")
		.attr("class", "kdf")
		.attr("transform", "translate("+width/2+",0)")
		
// append group & path
kdf.append("g")
		.attr("class", "area")
	.attr("transform", "scale(-0.5,1) rotate(90)")
	.append("path")
		.datum(data)
		.attr("d", area)
	
kdf.append("g")
	.attr("class", "area mirrored")
	.attr("transform", "scale(0.5,1) rotate(90)")
	.append("path")
		.datum(data)
		.attr("d", area);

// boxplot
var chart = d3.box()
	.whiskers(iqr(1.5))
	.width(width/10)
	.height(height)
	.domain(dataRange)
	.tickFormat(d3.format("d"));	// hack, not showing labels "d" shows only whole numbers
	
// Helper function for boxplot
// Returns a function to compute the interquartile range.
// move to box.js?
function iqr(k) {
	return function(d, i) {
		var q1 = d.quartiles[0],
			q3 = d.quartiles[2],
			iqr = (q3 - q1) * k,
			i = -1,
			j = d.length;
		while (d[++i] < q1 - iqr);
		while (d[--j] > q3 + iqr);
		return [i, j];
	};
}


var boxgroup = violin.append("g").attr("class", "boxgroup");
var boxplot = boxgroup.append("g")
	.data([values])
	.attr("class", "box")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", "translate("+(9*width/10/2)+",0)")
	.call(chart);

	  


/*
var yLeft = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
    .range([0, width/2]);


var yLeftAxis = d3.svg.axis()
	.scale(yLeft)
	.orient("bottom");
	
/*
// Y Axis
violin.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate("+width/2+"," + (height+5) + ")")
	.call(yLeftAxis);
	
	
var yRight = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
    .range([0, width/2].reverse());


var yRightAxis = d3.svg.axis()
	.scale(yRight)
	.orient("bottom");
	
	
violin.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (height+5) + ")")
	.call(yRightAxis);

*/
// X Axis
	// add enter()...
	

var xA = violin.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(-5,0)")
	.call(d3.svg.axis().scale(x).orient("left"));


</script>


<?php // include("footer.php"); ?>
