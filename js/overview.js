// var overviewFields = ['a','b','c','d','e','f','g','h','i']; defined in simex.js
	
var initOverview = function() {
	
	var width = 960, height = 570;
	var div = d3.select('#overview');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);

	svg.append("defs");		// for gradients
	
	// loop over S & R
	var s = [0.01, 0.1, 1].reverse();		// reversed 
	var r = [0.0001, 0.001, 0.01];

	// Preparing data
	r.forEach(function(vr,i) {
		s.forEach(function(vs,j) {
			var index = overviewFields[i*r.length+j];
			bep[index].matrix = data[map.s.value(vs)][map.r.value(vr)];
		});
	});
			
	overviewFields.forEach(function(d, i) {
		var x = 45 + (i%3)*320;
		var y = 0;
		
		if (i>=3 && i<6) {
			y = 180;
		} else if (i>=6) {
			y = 360;
		}
		
		g[d] = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');
		g[d].append('g').attr('class', 'boxes');
		drawScales(g[d]);
		initViolinPlots(d, bep[d].matrix, 'ε');
	});
	
	updateOverview('ε');		// intial
	
}

var updateOverview = function(value) {
	
	overviewFields.forEach(function(d,i) {
		updateOverviewDisplay(d, value);
		updateViolinPlots(d, bep[d].matrix, value);
	});
	// updateImages();
}


var updateOverviewDisplay = function(x, value) {

	var rw = bep.settings.boxWidth;
	var rh = bep.settings.boxHeight;
	var p = bep.settings.boxSpacing;
	// join

	var boxes = d3.select("g."+x+" g.boxes");  // select boxes
	var grp = boxes.selectAll('g')
		.data(bep[x].matrix);
	
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
			return bep[value].colorMap(d[value]);
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
				return bep[value].colorMap(d[value]);
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

