var bep = {};

// get default values from html
bep.values = {};
bep.values.s = parseFloat($("#s .btn.active span").html());
bep.values.r = parseFloat($("#r .btn.active span").html());
bep.values.d = parseFloat($("#d .btn.active span").html());
bep.values.f = parseFloat($("#f .btn.active span").html());

var details = [];
bep.selected = [false, false, false, false, false];

bep.fields = {};
bep.fields.parameter = ['ε','μ','τ','ρ','λ','θ'];
bep.fields.statistics = ['a','b','c','d','e','f','g','h','i'];
bep.fields.all = bep.fields.parameter.concat(bep.fields.statistics);
bep.fields.all.forEach(function(d) {bep[d] = {};});		// init with empty objects

bep.s = [0.01, 0.1, 1];
bep.r = [0.0001, 0.001, 0.01];

// Cache Ranges &
console.time("range");
bep.ranges = [];		// cache ranges
bep.s.forEach(function(s, i) {
	bep.ranges[i] = [];
	bep.r.forEach(function(r, j) {
		bep.ranges[i][j] = {};
		bep.ranges[i][j]
		bep.fields.parameter.forEach(function(p) { 
			bep.ranges[i][j][p] = {rel:[], abs:[]};
		});
	});
});
console.timeEnd("range");


bep.settings = {};
bep.settings.relative = true;
bep.settings.boxSpacing = 1;
bep.settings.width = 173;	// 260
bep.settings.height = 109;	// 129
bep.settings.boxWidth = (bep.settings.width - 28*bep.settings.boxSpacing) / 29;
bep.settings.boxHeight = (bep.settings.height - 9*bep.settings.boxSpacing) / 10;
bep.settings.duration = 1000;
bep.settings.parameterView = true;  // Selected tab

bep.mouseDown = false;

var data = {};


$(document).ready(function() {
	d3.select('body').on("mouseup", function() { 	// general mouseup handler
		bep.mouseDown = false;
	});		
	
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

// init ranges & colorMaps for overview fields
bep.fields.statistics.forEach(function(d) {
	bep[d].range = [0,1];
	bep[d].colorMap = d3.scale.linear().range(["#FFFFFF", "#FF0000"]).clamp(true);
});






var updateImages = function() {
	console.log("update images");
	
	// close, reset details
	$(".details").hide(200);
	bep.selected = [false, false, false, false, false];		// reset
	$(".line").css('background-color', '#fff');
	
	
	details = [];
	var baseurl = "../results/s" + bep.values.s + "_r" + bep.values.r + "/d" + bep.values.d + "_f"+ bep.values.f;
	
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
	var x = map.f.value(bep.values.f);
	var y = map.d.value(bep.values.d);
	$("#f .dropdown-toggle span").first().html(bep.values.f); 	// bind button
	$("#d .dropdown-toggle span").first().html(bep.values.d);
	var f = (bep.settings.boxWidth+bep.settings.boxSpacing)*(x);
	var d = (bep.settings.boxHeight+bep.settings.boxSpacing)*(9-y);
	d3.selectAll(".f-indicator").attr('x', f);
	d3.selectAll(".d-indicator").attr('y', d);
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
			bep.selected[id] = false;			// deselect
			$(this).next().css('background-color', '#fff');
		} else {
			
			$(this).data('selected', true);
			bep.selected[id] = true;
			$(this).next().css('background-color', '#999');
			$(".details").slideDown(200);
			
			$('html, body').animate({
				scrollTop: $(".results").offset().top
			}, 200);
		}
		
		
		// reduce
		var sum = bep.selected.reduce(function(a, b) {
		  return a + b;
		});
		
		var clss = "col-xs-"+12/sum;			// 'class' is protected
		if (sum===0) {
			$(".details").slideUp(200);
			return;
		} else if(sum===1) {
			clss = "col-xs-offset-2 col-xs-8";		// center, reduce size
		} else if(sum===5) {
			clss = ["col-xs-offset-1 col-xs-2", "col-xs-2"];
		}
		
		// reduce data form 'details'
		
		var selectedDetails = [];
		bep.selected.forEach(function(d,i) {
			if (d) selectedDetails.push( details[i] );
		});
			
		addColumns(selectedDetails, clss);
	});
	
	
	
})


var addColumns = function(s, clss) {
	
	var prepareClass = function(i) {
		if (Array.isArray(clss)) {
			if (i===0) {
				return clss[0];
			} else {
				return clss[1];
			}
		}
		return clss;
	}
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
	s.forEach(function(v,i) {
		var column = $('<div class="'+prepareClass(i)+'"></div>');
		txt.forEach(function(d) {
			column.append('<div id="'+d.id+'"><span>'+d.short+'</span> <span class="value">'+v[d.short]+'</span></div>')
		});
		h.append(column);
	});
	$(".row.values").html( h.html() );	// get html content


	var baseurl = "../results/s" + bep.values.s + "_r" + bep.values.r + "/d" + bep.values.d + "_f"+ bep.values.f;
	
	selectedData = []
	bep.selected.forEach(function(d, i){
		if (d) selectedData.push(i);
	});
	
		
	// mutprof
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".mutprof.png";
		h.append( $('<div class="'+prepareClass(i)+'"><img src='+url+'></div>)') );
	});
	$(".row.mutprof").html( h.html() );
	
	// tumor
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".tumor.png";
		h.append( $('<div class="'+prepareClass(i)+'"><img src='+url+'></div>)') );
	});
	$(".row.tumor").html( h.html() );
	
	// pc
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".pc.png";
		h.append( $('<div class="'+prepareClass(i)+'"><img src='+url+'></div>)') );
	});
	$(".row.pc").html( h.html() );
	
	// selfsim
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".selfsim.png";
		h.append( $('<div class="'+prepareClass(i)+'"><img src='+url+'></div>)') );
	});
	$(".row.selfsim").html( h.html() );
	
	// cellsim
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".cellsim.png";
		h.append( $('<div class="'+prepareClass(i)+'"><img src='+url+'></div>)') );
	});
	$(".row.cellsim").html( h.html() );
	
	// alfrq
	var h = $("<div>");		"empty"
	s.forEach(function(v,i) {
		var url = baseurl + "_" + selectedData[i] + ".alfrq.png";
		h.append( $('<div class="'+prepareClass(i)+'"><img src='+url+'></div>)') );
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
		.map(function(a) {return a[parameter]; });					// isolate value
	
	var dataRange;	
	if (bep.settings.relative) {
		dataRange = [d3.min(values), d3.max(values)];
	} else {
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
	var height = bep.settings.height;
	var width = 60;
	var violin = bep[d].violin;
	
	var values = matrix
		.reduce(function(a, b) { return a.concat(b) }) 		// flatten array
		.map(function(a) {return a[parameter]; });			// isolate value
	
	var dataRange;	
	if (bep.settings.relative) {	// relative
		dataRange = [d3.min(values), d3.max(values)];
	} else {
		dataRange = bep[d].range;	// absolute
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




var updateGrids = function(x, matrix, value) {

	var getColor = function(d) {
		if (value===undefined) value = x;
		return bep[value].colorMap(d[value]);
	}
	
	var rw = bep.settings.boxWidth;
	var rh = bep.settings.boxHeight;
	var p = bep.settings.boxSpacing;
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
		.duration(slowShift)
		.attr('fill', getColor)
		.attr('opacity', function(d) { 
			if (d[x]===0) return 0;
			return 1;
		});
		
	rect.enter()
		.append('rect')
			.attr('x', function(d, i) { 
				return (rw + p) * i; 
			})
			.attr('width', rw)
			.attr('height', rh)
			.attr('fill', getColor)
			.attr('opacity', function(d) { 
				if (d[x]===0) return 0;
				return 1;
			})
			.on("mousedown", gridMouseDown)
			.on("mouseup", gridMouseUp)
			.on("mousemove", gridMouseMove);

}


