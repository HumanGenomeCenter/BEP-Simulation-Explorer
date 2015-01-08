
var values = {};
values.s = parseFloat($("#s > a").html());
values.r = parseFloat($("#r > a").html());
values.d = parseFloat($("#d > a").html());
values.f = parseFloat($("#f > a").html());

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


var setLabel = function(id, val) {
	$("#"+id+"_label").html(val);
}


// buttons
$(".button#r a, .button#s a").on('click', function(e) {
	e.preventDefault();
	var id = $(this).parent().attr('id');
	var value = parseFloat($(this).html());
	
	$(this).siblings().removeClass("selected");
	$(this).addClass("selected");
	values[id] = value;
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
	map: d3.scale.linear().domain([1, 10]).range([9, 0]).clamp(true),
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


var g = {};

var svg;
var init = function() {
	
	var width = 960, height = 350;
	var div = d3.select('#overview');
	svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	d3.select('body').on("mouseup", generalMouseUp);		// general mouseup handler
	
	
	// helper function to add indicators
	var addIndicator = function(x) {

		var indicators = x.append('g').attr('class', 'indicators');
		
		var color = '#999999';
		var thickness = 7;
		var spacing = 3;
		
		indicators.append('rect')
			.attr('class','d-indicator')
			.attr('x', -thickness-spacing)
			.attr('y', (settings.boxHeight+settings.boxSpacing)*(map.d.value(values.d)))
			.attr('width', thickness)
			.attr('height', settings.boxHeight)
			.attr('fill', color);

		indicators.append('rect')
			.attr('class','f-indicator')
			.attr('x', (settings.boxWidth+settings.boxSpacing)*(map.f.value(values.f)))
			.attr('y', 131)
			.attr('width', settings.boxWidth)
			.attr('height', thickness)
			.attr('fill', color);
			
			
		// axis
		var fAxis = d3.svg.axis()
			.orient('left')
			.scale(d3.scale.linear().domain([1,10]).range([117,0]))
			.ticks(10)

		xAxis = x.append('g')
			.attr('class', 'f-axis axis')
			.attr('transform', 'translate(-3,6)')
			.call(fAxis);
			
		var dAxis = d3.svg.axis()
			.orient('bottom')
			.scale(d3.scale.linear().domain([0.1,1.5]).range([0,251]))
			.ticks(10)

		yAxis = x.append('g')
			.attr('class', 'd-axis axis')
			.attr('transform', 'translate(4.5,132)')
			.call(dAxis);
				
			
			
		
	}
	
	// positions
	g.ε = svg.append('g')
			.attr('class', 'ε')
			.attr('transform', 'translate(25,0)');
	g.ε.append('g').attr('class', 'boxes');
	addIndicator(g.ε);
	
	g.μ = svg.append('g')
		.attr('class', 'μ')
		.attr('transform', 'translate(355,0)');
	g.μ.append('g').attr('class', 'boxes');
	addIndicator(g.μ);
	
	g.τ = svg.append('g')
		.attr('class', 'τ')
		.attr('transform', 'translate(675,0)');
	g.τ.append('g').attr('class', 'boxes');
	addIndicator(g.τ);
	
	g.ρ = svg.append('g')
		.attr('class', 'ρ')
		.attr('transform', 'translate(25,180)');
	g.ρ.append('g').attr('class', 'boxes');
	addIndicator(g.ρ);
	
	g.λ = svg.append('g')
		.attr('class', 'λ')
		.attr('transform', 'translate(355,180)');
	g.λ.append('g').attr('class', 'boxes');
	addIndicator(g.λ);
	
	g.θ = svg.append('g')
		.attr('class', 'θ')
		.attr('transform', 'translate(675,180)');
	g.θ.append('g').attr('class', 'boxes');
	addIndicator(g.θ);
	

	
	
	
	update();
}




var srMatrix;

var update = function() {
	
	srMatrix = data[map.s.value(values.s)][map.r.value(values.r)];
	
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
			console.log(i);
		    return 'translate(0,' + (rh + p) * (9-i) + ')';
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
				console.log( d[x]);
				if (d[x]===0)return "#cccccc";
				return bep[x].colorMap(d[x]);
			})
//			.on("mouseover", rectOver)
			.on("mousedown", rectDown)
			.on("mouseup", rectUp)
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
	console.log(x, map.f.map(x), "-", y, map.d.map(y));
	updateIndicators(x,y);
}
var generalMouseUp= function() {
	mouseDown = false;
}

var rectUp= function() {
//	console.log(values);
	updateImages();
}

var rectOut= function(d,x,y) {
//	console.log("out", d,x,y);
}

var rectMove= function(d,x,y) {
	if (mouseDown) {
		updateIndicators(x,y);
		updateImages();
	}
}


var updateImages = function() {
	
	var baseurl = "results/s" + values.s + "_r" + values.r + "/d" + values.d + "_f"+ values.f;
	
	d3.selectAll("#tumor img")
		.data([0,1,2,3,4])
		.attr('src', function(d) {
			return baseurl + "_" + d + ".tumor.png";
		});
		
	d3.selectAll("#mutprof img")
		.data([0,1,2,3,4])
		.attr('src', function(d) {
			return baseurl + "_" + d + ".mutprof.png";
		});

}



var updateIndicators = function(x,y) {
	values.f = map.f.i(x);
	values.d = map.d.i(y);
	$("#f > a").html(values.f);
	$("#d > a").html(values.d);
	var f = (settings.boxWidth+settings.boxSpacing)*(x);
	var d = (settings.boxHeight+settings.boxSpacing)*(9-y);
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






