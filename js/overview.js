var initOverview = function() {
	
	var width = 1020, height = 550;
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
	
	var labelY = 0;
	bep.fields.statistics.forEach(function(d, i) {
		var x = 85 + (i%3)*320;
		var y = 0;
		
		if (i>=3 && i<6) {
			y = 180;
		} else if (i>=6) {
			y = 360;
		}
		
		y=y+30;	// additional padding to accomodate S,R legend
		
		bep[d].g = svg.append('g')
				.attr('class', d)
				.attr('transform', 'translate('+x+','+y+')');

		// init background highlight
		bep[d].g.append('rect')
				.attr('class', 'background-highlight')
				.attr('width', 319)
				.attr('height', 179)
				.attr('rx', 20)
				.attr('ry', 20)
				.attr('transform', 'translate(-45,-25)');		
		
		// Horizontal Lables
		if (i<3) {
			svg.append('text')
				.attr("class", "legend")
				.text("s = " + bep.s[i])
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate('+(x+90)+','+(y-10)+')');
		}
		
		// Vertical Labels
		if ((i%3)===0) {
			svg.append('text')
				.attr("class", "legend")
				.text("r = " + bep.r[labelY++])
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(17,'+(y+55)+'), rotate(-90)');
			
		}
				
		bep[d].g.append('g').attr('class', 'boxes');
		drawScales(bep[d].g);
		initViolinPlots(d, bep[d].matrix, bep.overviewValue);
	});
	
	updateStatisticsView();		// intial
	readyStatisticsMouseOver(); 	// init statistcs mouseover event listener	
	
}

var updateStatisticsView = function(value) {
	
	if (bep.settings.view!=="statistics") {
		
	}
	
	
	if (value===undefined) value = bep.overviewValue;

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
	var r = ranges[value][bep.settings.valuesView];
	bep[d].range = r;
	bep[d].colorMap = bep[value].colorMap;		// get colorMap for value
	bep[d].colorMap.domain(r);
}




