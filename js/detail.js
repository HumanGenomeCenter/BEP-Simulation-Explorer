
var g = {};
var srMatrix;
var mouseDown = false;

var initDetails = function() {
	
	var width = 960, height = 380;
	var div = d3.select('#details');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
			
	fields.forEach(function(d, i) {
		var x = 45 + (i%3)*320;
		var y = (i<3) ? 0 : 180;
		g[d] = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');
		g[d].append('g').attr('class', 'boxes');
		drawScales(g[d]);
	});
	
	
	
	srMatrix = data[map.s.value(values.s)][map.r.value(values.r)];
	
	getLimits(srMatrix);
	
	fields.forEach(function(d, i) {
		updateDisplay(d);
	});
	
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
		
	// fading transitions
	rect
		.transition()
		.duration(slowShift)
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











