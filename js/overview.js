
var initOverview = function() {
	
	var width = 960, height = 380;
	var div = d3.select('#overview');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
			
	d3.select('body').on("mouseup", function() { mouseDown = false; });		// general mouseup handler
	
	console.log(svg);
}
