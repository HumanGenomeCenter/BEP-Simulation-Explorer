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
	
	updateDetails();
}



// absolute/relative update
var updateDetails = function() {
	var matrix = data[map.s.value(bep.values.s)][map.r.value(bep.values.r)];
	
	getLimits(matrix);		// cache
	
	bep.fields.parameter.forEach(function(d, i) {
		updateGrids(d, matrix);
		updateViolinPlots(d, matrix);
	});
	
	updateImages();
}



