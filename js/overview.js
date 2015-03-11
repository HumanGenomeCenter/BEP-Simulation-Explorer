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
	
	updateStatisticsView();		// intial
}

var updateStatisticsView = function(value) {
	if (value===undefined) value = bep.overviewValue;
	console.log("updateOverview", value);
	
	// update limites
	updateStatisticsLimits(value);
	
	bep.fields.statistics.forEach(function(d,i) {
		var matrix = bep[d].matrix;
		updateGrids(d, matrix, value);
		updateViolinPlots(d, bep[d].matrix, value);
	});
	//updateImages();
}


var updateStatisticsLimits = function(value) {
	console.log("updateStatisticsLimits", value);
	
	var cache = bep.ranges[bep.s.indexOf(bep.values.s)][bep.r.indexOf(bep.values.r)];
	console.log("cache", cache);
	
}




