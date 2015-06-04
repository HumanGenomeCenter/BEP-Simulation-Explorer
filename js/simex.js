var bep = {};

// get default values from html
bep.values = {};
bep.values.s = parseFloat($("#s .btn.active span").html());
bep.values.r = parseFloat($("#r .btn.active span").html());
bep.values.d = parseFloat($("#d .btn.active span").html());
bep.values.f = parseFloat($("#f .btn.active span").html());

var details = [];
bep.selected = [false, false, false, false, false];

bep.s = [0.01, 0.1, 1];
bep.r = [0.0001, 0.001, 0.01];

bep.fields = {};
bep.fields.parameter = ['ε','μ','τ','ρ','λ','θ'];
bep.fields.statistics = ['a','b','c','d','e','f','g','h','i'];

bep.labelData = {	'ε': 'ε: Population Entropy', 
					'μ': 'μ: Founder Mutation Count',
					'τ': 'τ: Growth Time',
					'ρ': 'ρ: Average Mutation Count',
					'λ': 'λ: Population Fitness',
					'θ': 'θ: Selfsimilarity'};
					

bep.fields.all = bep.fields.parameter.concat(bep.fields.statistics);
bep.fields.all.forEach(function(d) {bep[d] = {};});		// init with empty objects


bep.settings = {};
bep.settings.valuesView = 'rel';
bep.settings.boxSpacing = 0;
bep.settings.width = 173;	// 260
bep.settings.height = 109;	// 129
//bep.settings.boxWidth = (bep.settings.width - 28*bep.settings.boxSpacing) / 29;
//bep.settings.boxHeight = (bep.settings.height - 9*bep.settings.boxSpacing) / 10;
bep.settings.boxWidth = 6;
bep.settings.boxHeight = 11;

bep.settings.duration = 1000;
bep.settings.durationNormal = 1000;	// for slow shift
bep.settings.durationSlow = 3000;	// for slow shift
bep.settings.view = "parameter";  // Selected tab
bep.settings.animation = true; // Animations on by default ... TODO save locally

bep.mouseDown = false;

bep.color = {};
bep.color.na = "#dddddd";
bep.color.valueHighlight = "#ffffff";
bep.color.naHighlight = "#333333";

var data = {};



// Scales to access array data & deal with JS error
var map = {};
map.s = {
	map: d3.scale.log().domain([1, 100]).range([0, 2]).clamp(true),
	value: function(x) { return this.map(x*100) },
	i: function(x) { return Math.round(this.map.invert(x))/100;},
}

map.r = {
	map: d3.scale.log().domain([1, 100]).range([0, 2]).clamp(true),
	value: function(x) { return this.map(x*10000) },
	i: function(x) { return Math.round(this.map.invert(x))/10000;},
}

map.d = {
	map: d3.scale.linear().domain([1, 10]).range([0, 9]).clamp(true),
	value: function(x) { return this.map(x) },
	i: function(x) { return Math.round(this.map.invert(x));},
}

map.f = {
	map: d3.scale.linear().domain([10, 150]).range([0, 28]).clamp(true),
	value: function(x) { return this.map(x*100) },
	i: function(x) { return Math.round(this.map.invert(x))/100;},
}



$(document).ready(function() {
	d3.select('body').on("mouseup", function() { 	// add general mouseup handler
		bep.mouseDown = false;
	});		
	
	d3.json("../data/stat.json", function(error, json) {	// load data
		if (error) return console.warn(error);
		data = json;					// make data gloabl
		initRanges();					// initRanges
		initDetails();
		initOverview();
	});
});

// Color maps
bep.ε.colorMap = d3.scale.linear().range(["#FFFFFF", "#FF0000"]).clamp(true);
bep.μ.colorMap = d3.scale.linear().range(["#FFFFFF", "#0000FF"]).clamp(true);
bep.τ.colorMap = d3.scale.linear().range(["#FFFFFF", "#A020F0"]).clamp(true);
bep.ρ.colorMap = d3.scale.linear().range(["#FFFFFF", "#00CD00"]).clamp(true);
bep.λ.colorMap = d3.scale.linear().range(["#FFFFFF", "#EEEE00"]).clamp(true);
bep.θ.colorMap = d3.scale.linear().range(["#FFFFFF", "#FFA500"]).clamp(true);

// init ranges & colorMaps for overview fields
bep.fields.statistics.forEach(function(d) {
	bep[d].range = [0,1];
	bep[d].colorMap = d3.scale.linear().range(["#FFFFFF", "#FF0000"]).clamp(true);
});






var updateImages = function() {
		
	// close, reset details
	//$(".details").hide(200);
	bep.selected = [false, false, false, false, false];		// reset
	$(".line").css('background-color', '#fff');
	
	if (bep.allValuesAreNull) {


		$(".results").hide();
		$(".results-placeholder").show();
		
	} else {
		
		$(".results-placeholder").hide();
		$(".results").show();
		details = [];
		var baseurl = "../results/s" + bep.values.s + "_r" + bep.values.r + "/d" + bep.values.d + "_f"+ bep.values.f;
	
		d3.selectAll("img.tumor")
			.data([0,1,2,3,4])
			.attr('src', function(d) {
				return baseurl + "_" + d + ".tumor.png";
			})
			.attr("style", "display:inline");
		
		d3.selectAll("img.mutprof")
			.data([0,1,2,3,4])
			.attr('src', function(d) {
				$.get(baseurl + "_" + d + ".html", function(data) {
					// QnD way of getting the data out of HTML
					var a = data.split("</td><td>");
					var v = {};
					v.ε = parseFloat(a[1]);
					v.μ = parseFloat(a[2]);
					v.ρ = parseFloat(a[3]);
					v.λ = parseFloat(a[4]);
					v.τ = parseFloat(a[5]);
					v.θ = parseFloat(a[6]);
					details[d] = v;
				});
			
				return baseurl + "_" + d + ".mutprof.png";
			})
			.attr("style", "display:inline");
	}

}



var updateIndicators = function() {
	
	var x = map.f.value(bep.values.f);
	var y = map.d.value(bep.values.d);
	$("#f .dropdown-toggle span").first().html(bep.values.f); 	// bind button
	$("#d .dropdown-toggle span").first().html(bep.values.d);
	var f = (bep.settings.boxWidth+bep.settings.boxSpacing)*(x);
	var d = (bep.settings.boxHeight+bep.settings.boxSpacing)*(9-y);
	
	d3.selectAll(".f-indicator").attr('x', f).style('display', 'inline');
	d3.selectAll(".d-indicator").attr('y', d).style('display', 'inline');
	
	
	if (bep.settings.view==="statistics") {
		// hide all indicators
		d3.selectAll("#statistic .f-indicator").style('display', 'none');
		d3.selectAll("#statistic .d-indicator").style('display', 'none');
		d3.selectAll("#statistic .background-highlight").style('display', 'none');
		
		// show only selected, not pretty...
		bep.fields.statistics.forEach(function(d) {
			if (bep[d].s === bep.values.s && bep[d].r === bep.values.r) {
				d3.selectAll("#statistic ."+d+" .f-indicator").style('display', 'block');
				d3.selectAll("#statistic ."+d+" .d-indicator").style('display', 'block');
				d3.selectAll("#statistic ."+d+" .background-highlight").style('display', 'block');
			}
		})
		
	}
	
	
	
}










// Tumor, Mutprof Interaction
$(document).ready(function() {
	
	$(".results a").mouseover(function(e) {
		$(this).next().css('background-color', '#ccc');
	});
	
	$(".results a").mouseout(function(e) {
		$(this).next().css('background-color', '#fff');
	});
	
	$(".results a").click(function(e) {
		e.preventDefault();
		var id = $(this).data('id'); 
		var b = bep.values;
		var d = details[id];
			
		// update values
		$(".values #s").html(b.s);
		$(".values #r").html(b.r);
		$(".values #d").html(b.d);
		$(".values #f").html(b.f);
		
		$(".values #ε").html(d.ε);
		$(".values #μ").html(d.μ);
		$(".values #ρ").html(d.ρ);
		$(".values #λ").html(d.λ);
		$(".values #τ").html(d.τ);
		$(".values #θ").html(d.θ);
		
		var path = "../results/s"+b.s+"_r"+b.r+"/d"+b.d+"_f"+b.f+"_"+id+".";
		$(".mutprof img").attr("src", path+"mutprof.png");
		$(".tumor img").attr("src", path+"tumor.png");
		$(".pc img").attr("src", path+"pc.png");
		$(".selfsim img").attr("src", path+"selfsim.png");
		$(".cellsim img").attr("src", path+"cellsim.png");
		$(".alfrq img").attr("src", path+"alfrq.png");
		
		// show modal
		$('#detailsModal').modal();
	});
	
})



// helper function to add indicators
var drawScales = function(grp) {

	var indicators = grp.append('g').attr('class', 'indicators');
	var thickness = 7;
	var spacing = 3;
	
	// vertical
	indicators.append('rect')
		.attr('class','d-indicator')
		.attr('x', -thickness-spacing)
		.attr('y', (bep.settings.boxHeight+bep.settings.boxSpacing)*(map.d.value(bep.values.d)))
		.attr('width', thickness)
		.attr('height', bep.settings.boxHeight);

	// horizontal
	indicators.append('rect')
		.attr('class','f-indicator')
		.attr('x', (bep.settings.boxWidth+bep.settings.boxSpacing)*(map.f.value(bep.values.f)))
		.attr('y', bep.settings.height+spacing)
		.attr('width', bep.settings.boxWidth)
		.attr('height', thickness);
		
		
	// axis
	var fAxis = d3.svg.axis()
		.orient('left')
		.scale(d3.scale.linear().domain([1,10]).range([bep.settings.height-bep.settings.boxHeight,0]))
		.ticks(10)

	xAxis = grp.append('g')
		.attr('class', 'f-axis axis')
		.attr('transform', 'translate(-3,'+(bep.settings.boxHeight/2)+')')
		.call(fAxis);
		
	var dAxis = d3.svg.axis()
		.orient('bottom')
		.scale(d3.scale.linear().domain([0.1,1.5]).range([0,bep.settings.width-bep.settings.boxWidth]))
		.ticks(10)

	yAxis = grp.append('g')
		.attr('class', 'd-axis axis')
		.attr('transform', 'translate('+(bep.settings.boxWidth/2)+','+(3+bep.settings.height)+')')
		.call(dAxis);
			
	// legend
	var dLegend = grp.append('g')
		.attr('class', 'legend')
		.attr('transform', 'translate(-37,'+(bep.settings.height/2)+')');
		
	dLegend.append('text')
		.text("d");

	var fLegend = grp.append('g')
		.attr('class', 'legend')
		.attr('transform', 'translate('+(bep.settings.width/2)+','+(bep.settings.height+40)+')');

	fLegend.append('text')
		.text("f");		
}





var initViolinPlots = function(d, matrix, parameter) {
	
	if (undefined===parameter) parameter = d;
	
	var dataRange,
		margin = 30,
		width = 60,
		height = bep.settings.height,
		x, y,			// scales
		data,
		values,
		area;
	
	var violin = d3.select("."+d).append('g')
		.attr('class', 'violin')
		.attr("transform", "translate("+(bep.settings.width+40)+",0)")

	bep[d].violin = violin;		// cache handler for update
		
	values = matrix
		.reduce(function(a, b) { return a.concat(b) }) 		// flatten array
		.map(function(a) { return a[parameter] || 0 });		// isolate value, replace null with 0, boxplot can't handle null
	
	// replace null with 0. boxplot doesnot handle null values
	
	var dataRange;	
	if (bep.settings.valuesView==='rel') {
		dataRange = [d3.min(values), d3.max(values)];
	} else if (bep.settings.valuesView==='abs') {
		dataRange = bep[d].range;
	}
	
	x = d3.scale.linear()
		.domain(dataRange)
		.range([height,0]);	// 0 at bottom

	data = d3.layout.histogram().bins(x.ticks(50))(values);
	
	y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
		.range([0, width]);

	// definition for gradient
	updateGradient(d, [x(d3.max(values))/height, x(d3.min(values))/height], 0, parameter);

	// area generator
	area = d3.svg.area()
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
		.style("fill", "url(#grad_"+d+")")
		.attr("transform", "scale(-0.5,1) rotate(90)")
		.append("path")
			.datum(data)
			.attr("d", area)
	
	kdf.append("g")
		.attr("class", "area mirrored")
		.style("fill", "url(#grad_"+d+")")
		.attr("transform", "scale(0.5,1) rotate(90)")
		.append("path")
			.datum(data)
			.attr("d", area);
	
	// boxplot
	var chart = d3.box()
		.whiskers(iqr(1.5))
		.width(width/8)
		.height(height)
		.domain(dataRange)
		.tickFormat(" ");
			
	// Helper function for boxplot
	// Returns a function to compute the interquartile range.
	// move to box.js?
	
	var boxgroup = violin.append("g").attr("class", "boxgroup");
	var boxplot = boxgroup.append("g")
		.data([values])
		.attr("class", "box")
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate("+(width/2-width/8/2)+",0)")		// center
		.call(chart);

	var xA = violin.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(-5,0)")
		.call(d3.svg.axis().scale(x).orient("left"));
		
	
}



var updateViolinPlots = function(d, matrix, parameter) {
	if (undefined===parameter) parameter = d;
		
	var duration = bep.settings.duration;	// animation duration
	var height = bep.settings.height;
	var width = 60;
	var violin = bep[d].violin;
	
	var values = matrix
		.reduce(function(a, b) { return a.concat(b) })	// flatten array
		.map(function(a) { return a[parameter] })	 	// isolate value
		.filter(function(a) { return a!==null });		// filter out null values
	
	var dataRange;	
	if (bep.settings.valuesView==='rel') {	// relative
		dataRange = d3.extent(values);		// get min, max values
	} else if (bep.settings.valuesView==='abs') {
		dataRange = bep[d].range;			// absolute min, max values from cache
	}
	
	var x = d3.scale.linear()
		.domain(dataRange)
		.range([height,0]);	// 0 at bottom

	var data = d3.layout.histogram().bins(x.ticks(50))(values);

	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])		// get highest bin
		.range([0, width]);
		
	// definition for gradient
	updateGradient(d, [x(d3.max(values))/height, x(d3.min(values))/height], duration, parameter);

	// area generator
	var area = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.x+d.dx/2); })
		.y0(0)
		.y1(function(d) { return y(d.y); })
	
	var boxplot = violin.select(".box");
	
	var chart = d3.box()
		.whiskers(iqr(1.5))
		.width(width/8)
		.height(height)
		.domain(dataRange)
		.tickFormat(" ");	// hack, " " instead of d3.format
		
	// update boxplot & chart domain	
	boxplot
		.datum(values)
		.call(chart.domain(dataRange).duration(duration).height(height));		// don't forget to 
		
	// update axis
	var xA = violin.select(".y.axis");
	xA.transition().duration(duration)
		.call(d3.svg.axis().scale(x).orient("left"));  

	// update kdf
	var kdf = violin.select(".kdf");
	kdf.selectAll(".area path")
			.datum(data)
		.transition()
			.attr("d", area)
			.duration(duration);


}




// update/create gradient
var updateGradient = function(d, range, duration, parameter) {
	
	var defs = d3.selectAll("svg defs");		// both SVG containers
	var id = "grad_"+d;

	var endColor = bep[parameter].colorMap.range()[1];
	
	var data = [
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
			.duration(duration)
			.attr("offset", function(d) { return d.offset; })			// enter
			.attr("stop-color", function(d) { return d.color; });
	}

	gradient.selectAll("stop")			// reselect
		.data(data)
		.call(up)
	.enter()
		.append("stop")
		.call(up);					// enter
	
}

var iqr = function(k) {
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




var updateGrids = function(x, matrix, value, settings) {

	if (value===undefined) value = x;
	
	var getColor = function(d) {
		// missing values -> null
		if (d[value] === null && bep.settings.missingView) return bep.color.naHighlight;
		if (d[value] === null ) return bep.color.na;
		if (bep.settings.missingView) return bep.color.valueHighlight;
		return bep[x].colorMap(d[value]);
	}
	
	// default
	var rw = bep.settings.boxWidth;
	var rh = bep.settings.boxHeight;
	var p = bep.settings.boxSpacing;
	
	// optional settings
	if (settings!==undefined) {
		if (settings.boxWidth!==undefined) rw = settings.boxWidth;
		if (settings.boxHeight!==undefined) rw = settings.boxHeight;
		if (settings.boxSpacing!==undefined) rw = settings.boxSpacing;
	}
	
	// join

	var boxes = d3.select("g."+x+" g.boxes");  // select boxes
	var grp = boxes.selectAll('g')
		.data(matrix);
		
	
	grp.enter()
		.append('g')
		.attr('transform', function(d, i) {
			return 'translate(0,' + (rh + p) * (9-i) + ')';
		});
	
	// re-bind data
	var rect = grp.selectAll('rect')
		.data(function(d) { return d; });	
		
	// fading transitions
	rect
		.transition()
		.duration(bep.settings.duration)
		.attr('fill', getColor);
		
	rect.enter()
		.append('rect')
			.attr('x', function(d, i) { 
				return (rw + p) * i; 
			})
			.attr('width', rw)
			.attr('height', rh)
			.attr('fill', getColor)
			.on("mousedown", gridMouseDown)
			.on("mouseup", gridMouseUp)
			.on("mousemove", gridMouseMove);
}


var initRanges = function() {
	// Cache Ranges &
	bep.ranges = [];
	bep.s.forEach(function(s, i) {
		bep.ranges[i] = [];
		bep.r.forEach(function(r, j) {
			bep.ranges[i][j] = getRanges(s, r);
		});
	});
}

var getRanges = function(s, r) {
		
	var cache = {};
	// rel
	var relativeValues = [];
	var matrix = data[map.s.value(s)][map.r.value(r)];
	matrix.map(function(d) { 		// passed-in
		d.map(function(f) { 
			relativeValues.push(f);
		})
	});
		
	var absValues = []
	data.map(function(d) { 			// global
		d.map(function(f) { 
			f.map(function(g) {
				g.map(function(h) { 
					absValues.push(h);
				}) 
			})
		})
	});	
		
	// update ranges & colorMaps for all fields
	bep.fields.parameter.forEach(function(f) {
		var relativeRange 	= [	d3.min(relativeValues, function(d) {return d[f]}), 
								d3.max(relativeValues, function(d) {return d[f]})	];
		var absRange 		= [	d3.min(absValues, function(d) {return d[f]}), 
								d3.max(absValues, function(d) {return d[f]})		];
		cache[f] = {rel:relativeRange, abs:absRange};
	});
	
	return cache;
}


// replace missing image, jQuery way
$('img.tumor').error(function() {
	$(this).hide();
//	$(this).attr('src', '../img/missing.tumor.png');
});

$('img.mutprof').error(function() {
	$(this).hide();
//	$(this).attr('src', '../img/missing.mutprof.png');
});



