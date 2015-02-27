
var g = {};
var mouseDown = false;

var initDetails = function() {
	
	var width = 960, height = 380;
	var div = d3.select('#details');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	svg.append("defs");		// for gradients
				
	fields.forEach(function(d, i) {
		var x = 45 + (i%3)*320;			// padding
		var y = (i<3) ? 0 : 180;
		g[d] = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');
		g[d].append('g').attr('class', 'boxes');
		var matrix = data[map.s.value(bep.values.s)][map.r.value(bep.values.r)];	// init
		drawScales(g[d]);
		initViolinPlots(d, matrix);
	});
	
	updateDetails();
}



// absolute/relative update
var updateDetails = function() {
	
	var matrix = data[map.s.value(bep.values.s)][map.r.value(bep.values.r)];
	
	getLimits(matrix);		// cache
	
	fields.forEach(function(d, i) {
		updateDetailGrids(d, matrix);
		updateViolinPlots(d, matrix);
	});
	
	updateImages();
}




var updateDetailGrids = function(x, matrix) {

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
		.attr('fill', function(d) { 
			return bep[x].colorMap(d[x]);
		})
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
				bep.values.f = map.f.i(x);
				bep.values.d = map.d.i(y);
				updateIndicators();
			})
			.on("mouseup", function() {
				updateImages();
			})
			.on("mousemove", function(d,x,y) {
				if (mouseDown) {
					bep.values.f = map.f.i(x);
					bep.values.d = map.d.i(y);
					updateIndicators();
					updateImages();
				}
			});
}











