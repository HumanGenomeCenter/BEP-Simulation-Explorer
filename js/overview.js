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
			var index = bep.fields.statistics[i*r.length+j];
			bep[index].matrix = data[map.s.value(vs)][map.r.value(vr)];
		});
	});
			
	bep.overviewValue = 'ε';
	bep.fields.statistics.forEach(function(d, i) {
		var x = 45 + (i%3)*320;
		var y = 0;
		
		if (i>=3 && i<6) {
			y = 180;
		} else if (i>=6) {
			y = 360;
		}
		
		bep[d].g = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');
		bep[d].g.append('g').attr('class', 'boxes');
		drawScales(bep[d].g);
		initViolinPlots(d, bep[d].matrix, bep.overviewValue);
	});
	
	updateOverview();		// intial
	
}

var updateOverview = function(value) {
	if (value===undefined) value = bep.overviewValue;
	bep.fields.statistics.forEach(function(d,i) {
		updateOverviewGrids(d, value);
		updateViolinPlots(d, bep[d].matrix, value);
	});
	//updateImages();
}


var updateOverviewGrids = function(x, value) {

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
			.on("mousedown", gridMouseDown)
			.on("mouseup", gridMouseUp)
			.on("mousemove", gridMouseMove);

}



