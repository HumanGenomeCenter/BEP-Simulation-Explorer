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
	getAbsoluteRanges();		// pre-compute
}

var updateStatisticsView = function(value) {
	if (value===undefined) value = bep.overviewValue;
	console.log("updateOverview", value);
	
	// update limites
	updateStatisticsLimits();
	
	bep.fields.statistics.forEach(function(d,i) {
		var matrix = bep[d].matrix;
		updateGrids(d, matrix, value);
		updateViolinPlots(d, bep[d].matrix, value);
	});
	//updateImages();
}


var updateStatisticsLimits = function() {
	console.log("updateStatisticsLimits");
	
}


var getAbsoluteRanges = function() {
	
	var linear = [];
	console.time("abs");
	// serialise all matrices
	bep.fields.statistics.forEach(function(m) {		
		bep[m].matrix.map(function(d) { 		// passed-in
			d.map(function(f) { 
				linear.push(f);
			})
		});
	});
	
	bep.fields.parameter.forEach(function(f) {
		var min = d3.min(linear, function(d) {return d[f]});
		var max = d3.max(linear, function(d) {return d[f]});
		bep[f].absoluteRange = [min, max]; 
		console.log(f, [min, max] );
	});
	
	console.timeEnd("abs");	
	
}

