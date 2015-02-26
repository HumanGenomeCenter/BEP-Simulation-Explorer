
// get default values from html
var values = {};
values.s = parseFloat($("#s .btn.active span").html());
values.r = parseFloat($("#r .btn.active span").html());
values.d = parseFloat($("#d .btn.active span").html());
values.f = parseFloat($("#f .btn.active span").html());

var details = [];
var selected = [false, false, false, false, false];
var bep = {};
var fields = ['ε','μ','τ','ρ','λ','θ'];
var overviewFields = ['a','b','c','d','e','f','g','h','i'];
fields.concat(overviewFields).forEach(function(d) {bep[d] = {};});

var settings = {};
settings.relative = true;
settings.boxSpacing = 1;
settings.width = 173;	// 260
settings.height = 109;	// 129
settings.boxWidth = (settings.width - 28*settings.boxSpacing) / 29;
settings.boxHeight = (settings.height - 9*settings.boxSpacing) / 10;



var data = {};


$(document).ready(function() {
	d3.select('body').on("mouseup", function() { mouseDown = false; });		// general mouseup handler
	d3.json("../data/stat.json", function(error, json) {					// load data
		if (error) return console.warn(error);
		data = json;
		initDetails();
		initOverview();
	});
});


	

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


/*
"ε (population entropy)"		red 		#FF0000
"μ (founder mutation count)"	blue		#0000FF
"ρ (average mutation count)"	green3		#00CD00
"log10 λ (population fitness)"	yellow2		#EEEE00
"log10 τ (growth time)" 		purple 		#A020F0
"θ (self similality)"			orange		#FFA500

*/

bep.ε.colorMap = d3.scale.linear().range(["#FFFFFF", "#FF0000"]).clamp(true);
bep.μ.colorMap = d3.scale.linear().range(["#FFFFFF", "#0000FF"]).clamp(true);
bep.τ.colorMap = d3.scale.linear().range(["#FFFFFF", "#A020F0"]).clamp(true);

bep.ρ.colorMap = d3.scale.linear().range(["#FFFFFF", "#00CD00"]).clamp(true);
bep.λ.colorMap = d3.scale.linear().range(["#FFFFFF", "#EEEE00"]).clamp(true);
bep.θ.colorMap = d3.scale.linear().range(["#FFFFFF", "#FFA500"]).clamp(true);







var updateImages = function() {
	
	// close, reset details
	$(".details").hide(200);
	selected = [false, false, false, false, false];
	$(".line").css('background-color', '#fff');
	
	
	details = [];
	var baseurl = "../results/s" + values.s + "_r" + values.r + "/d" + values.d + "_f"+ values.f;
	
	d3.selectAll("img.tumor")
		.data([0,1,2,3,4])
		.attr('src', function(d) {
			return baseurl + "_" + d + ".tumor.png";
		});
		
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
		});


}



var updateIndicators = function() {
	var x = map.f.value(values.f);
	var y = map.d.value(values.d);
	$("#f .dropdown-toggle span").first().html(values.f); 	// bind button
	$("#d .dropdown-toggle span").first().html(values.d);
	var f = (settings.boxWidth+settings.boxSpacing)*(x);
	var d = (settings.boxHeight+settings.boxSpacing)*(9-y);
	d3.selectAll(".f-indicator").attr('x', f);
	d3.selectAll(".d-indicator").attr('y', d);
}




// get Limits. interate over data, get [min, max] of all types
var getLimits = function(matrix) {
	// add caching layer
	var linear = [];
	
	// find higest & lowest values
	if (settings.relative) {
		matrix.map(function(d) { 		// passed-in
			d.map(function(f) { 
				linear.push(f);
			})
		});
	} else {
		data.map(function(d) { 			// global
			d.map(function(f) { 
				f.map(function(g) {
					g.map(function(h) { 
						linear.push(h);
					}) 
				})
			})
		});
	}

	fields.forEach(function(f) {
		var min = d3.min(linear, function(d) {return d[f]});
		var max = d3.max(linear, function(d) {return d[f]});
		bep[f].range = [min, max]; 
		bep[f].colorMap.domain([min, max]);
	});
}





// Tumor, Mutprof Interaction
$(document).ready(function() {
	
	$(".results a").mouseover(function(e) {
		$(this).next().css('background-color', '#ccc');
	});
	
	$(".results a").mouseout(function(e) {
		if ($(this).data('selected')) {
			$(this).next().css('background-color', '#999');
		} else {
			$(this).next().css('background-color', '#fff');
		}
	});
	
	$(".results a").click(function(e) {
		e.preventDefault();
		var id = $(this).data('id'); 
		if ($(this).data('selected')) {
			$(this).data('selected', false);
			selected[id] = false;			// deselect
			$(this).next().css('background-color', '#fff');
		} else {
			
			$(this).data('selected', true);
			selected[id] = true;
			$(this).next().css('background-color', '#999');
			$(".details").slideDown(200);
			
			$('html, body').animate({
				scrollTop: $(".results").offset().top
			}, 200);
		}
		
		
		// reduce
		var sum = selected.reduce(function(a, b) {
		  return a + b;
		});
		
		var col;
		if (sum===0) {
			$(".details").slideUp(200);
			return;
		} else if(sum===5) {
			col = 2;
		} else {
			col = 12/sum;
		}
		
		// reduce data form 'details'
		
		var selectedDetails = [];
		selected.forEach(function(d,i) {
			if (d) selectedDetails.push( details[i] );
		});
			
		addColumns(selectedDetails, col);
	});
	
	
	
})


var addColumns = function(s, w) {
	
	var txt = [
		{'id':'epsilon', 'short':'ε', 'desc':'population entropy'},
		{'id':'mu', 'short':'μ', 'desc':'founder mutation count'},
		{'id':'rho', 'short':'ρ', 'desc':'average mutation count'},
		{'id':'lambda', 'short':'λ', 'desc':'population fitness'},
		{'id':'tau', 'short':'τ', 'desc':'growth time'},
		{'id':'theta', 'short':'θ', 'desc':'self similality'},
	];
	
	// values
	var h = $("<div>");		"empty"
	s.forEach(function(v) {
		var column = $('<div class="col-xs-'+w+'"></div>');
		txt.forEach(function(d) {
			column.append('<div id="'+d.id+'"><span>'+d.short+'</span> <span class="value">'+v[d.short]+'</span></div>')
		});
		h.append(column);
	});
	$(".row.values").html( h.html() );	// get html content


	var baseurl = "../results/s" + values.s + "_r" + values.r + "/d" + values.d + "_f"+ values.f;
	
	selectedData = []
	selected.forEach(function(d, i){
		if (d) selectedData.push(i);
	});
	
		
	// mutprof
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".mutprof.png";
		h.append( $('<div class="col-xs-'+w+'"><img src='+url+'></div>)') );
	});
	$(".row.mutprof").html( h.html() );
	
	// tumor
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".tumor.png";
		h.append( $('<div class="col-xs-'+w+'"><img src='+url+'></div>)') );
	});
	$(".row.tumor").html( h.html() );
	
	// pc
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".pc.png";
		h.append( $('<div class="col-xs-'+w+'"><img src='+url+'></div>)') );
	});
	$(".row.pc").html( h.html() );
	
	// selfsim
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".selfsim.png";
		h.append( $('<div class="col-xs-'+w+'"><img src='+url+'></div>)') );
	});
	$(".row.selfsim").html( h.html() );
	
	// cellsim
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".cellsim.png";
		h.append( $('<div class="col-xs-'+w+'"><img src='+url+'></div>)') );
	});
	$(".row.cellsim").html( h.html() );
	
	// alfrq
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".alfrq.png";
		h.append( $('<div class="col-xs-'+w+'"><img src='+url+'></div>)') );
	});
	$(".row.alfrq").html( h.html() );
	
	
	//
}



// helper function to add indicators
var drawScales = function(grp) {

	var indicators = grp.append('g').attr('class', 'indicators');
	var thickness = 7;
	var spacing = 3;
	
	// vertical
	indicators.append('rect')
		.attr('class','d-indicator')
		.attr('x', -thickness-spacing)
		.attr('y', (settings.boxHeight+settings.boxSpacing)*(map.d.value(values.d)))
		.attr('width', thickness)
		.attr('height', settings.boxHeight);

	// horizontal
	indicators.append('rect')
		.attr('class','f-indicator')
		.attr('x', (settings.boxWidth+settings.boxSpacing)*(map.f.value(values.f)))
		.attr('y', settings.height+spacing)
		.attr('width', settings.boxWidth)
		.attr('height', thickness);
		
		
	// axis
	var fAxis = d3.svg.axis()
		.orient('left')
		.scale(d3.scale.linear().domain([1,10]).range([settings.height-settings.boxHeight,0]))
		.ticks(10)

	xAxis = grp.append('g')
		.attr('class', 'f-axis axis')
		.attr('transform', 'translate(-3,'+(settings.boxHeight/2)+')')
		.call(fAxis);
		
	var dAxis = d3.svg.axis()
		.orient('bottom')
		.scale(d3.scale.linear().domain([0.1,1.5]).range([0,settings.width-settings.boxWidth]))
		.ticks(10)

	yAxis = grp.append('g')
		.attr('class', 'd-axis axis')
		.attr('transform', 'translate('+(settings.boxWidth/2)+','+(3+settings.height)+')')
		.call(dAxis);
			
	// legend
	var dLegend = grp.append('g')
		.attr('class', 'legend')
		.attr('transform', 'translate(-37,'+(settings.height/2)+')');
		
	dLegend.append('text')
		.text("d");

	var fLegend = grp.append('g')
		.attr('class', 'legend')
		.attr('transform', 'translate('+(settings.width/2)+','+(settings.height+40)+')');

	fLegend.append('text')
		.text("f");		
}





var initViolinPlots = function(d, matrix, parameter) {
	
	if (undefined===parameter) parameter = d;
	
	var dataRange,
		margin = 30,
		width = 60,
		height = settings.height,
		x, y,			// scales
		data,
		values,
		area;
	
	var violin = d3.select("."+d).append('g')
		.attr('class', 'violin')
		.attr("transform", "translate("+(settings.width+40)+",0)")

	bep[d].violin = violin;		// cache handler for update
	
	// srMatrix -> detail
	// overviewMatrix -> overview
	// transform srMatrix data
		
	values = matrix
		.reduce(function(a, b) { return a.concat(b) }) 		// flatten array
		.map(function(a) {return a[parameter]; });					// isolate value
	
	dataRange = [0, d3.max(values)];
	
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
		.width(width/6)
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
		.attr("transform", "translate("+(width/2-width/6/2)+",0)")		// center
		.call(chart);

	var xA = violin.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(-5,0)")
		.call(d3.svg.axis().scale(x).orient("left"));
		
	
}



var updateViolinPlots = function(d, matrix, parameter) {
	if (undefined===parameter) parameter = d;
	
	var duration = 1000;	// animation duration
	var height = settings.height;
	var width = 60;
	var violin = bep[d].violin;
	
	var values = matrix
		.reduce(function(a, b) { return a.concat(b) }) 		// flatten array
		.map(function(a) {return a[parameter]; });			// isolate value
		
	var dataRange = [0, d3.max(values)];	

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
		.width(width/6)
		.height(height)
		.domain(dataRange)
		.tickFormat(" ");	// hack, " " instead of d3.format
	
	boxplot.datum(values)
		.call(chart.domain(dataRange).duration(duration));		// don't forget to update chart domain
	
	// update axis
	var xA = violin.select(".y.axis");
	xA.transition().duration(duration)
		.call(d3.svg.axis().scale(x).orient("left"));  

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


