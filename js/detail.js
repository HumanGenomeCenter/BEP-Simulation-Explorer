
var g = {};
var srMatrix;
var mouseDown = false;

var initDetails = function() {
	
	var width = 960, height = 380;
	var div = d3.select('#details');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	d3.select('body').on("mouseup", function() { mouseDown = false; });		// general mouseup handler
	
	// helper function to add indicators
	var initScales = function(x) {

		var indicators = x.append('g').attr('class', 'indicators');
		var thickness = 6;
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
			.attr('y', 132)
			.attr('width', settings.boxWidth)
			.attr('height', thickness);
			
			
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
				
		// legend
		var dLegend = x.append('g')
			.attr('class', 'legend')
			.attr('transform', 'translate(-37,69)');
			
		dLegend.append('circle')
			.attr('cx', '5')
			.attr('cy', '-4')
			.attr('r', '8');

		dLegend.append('text')
			.text("d");

		var fLegend = x.append('g')
			.attr('class', 'legend')
			.attr('transform', 'translate(129,163)');
			
		fLegend.append('circle')
			.attr('cx', '2')
			.attr('cy', '-4')
			.attr('r', '8');

		fLegend.append('text')
			.text("f");
		
			
			
		
	}
	
	// positions
	g.ε = svg.append('g')
			.attr('class', 'ε')
			.attr('transform', 'translate(45,0)');
	g.ε.append('g').attr('class', 'boxes');
	initScales(g.ε);
	
	g.μ = svg.append('g')
		.attr('class', 'μ')
		.attr('transform', 'translate(375,0)');
	g.μ.append('g').attr('class', 'boxes');
	initScales(g.μ);
	
	g.τ = svg.append('g')
		.attr('class', 'τ')
		.attr('transform', 'translate(695,0)');
	g.τ.append('g').attr('class', 'boxes');
	initScales(g.τ);
	
	g.ρ = svg.append('g')
		.attr('class', 'ρ')
		.attr('transform', 'translate(45,180)');
	g.ρ.append('g').attr('class', 'boxes');
	initScales(g.ρ);
	
	g.λ = svg.append('g')
		.attr('class', 'λ')
		.attr('transform', 'translate(375,180)');
	g.λ.append('g').attr('class', 'boxes');
	initScales(g.λ);
	
	g.θ = svg.append('g')
		.attr('class', 'θ')
		.attr('transform', 'translate(695,180)');
	g.θ.append('g').attr('class', 'boxes');
	initScales(g.θ);
	
	
	update();
}




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
	
	updateImages();
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
			return 'translate(0,' + (rh + p) * (9-i) + ')';
		});
	
	// re-bind data
	var rect = grp.selectAll('rect')
		.data(function(d) { return d; });	
		
	// transitions
	rect
		.transition()
		.duration(1000)
		.attr('fill', function(d) { 
			return bep[x].colorMap(d[x]);
		})
		.attr('opacity', function(d) { 
			if (d[x]===0) return 0;
			return 1;
		})
		
	
		
	
		
	rect.enter()
		.append('rect')
			.attr('x', function(d, i) { 
				return (rw + p) * i; 
			})
			.attr('width', rw)
			.attr('height', rh)
			.attr('fill', function(d) {
				//if (d[x]===0) return '#dddddd';
				return bep[x].colorMap(d[x]);
			})
			.attr('opacity', function(d) { 
				if (d[x]===0) return 0;
				return 1;
			})
			
//			.on("mouseover", function(d,x,y) {
//					console.log("over", x,y);
//				})
			.on("mousedown", function(d,x,y) {
				mouseDown = true;
				values.f = map.f.i(x);
				values.d = map.d.i(y);
				updateIndicators();
			})
			.on("mouseup", function() {
				updateImages();
			})
			.on("mousemove", function(d,x,y) {
				if (mouseDown) {
					values.f = map.f.i(x);
					values.d = map.d.i(y);
					updateIndicators();
					updateImages();
				}
			});
}











