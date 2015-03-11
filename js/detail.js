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
	updateParameterLimits();		// cache
	
	bep.fields.parameter.forEach(function(d, i) {
		updateGrids(d, matrix);
		updateViolinPlots(d, matrix);
	});
	
	updateImages();
}



// update Limits. interate over data, get [min, max] of all types
var updateParameterLimits = function() {
	// add caching layer	
	// find higest & lowest values
	
	// check cache
	
	var cache = bep.ranges[bep.s.indexOf(bep.values.s)][bep.r.indexOf(bep.values.r)];

	console.time("cache");
	if (!cache) cache = getRanges(bep.values.s, bep.values.r);
	console.timeEnd("cache");
	
	var absOrRel = bep.settings.relative ? "rel" : "abs";
	
	bep.fields.parameter.forEach(function(f) {
		var r = cache[f][absOrRel];
		bep[f].range = r; 
		bep[f].colorMap.domain(r);
	});	
	

}



var getRanges = function(s, r) {
	
	console.log("filling cache", s, r);
	
	var cache = bep.ranges[bep.s.indexOf(s)][bep.r.indexOf(r)] = {};
	
	
	// rel
	var relativeValues = [];
	var matrix = data[map.s.value(s)][map.r.value(r)];
	matrix.map(function(d) { 		// passed-in
		d.map(function(f) { 
			relativeValues.push(f);
		})
	});
	
	var absValues = []
	data.map(function(d) { 			// global
		d.map(function(f) { 
			f.map(function(g) {
				g.map(function(h) { 
					absValues.push(h);
				}) 
			})
		})
	});
		
	// update ranges & colorMaps for all fields
	bep.fields.parameter.forEach(function(f) {
		var relativeRange 	= [	d3.min(relativeValues, function(d) {return d[f]}), 
								d3.max(relativeValues, function(d) {return d[f]})	];
		var absRange 		= [	d3.min(absValues, function(d) {return d[f]}), 
								d3.max(absValues, function(d) {return d[f]})		];
		cache[f] = {rel:relativeRange, abs:absRange};
	});
	return cache;
}


