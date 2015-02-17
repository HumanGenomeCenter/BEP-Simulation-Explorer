<?php include("header.php"); ?>

<style type="text/css" media="screen">

.area{
  shape-rendering: geometricPrecision;
  fill: #ccc !important;
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
  stroke: #000;
  stroke-width: 1px;
  color-rendering: optimizeQuality !important;
  shape-rendering: crispEdges !important;
  text-rendering: geometricPrecision !important; 

}
</style>


<div class="row">
	
	<div class="col-xs-12">
		<div id="svgElement1"></div>
		<div id="svgElement2"></div>
		
	</div>
	
</div>

<script src="js/d3.min.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">

// random distribution

var results = [];

for (var i = 0; i < 2; i++) {
	var data = [];
	for (var i = 0; i < 1000; i++) {
		data.push((Math.random()*10)-5);
	}
	results.push(data);
}

function addViolin(svg, results, height, width, domain, imposeMax, violinColor){


	var data = d3.layout.histogram()
		.bins(50)
		.frequency(0);
        (results);

        var y = d3.scale.linear()
                    .range([width/2, 0])
                    .domain([0, Math.max(imposeMax, d3.max(data, function(d) { return d.y; }))]);

        var x = d3.scale.linear()
                    .range([height, 0])
                    .domain(domain)
                   // .nice();


        var area = d3.svg.area()
            .interpolate(interpolation)
            .x(function(d) {return x(d.x);})
            .y0(width-20)
            .y1(function(d) { return y(d.y*2); });

    
        var gMinus=svg.append("g")

        gMinus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .style("fill", violinColor);



}

var margin={top:10, bottom:30, left:30, right:10};

var width=600;
var height=200;
var boxWidth=100;
var boxSpacing=10;
var domain=[-10,10];

var resolution=20;
var d3ObjId="svgElement1";
var interpolation='step-before';

var y = d3.scale.linear()
            .range([height-margin.bottom, margin.top])
            .domain(domain);

var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5)
                .orient("left")
                .tickSize(5,0,5);


var d3ObjId="svgElement2";
var interpolation='basis';

var svg = d3.select("#"+d3ObjId)
            .append("svg")
                .attr("width", width)
                .attr("height", height);

svg.append("line")
    .attr("class", "boxplot")
    .attr("x1", margin.left)
    .attr("x2", width-margin.right)
    .attr("y1", y(0))
    .attr("y2", y(0));

for(var i=0; i<results.length; i++){
    results[i]=results[i].sort(d3.ascending)
    var g=svg.append("g").attr("transform", "translate("+(i*(boxWidth+boxSpacing)+margin.left)+",0)");
    addViolin(g, results[i], height, boxWidth, domain, 0.25, "#cccccc");
 //   addBoxPlot(g, results[i], height, boxWidth, domain, .15, "black", "white");

}

/*
svg.append("g")
    .attr('class', 'axis')
    .attr("transform", "translate("+margin.left+",0)")
    .call(yAxis);
*/

	
</script>


<?php include("footer.php"); ?>
