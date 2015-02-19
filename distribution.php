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
var max = 10;


// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 60, right: 30, bottom: 60, left: 30},
    width = 500,
    height = 300;

var x = d3.scale.linear()
	.domain([0, max])
	.range([0, width]);


var values = d3.range(100).map(d3.random.irwinHall(max)).sort();
// Generate a histogram using twenty uniformly-spaced bins.

console.log(d3.min(values), d3.max(values));
var generateData = function(v) {
	return d3.layout.histogram()
    	.bins(x.ticks(50))
    	(v);
}

var data = generateData(values);

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var svg = d3.select("#distribution").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// definition for gradient
var defs = svg.append("defs");

// standard def

var updateGradient = function(id, start, stop) {
	
	// generates or updates Gradient
	var gradient = defs.selectAll("#"+id);
	if (gradient.empty()) {
		gradient = defs.append("linearGradient")
			.attr("id", id)
			.attr("x1", 0).attr("y1", 0)
			.attr("x2", 1).attr("y2", 0);
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
updateGradient("grad1", x(d3.min(values))/width,x(d3.max(values))/width);


// violin container
var violin = svg.append("g")
	.attr("class", "violin")
.attr("transform", "translate(0,0) scale(1, 1)");

var area = d3.svg.area()
	.interpolate("basis")
	.x(function(d) { return x(d.x+d.dx/2); })
	.y0(height)
	.y1(function(d) { return y(d.y); })
	.tension(1)

// append group & path
violin.append("g")
		.attr("class", "area")
	.attr("transform", "rotate(-90,"+width/2+","+height/2+") translate(0,-300)")
	.append("path")
		.datum(data)
		.attr("d", area)
	

violin.append("g")
		.attr("class", "area mirrored")
	.attr("transform", "rotate(-90,"+width/2+","+height/2+") scale(1,-1) translate(0,-300)")
	.append("path")
		.datum(data)
		.attr("d", area);

var chart = d3.box()
	.whiskers(iqr(1.5))
	.width(20)
	.height(height)
	.domain([d3.min(values), d3.max(values)]);
	
// Returns a function to compute the interquartile range.
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


violin.selectAll("g")
	.data([values, values])
	.enter().append("g")
		.attr("class", "box")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.bottom + margin.top)
		.attr("transform", function(d,i) {
			return "translate(" + (100+120*i + margin.left) + "," + margin.top + ")";
		})
		.call(chart);
      
	  

// axis
violin.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height+20) + ")")
    .call(xAxis);


</script>


<?php // include("footer.php"); ?>
