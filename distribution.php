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
var values = d3.range(100).map(d3.random.irwinHall(max));


// A formatter for counts.
var formatCount = d3.format(",.0f");

var margin = {top: 30, right: 30, bottom: 60, left: 30},
    width = 200,
    height = 100;

var x = d3.scale.linear()
	.domain([0, max])
	.range([0, width]);

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);


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
	
defs.append("linearGradient")
     .attr("id", "grad")
 //    .attr("gradientUnits", "userSpaceOnUse")
     .attr("x1", 0).attr("y1", 0)
     .attr("x2", 1).attr("y2", 0)
   .selectAll("stop")
     .data([
		 {offset: "20%", color: "white"},
		{offset: "80%", color: "red"}
     ])
   .enter().append("stop")
     .attr("offset", function(d) { return d.offset; })
     .attr("stop-color", function(d) { return d.color; });
	 
svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




var interpolation = "basis";

var area = d3.svg.area()
	.interpolate("basis")
	.x(function(d) { return x(d.x+d.dx/2); })
	.y0(height)
	.y1(function(d) { return y(d.y); });
	
var g = svg.append("g")
	.attr("class", "area")

g.append("path")
	.datum(data)
	.attr("d", area);
	
var c = svg.append("g")
    .attr("class", "color")
	.attr("transform", "translate(0," + (height+2) + ")")

c.append("rect")
	.attr("width", width)
	.attr("height", 16);
	
// axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height+20) + ")")
    .call(xAxis);


</script>


<?php include("footer.php"); ?>
