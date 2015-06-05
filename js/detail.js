var initDetails = function() {
	
	var width = 1020, height = 380;
	var div = d3.select('#details');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
				
	var defs = svg.append("defs");		// create definition for gradients

	bep.fields.parameter.forEach(function(d, i) {
		var x = 85 + (i%3)*320;			// padding
		var y = (i<3) ? 0 : 180;
		y=y+30;	// additional padding to accomodate legend
		
		svg.append('text')
			.attr("class", "legend")
			.text(bep.labelData[d])
			.attr('text-anchor', 'middle')
			.attr('transform', 'translate('+(x+90)+','+(y-10)+')');
			
		initGradients(defs, d);		// one gradient for each parameter
		
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
	
	// update view
	if (bep.settings.view==="parameter") {
	
		// get matrix data
		var matrix = data[map.s.value(bep.values.s)][map.r.value(bep.values.r)];
	
		// update limits
		getParameterLimits();		// cache
	
		bep.fields.parameter.forEach(function(d, i) {
			updateGrids(d, matrix);
			updateViolinPlots(d, matrix);
		});
	
		updateImages();
		
	// keep view in sync
	} else {
		
	}
}


var getParameterLimits = function() {	
	var ranges = bep.ranges[bep.s.indexOf(bep.values.s)][bep.r.indexOf(bep.values.r)];	
	bep.fields.parameter.forEach(function(f) {
		var r = ranges[f][bep.settings.valuesView];
		bep[f].range = r; 
		bep[f].colorMap.domain(r);
	});	
}




