<?php include("header.php"); ?>

<style type="text/css" media="screen">

.area, .color {
  shape-rendering: geometricPrecision;
/*  fill: #f00 !important; */
  fill: url(#grad);
}
.boxplot{
  shape-rendering: crispEdges;
  fill: none;
  stroke: black;
  stroke-width: 1px;
}
.boxplot.fill{
  fill: black;
}
.boxplot.mean, .boxplot.median{
  fill: white;
  stroke: white;
}
.boxplot.mean{
  shape-rendering: geometricPrecision;
}
.violin{
  shape-rendering: geometricPrecision;
  fill: none !important;
  stroke: #777;
  stroke-width: 1px;
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


var values = d3.range(100).map(d3.random.irwinHall(max));
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

var generateDefinition = function(id, start, stop) {
	
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

generateDefinition("grad", 0.2,0.8);

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




var interpolation = "basis";

var g = svg.append("g")
	.attr("class", "area")


/*
var areaBackground = d3.svg.area()
	//.interpolate("basis")
	.x(function(d) { return x(d.x+d.dx/2); })
	.y0(height)
	.y1(function(d) { return y(d.y);})


	
g.append("path")
	.datum(generateData( d3.range(100).map(d3.random.irwinHall(max) )))
	.attr("d", areaBackground)
	.attr("fill", "#ccc");
*/
"basis"
"linear"
"step"
"step-before"
"step-after"
"monotone"
var area = d3.svg.area()
	.interpolate("basis")
//	.x(function(d) { return x(d.x+d.dx/2); })
	.x(function(d) { return x(d.x+d.dx/2); })

	.y0(height)
	.y1(function(d) { return y(d.y); })
	.tension(1)
	
g.append("path")
	.datum(data)
	.attr("d", area);

	
	
var c = svg.append("g")
    .attr("class", "color")
	.attr("transform", "translate(0," + (height+2) + ")")

c.append("rect")
	.attr("x", x(d3.min(values)))
	.attr("width", x(d3.max(values)) - x(d3.min(values)))
	.attr("height", 16);
	
// axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height+20) + ")")
    .call(xAxis);


</script>


<?php include("footer.php"); ?>
