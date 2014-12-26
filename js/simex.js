var slider = {};
slider.s = 0.1;
slider.r = 0.001;
slider.d = 5;
slider.f = 0.5;

var values = {};
values.s = 1;
values.r = 1;
values.d = parseInt($("#d > a").html());
values.f = parseInt($("#f > a").html());

var bep = {};
bep.ε = {};
bep.μ = {};
bep.ρ = {};
bep.λ = {};
bep.τ = {};
bep.θ = {};

var settings = {};
settings.relative = true;
settings.boxWidth = 8;
settings.boxHeight = 12;
settings.boxSpacing = 1;


var data = {};

$(document).ready(function() {
	
	$.getJSON(
		"data/stat.json",
		function(d) {
			console.log("data loaded");
			data = d;
			readData();
		}
	);

});

var setSlider = function(id, val) {
	$("#"+id).val(val);
}

var setLabel = function(id, val) {
	$("#"+id+"_label").html(val);
}


// buttons
$(".button#r a, .button#s a").on('click', function(e) {
	e.preventDefault();
	var id = $(this).parent().attr('id');
	var value = $(this).html();
	var v = map[id].value(value);
	
	$(this).siblings().removeClass("selected");
	$(this).addClass("selected");
	slider[id] = value;
	values[id] = v;
	setLabel(id, value);
	update();	
});

$(".button#d a, .button#f a").on('click', function(e) {
	e.preventDefault();
});

// scale
$(".button#abs a").on('click', function(e) {
	e.preventDefault();
	var v = $(this).data().value;
	if (v==="rel") settings.relative = true;
	if (v==="abs") settings.relative = false;
	$(this).siblings().removeClass("selected");
	$(this).addClass("selected");
	update();
});



var data; // a global
	
var readData = function() {	
	d3.json("data/stat.json", function(error, json) {
		if (error) return console.warn(error);
		data = json;
		init();
	});
}


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
	value: function(x) { return this.map(x) },
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


var g = {};

var svg;
var init = function() {
	console.log("init");
	
	var width = 960, height = 350;
	var div = d3.select('#overview');
	svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	d3.select('body').on("mouseup", rectUp);		// general mouseup handler
	
	
	// helper function to add indicators
	var addIndicator = function(x) {
		var color = '#999999';
		var thickness = 4;
		var indicators = x.append('g').attr('class', 'indicators');
		indicators.append('rect')
			.attr('class','d-indicator')
			.attr('x', -thickness-settings.boxSpacing)
			.attr('y', (settings.boxHeight+settings.boxSpacing)*values.d)		
			.attr('width', thickness)
			.attr('height', settings.boxHeight)
			.attr('fill', color);

		indicators.append('rect')
			.attr('class','f-indicator')
			.attr('x', (settings.boxWidth+settings.boxSpacing)*values.f)
			.attr('y', 130)
			.attr('width', settings.boxWidth)
			.attr('height', thickness)
			.attr('fill', color);
	}
	
	// positions
	g.ε = svg.append('g')
			.attr('class', 'ε')
			.attr('transform', 'translate(20,0)');
	g.ε.append('g').attr('class', 'boxes');
	addIndicator(g.ε);
	
	g.μ = svg.append('g')
		.attr('class', 'μ')
		.attr('transform', 'translate(350,0)');
	g.μ.append('g').attr('class', 'boxes');
	addIndicator(g.μ);
	
	g.τ = svg.append('g')
		.attr('class', 'τ')
		.attr('transform', 'translate(670,0)');
	g.τ.append('g').attr('class', 'boxes');
	addIndicator(g.τ);
	
	g.ρ = svg.append('g')
		.attr('class', 'ρ')
		.attr('transform', 'translate(20,180)');
	g.ρ.append('g').attr('class', 'boxes');
	addIndicator(g.ρ);
	
	g.λ = svg.append('g')
		.attr('class', 'λ')
		.attr('transform', 'translate(350,180)');
	g.λ.append('g').attr('class', 'boxes');
	addIndicator(g.λ);
	
	g.θ = svg.append('g')
		.attr('class', 'θ')
		.attr('transform', 'translate(670,180)');
	g.θ.append('g').attr('class', 'boxes');
	addIndicator(g.θ);
	
	// indicators
	
	
	
	update();
}




var srMatrix;

var update = function() {
	
	srMatrix = data[values.s][values.r];
	// get data
	
	// find higest & lowest values
	if (settings.relative) {
		updateLimits(srMatrix);
	} else {
		getLimits();		// cache
	}
	
	updateDisplay('ε');
	updateDisplay('μ');
	updateDisplay('τ');
	updateDisplay('ρ');
	updateDisplay('λ');
	updateDisplay('θ');
}


var updateDisplay = function(x) {

	var rw = settings.boxWidth;
	var rh = settings.boxHeight;
	var p = settings.boxSpacing;
	// join

	var boxes = d3.select("g."+x+" g.boxes");  // select boxes
	grp = boxes.selectAll('g')
		.data(srMatrix);
	
	grp.enter()
		.append('g')
		.attr('transform', function(d, i) {
		    return 'translate(0,' + (rh + p) * i + ')';
		});
	
	var rect = grp.selectAll('rect')
		.data(function(d) { return d; })
		.attr('fill', function(d) { 
			return bep[x].colorMap(d[x]);
		});
						
	rect.enter()
		.append('rect')
			.attr('x', function(d, i) { 
				return (rw + p) * i; 
			})
			.attr('width', rw)
			.attr('height', rh)
			.attr('fill', function(d) { 
				return bep[x].colorMap(d[x]);
			})
//			.on("mouseover", rectOver)
			.on("mousedown", rectDown)
			.on("mouseout", rectOut)
			.on("mousemove", rectMove);
	
}



var mouseDown = false;

var rectOver= function(d,x,y) {
	// update D, F
	console.log("over", x,y);
}

var rectDown= function(d,x,y) {
	mouseDown = true;
	updateIndicators(x,y);
}
var rectUp= function() {
	mouseDown = false;
}

var rectOut= function(d,x,y) {
//	console.log("out", d,x,y);
}

var rectMove= function(d,x,y) {
	if (mouseDown) {
		updateIndicators(x,y);
	}
}




var updateIndicators = function(x,y) {
	values.f = x+1;
	values.d = y+1;
	$("#f > a").html(values.f);
	$("#d > a").html(values.d);
	var f = (settings.boxWidth+settings.boxSpacing)*(x);
	var d = (settings.boxHeight+settings.boxSpacing)*(y);
	d3.selectAll(".f-indicator").attr('x', f);
	d3.selectAll(".d-indicator").attr('y', d);
}




var updateLimits = function(matrix) {
	var linear = [];
	matrix.map(function(d) { 
		d.map(function(f) { 
			linear.push(f);
		})
	});
	for (var key in bep) {
		if (bep.hasOwnProperty(key)) {
			var min = d3.min(linear, function(d) {return d[key]});
			var max = d3.max(linear, function(d) {return d[key]});
			bep[key].range = [min, max]; 
			bep[key].colorMap.domain([min, max]);
			console.log(key, [min, max]);
		}
	}
}

// get Limits. interate over data, get [min, max] of all types
var getLimits = function(matrix) {
	var linear = [];
	data.map(function(d) { 
		d.map(function(f) { 
			f.map(function(g) {
				g.map(function(h) { 
					linear.push(h);
				}) 
			})
		})
	});
	for (var key in bep) {
		if (bep.hasOwnProperty(key)) {
			var min = d3.min(linear, function(d) {return d[key]});
			var max = d3.max(linear, function(d) {return d[key]});
			bep[key].range = [min, max]; 
			bep[key].colorMap.domain([min, max]);
		}
	}	
}






