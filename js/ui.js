
// UI Helper Functions
var setLabel = function(id, val) {
	$("#"+id+"_label").html(val);
}


// Parameter UI
$("#tab_parameter").click(function() {
	bep.parameter = true;
});

// buttons
$("#r .btn.btn-default, #s .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var id = $(this).parent().attr('id')
	var value = parseFloat( $(this).find("span").html() );
	bep.values[id] = value;
	setLabel(id, value);
	updateDetails();	
});

// f,d dropdown
$("#f .dropdown-menu > li > a").on('click', function(e) {
	e.preventDefault();
	var id = "f";
	var value = parseFloat( $(this).html() );
	$("#f .dropdown-toggle span").first().html(value); 		// update button
	bep.values[id] = value;
	setLabel(id, value);
	updateIndicators();
	updateImages();
});

$("#d .dropdown-menu > li > a").on('click', function(e) {
	e.preventDefault();
	var id = "d";
	var value = parseFloat( $(this).html() );
	$("#d .dropdown-toggle span").first().html(value);		// update button
	
	bep.values[id] = value;
	setLabel(id, value);
	updateIndicators();
	updateImages();
});




// Statisic-centered View UI

$("#tab_statistic").click(function() {
	bep.parameter = false;
});

$(".selection-overview .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var v = $(this).data('value');
	bep.overviewValue = v;
	updateOverview(v);
});




// Absolute/Relative Scale Button

$("#abs .btn.btn-default").on('click', function(e) {	
	var v = $(this).children("input").val()
	bep.settings.relative = (v==="rel") ? true : false;
	if (bep.parameter) {
		updateDetails();
	} else {
		updateOverview();
	}
	
});



// Grid Interactions

var gridMouseDown = function(d,x,y) {
	bep.mouseDown = true;
	bep.values.f = map.f.i(x);
	bep.values.d = map.d.i(y);
	updateIndicators();
}

var gridMouseUp = function(d,x,y,z) {
	console.log(d,x,y,z, this);
	updateImages();
}

var gridMouseMove = function(d,x,y) {
	if (bep.mouseDown) {
		bep.values.f = map.f.i(x);
		bep.values.d = map.d.i(y);
		updateIndicators();
		updateImages();
	}
}




// Slow fading

$(window).on("keydown", function(e) {
	bep.shiftKey = e.shiftKey;
});

$(window).on("keyup", function(e) {
	bep.shiftKey = e.shiftKey
});

var slowShift = function() {
	if (bep.shiftKey) return 3000;
	return 1000;
}
