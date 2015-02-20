<?php include("header.php"); ?>

<style type="text/css" media="screen">


.area {
	shape-rendering: geometricPrecision;
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

</style>


<div class="row">
	
	<div class="col-xs-12">
		<div id="distribution"></div>
	
		
	</div>
	
</div>

<script src="js/d3.min.js" type="text/javascript" charset="utf-8"></script>
<script src="js/box.js"></script>

<script type="text/javascript">
	
// Generate a Bates distribution of 10 random variables.

var dataRange = [0, 2];

// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = 30,
    width = 200,
    height = 400;


var x = d3.scale.linear()
	.domain(dataRange)
	.range([height,0]);	// 0 at bottom


var values = d3.range(100).map(d3.random.irwinHall(dataRange[1])).sort();
// Generate a histogram using (max) uniformly-spaced bins.

var generateData = function(v) {
	return d3.layout.histogram()
    	.bins(x.ticks(50))
    	(v);
}
var data = generateData(values);




var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
    .range([0, width]);



var svg = d3.select("#distribution").append("svg")
    .attr("width", width + margin*2)
    .attr("height", height + margin*2);

// definition for gradient
var defs = svg.append("defs");

// standard def

var updateGradient = function(id, start, stop) {
	
	// generates or updates Gradient
	var gradient = defs.selectAll("#"+id);
	if (gradient.empty()) {
		gradient = defs.append("linearGradient")
			.attr("id", id)
			.attr("x1", 1).attr("y1", 0)
			.attr("x2", 0).attr("y2", 0);
	}
			
	gradient.selectAll("stop")												// reselect
			.data(	[	{offset: (start*100)+"%", color: "white"}, 
						{offset: (stop*100)+"%", color: "red"}		])
			.attr("offset", function(d) { return d.offset; })				// update
			.attr("stop-color", function(d) { return d.color; })
			.enter().append("stop")
				.attr("offset", function(d) { return d.offset; })			// enter
				.attr("stop-color", function(d) { return d.color; });
	
	
}

updateGradient("grad", 0,1);
updateGradient("grad1", x(d3.max(values))/height, x(d3.min(values))/height);


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
	.y1(function(d) { 
		console.log(d.y);
		return y(d.y); })

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
//	.attr("transform", "translate(200,400) scale(-0.25,2) rotate(-90,0,0) ")
	.attr("transform", "scale(0.5,1) rotate(90)")
	.append("path")
		.datum(data)
		.attr("d", area);




var chart = d3.box()
	.whiskers(iqr(1.5))
	.width(200)
	.height(400)
//	.domain([d3.min(values), d3.max(values)]);
	.domain(dataRange);
	
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


violin.append("g")
	.data([values])
	.attr("class", "box")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", function(d,i) {
		return "translate(0,0)";
	})
	.call(chart);

	  

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("left");



var y2 = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
    .range([0, width/2]);


var y2Axis = d3.svg.axis()
	.scale(y2)
	.orient("bottom");
	

// X Axis
violin.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate("+width/2+"," + (height+5) + ")")
	.call(y2Axis);
	
	
var y3 = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
    .range([0, width/2].reverse());


var y3Axis = d3.svg.axis()
	.scale(y3)
	.orient("bottom");
	
	
violin.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (height+5) + ")")
	.call(y3Axis);


// Y Axis
violin.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(-5,0)")
	.call(xAxis);


</script>


<?php // include("footer.php"); ?>
