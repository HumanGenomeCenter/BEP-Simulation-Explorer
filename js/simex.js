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



$("input.vertical").on('input', function(e) {
	var id = $(this).attr('id');
	var v = $(this).val();
	var value = map[id].i(v);
	slider[id] = value;
	values[id] = v;
	setLabel(id, value);
	update();
})


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
colorMap = {};
colorMap.ε = d3.scale.linear().domain([0, 0.325264496241724]).range(["#FFFFFF", "#FF0000"]).clamp(true);
colorMap.μ = d3.scale.linear().domain([0, 9.85]).range(["#FFFFFF", "#0000FF"]).clamp(true);
colorMap.ρ = d3.scale.linear().domain([0, 40]).range(["#FFFFFF", "#00CD00"]).clamp(true);
colorMap.λ = d3.scale.linear().domain([0, 1]).range(["#FFFFFF", "#EEEE00"]).clamp(true);
colorMap.τ = d3.scale.linear().domain([4.2, 6.0606256092867]).range(["#FFFFFF", "#A020F0"]).clamp(true);
colorMap.θ = d3.scale.linear().domain([0.35, 1]).range(["#FFFFFF", "#FFA500"]).clamp(true);



var svg;
var init = function() {
	console.log("init");
	
	var width = 960, height = 480;
	var div = d3.select('#overview');
	svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	update();
}

var highest = 0;
var lowest = 1000000;
var update = function() {
	console.log("update", slider.s, slider.r);
	console.log("update", values.s, values.r);
	
	srMatrix = data[values.s][values.r];
	console.log(srMatrix);
	// get data
	
	// find higest & lowest values 
	var linear = [];
	srMatrix.map(function(d) { 
		d.map(function(f) { 
			linear.push(f);
		})
	});
	console.log(d3.max(linear, function(d) {return d.ε}));
	console.log(d3.min(linear, function(d) {return d.ε}));
	
	var rw = 32;
	var rh = 30;
	var p = 1;
	var grp = svg.selectAll('g')
		.data(srMatrix)
	.enter()
		.append('g')
		.attr('transform', function(d, i) {
		    return 'translate(0,' + (rh + p) * i + ')';
		});
	
	grp.selectAll('rect')
		.data(function(d) { return d; })
	.enter()
		.append('rect')
			.attr('x', function(d, i) { 
				return (rw + p) * i; 
			})
			.attr('width', rw)
			.attr('height', rh)
			.attr('fill', function(d) { 
				var k = d.τ;
				
				if (k > highest) {
					highest = k; 
				}
				
				if (k < lowest) {
					lowest = k; 
				}
				
				return colorMap.τ(k);
				
			});
}






