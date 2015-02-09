
var initOverview = function() {
	
	var width = 960, height = 570;
	var div = d3.select('#overview');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
	
	
	var f = ["a","b","c","d","e","f","g","h","i"];
	f.forEach(function(d, i) {
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
	});

	updateOverview();
	
}

var updateOverview = function() {
	
	
	
}
