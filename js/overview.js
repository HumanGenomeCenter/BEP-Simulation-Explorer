

var f = ["a","b","c","d","e","f","g","h","i"];
var overviewMatrix = {};
	
var initOverview = function() {
	
	var width = 960, height = 570;
	var div = d3.select('#overview');
	var svg = div.append('svg')
			.attr('width', width)
			.attr('height', height);
	
	

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
	
	// loop over S & R
	var s = [0.01, 0.1, 1].reverse();		// reversed 
	var r = [0.0001, 0.001, 0.01];
	
	// Preparing data
	r.forEach(function(vr,i) {
		s.forEach(function(vs,j) {
			overviewMatrix[f[i*3+j]] = data[map.s.value(vs)][map.r.value(vr)];
		});
	});

	updateOverview('ε');		// intial
	
}

var updateOverview = function(value) {
	
	f.forEach(function(d,i) {
		updateOverviewDisplay(d, value);
	});
		
	// updateImages();
}


var updateOverviewDisplay = function(x, value) {

//	console.log(x);
	var matrix = overviewMatrix[x];

	var rw = settings.boxWidth;
	var rh = settings.boxHeight;
	var p = settings.boxSpacing;
	// join

	var boxes = d3.select("g."+x+" g.boxes");  // select boxes
	var grp = boxes.selectAll('g')
		.data(matrix);
	
	grp.enter()
		.append('g')
		.attr('transform', function(d, i) {
			return 'translate(0,' + (rh + p) * (9-i) + ')';
		});
	
	// re-bind data
	var rect = grp.selectAll('rect')
		.data(function(d) { return d; });	
		
	// fading transitions
	rect
		.transition()
		.duration(slowShift)
		.attr('fill', function(d) { 
			return bep[value].colorMap(d[value]);
		})
		.attr('opacity', function(d) { 
			if (d[x]===0) return 0;
			return 1;
		});
		
	rect.enter()
		.append('rect')
			.attr('x', function(d, i) { 
				return (rw + p) * i; 
			})
			.attr('width', rw)
			.attr('height', rh)
			.attr('fill', function(d) {
				return bep[value].colorMap(d[value]);
			})
			.attr('opacity', function(d) { 
				if (d[x]===0) return 0;
				return 1;
			})

//			.on("mouseover", function(d,x,y) {
//					console.log("over", x,y);
//				})
			.on("mousedown", function(d,x,y) {
				mouseDown = true;
				values.f = map.f.i(x);
				values.d = map.d.i(y);
				updateIndicators();
			})
			.on("mouseup", function() {
				updateImages();
			})
			.on("mousemove", function(d,x,y) {
				if (mouseDown) {
					values.f = map.f.i(x);
					values.d = map.d.i(y);
					updateIndicators();
					updateImages();
				}
			});


}

