var initOverview = function() {
	
	var width = 960, height = 670;
	var div = d3.select('#overview');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);

	svg.append("defs");		// needed for gradients
	

	// Preparing data
	bep.r.forEach(function(vr,i) {
		bep.s.forEach(function(vs,j) {		// reverse s...
			var index = bep.fields.statistics[i*bep.r.length+j];
			bep[index].r = vr;
			bep[index].s = vs;
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
		
		y=y+30;	// additional padding to accomodate S,R legend
		
		if (i<3) {
			svg.append('text')
				.attr("class", "legend")
				.text("S = " + bep.s[i])
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate('+(135 + i*320)+',14)');
		}
		
		bep[d].g = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');
		bep[d].g.append('g').attr('class', 'boxes');
		drawScales(bep[d].g);
		initViolinPlots(d, bep[d].matrix, bep.overviewValue);
	});
	
	updateStatisticsView();		// intial
}

var updateStatisticsView = function(value) {
	if (value===undefined) value = bep.overviewValue;
	console.log("updateOverview", value);
	
	// update limites
	

	bep.fields.statistics.forEach(function(d,i) {
		
		
		var matrix = bep[d].matrix;
		updateStatisticsLimits(d, value);
		
		updateGrids(d, matrix, value);
		updateViolinPlots(d, bep[d].matrix, value);
	});
	//updateImages();
}


var updateStatisticsLimits = function(d, value) {
	var ranges = bep.ranges[bep.s.indexOf(bep[d].s)][bep.r.indexOf(bep[d].r)];	
	var absOrRel = bep.settings.relative ? "rel" : "abs";	
	var r = ranges[value][absOrRel];
	bep[d].range = r;
	bep[d].colorMap = bep[value].colorMap;		// get colorMap for value
	bep[d].colorMap.domain(r);
}




