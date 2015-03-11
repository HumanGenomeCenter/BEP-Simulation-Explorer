var initDetails = function() {
	
	var width = 960, height = 380;
	var div = d3.select('#details');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	svg.append("defs");		// for gradients
				
	bep.fields.parameter.forEach(function(d, i) {
		var x = 45 + (i%3)*320;			// padding
		var y = (i<3) ? 0 : 180;
		bep[d].g = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');
		bep[d].g.append('g').attr('class', 'boxes');
		var matrix = data[map.s.value(bep.values.s)][map.r.value(bep.values.r)];	// init
		drawScales(bep[d].g);
		initViolinPlots(d, matrix);
	});
	
	updateParameterView();	// initial
}



// absolute/relative update
var updateParameterView = function() {
	console.log("updateDetails");
	
	// get matrix data
	var matrix = data[map.s.value(bep.values.s)][map.r.value(bep.values.r)];
	
	// update limits
	updateParameterLimits(matrix);		// cache
	
	bep.fields.parameter.forEach(function(d, i) {
		updateGrids(d, matrix);
		updateViolinPlots(d, matrix);
	});
	
	updateImages();
}



// update Limits. interate over data, get [min, max] of all types
var updateParameterLimits = function(matrix) {
	// add caching layer
	var linear = [];
	
	// find higest & lowest values
	
	// relative
	if (bep.settings.relative) {		
		matrix.map(function(d) { 		// passed-in
			d.map(function(f) { 
				linear.push(f);
			})
		});
		
	// absolute
	} else {
		data.map(function(d) { 			// global
			d.map(function(f) { 
				f.map(function(g) {
					g.map(function(h) { 
						linear.push(h);
					}) 
				})
			})
		});
	}

	// update ranges & colorMaps
	bep.fields.parameter.forEach(function(f) {
		var min = d3.min(linear, function(d) {return d[f]});
		var max = d3.max(linear, function(d) {return d[f]});
		bep[f].range = [min, max]; 
		bep[f].colorMap.domain([min, max]);
	});
}


