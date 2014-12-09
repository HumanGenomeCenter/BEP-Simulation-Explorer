var slider = {};
slider.s = 0.1;
slider.r = 0.001;
slider.d = 5;
slider.f = 0.5;

var values = {};
values.s = 1;
values.r = 1;
values.d = 4;
values.f = 13;

var bep = {};
bep.ε = {};
bep.μ = {};
bep.ρ = {};
bep.λ = {};
bep.τ = {};
bep.θ = {};

var settings = {};
settings.relative = true;

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
	
	// positions
	g.ε = svg.append('g')
		.attr('class', 'ε')
		.attr('transform', 'translate(20,0)');
	
	g.μ = svg.append('g')
		.attr('class', 'μ')
		.attr('transform', 'translate(350,0)');
	
	g.τ = svg.append('g')
		.attr('class', 'τ')
		.attr('transform', 'translate(670,0)');
	
	g.ρ = svg.append('g')
		.attr('class', 'ρ')
		.attr('transform', 'translate(20,180)');

	g.λ = svg.append('g')
		.attr('class', 'λ')
		.attr('transform', 'translate(350,180)');

	g.θ = svg.append('g')
		.attr('class', 'θ')
		.attr('transform', 'translate(670,180)');
	
	
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
	var rw = 8;
	var rh = 12;
	var p = 1;
	// join
	
	grp = g[x].selectAll('g')
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
				});
	
	
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






