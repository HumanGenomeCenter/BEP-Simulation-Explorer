
// UI Helper Functions
var setLabel = function(id, val) {
	$("#"+id+"_label").html(val);
}


// Parameter UI
$("#tab_parameter").click(function() {
	bep.settings.view = "parameter";
	console.log("view", bep.settings.view);
	updateIndicators();
});

// buttons
$("#r .btn.btn-default, #s .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var id = $(this).parent().attr('id')
	var value = parseFloat( $(this).find("span").html() );
	bep.values[id] = value;
	setLabel(id, value);
	updateParameterView();	
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
	bep.settings.view = "statistics";
	console.log("view", bep.settings.view);
	updateIndicators();
});

$(".selection-overview .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var v = $(this).data('value');
	bep.overviewValue = v;
	updateStatisticsView(v);
});

// Absolute/Relative Scale Button
$("#abs .btn.btn-default").on('click', function(e) {	
	var v = $(this).children("input").val()
	bep.settings.relative = (v==="rel") ? true : false;
	if (bep.settings.view==="parameter") { updateParameterView() }
	else if (bep.settings.view==="statistics") { updateStatisticsView() };
	
});

// Settings Show/Hide



$("#settings .btn").on('click', function(e) {
	e.preventDefault();	
	var p = $("#panel-settings");
	if (p.is(':hidden')) {
		p.slideDown(500);
	} else {
		p.slideUp(500);
	}
});

// Anmations On/Off
$("#animation .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var v = $(this).children("input").val()
	bep.settings.animation = (v==="on") ? true : false;
	bep.settings.duration = bep.settings.animation ? bep.settings.durationNormal : 0;
});


// Grid Interactions
var gridMouseDown = function(d,x,y) {
	bep.mouseDown = true;
	bep.values.f = map.f.i(x);
	bep.values.d = map.d.i(y);
	console.log("mouse down", d);
	updateIndicators(d);
}

var gridMouseUp = function(d,x,y) {
	updateImages();
}

var gridMouseMove = function(d,x,y) {
	if (bep.mouseDown) {
		bep.values.f = map.f.i(x);
		bep.values.d = map.d.i(y);
		updateIndicators(d);
		updateImages();
	}
}






// Slow fading
$(window).on("keydown", function(e) {
	if (e.shiftKey) {
		bep.shiftKey = true;
		bep.settings.duration = bep.settings.durationSlow;
	}
});

$(window).on("keyup", function(e) {
	if (bep.shiftKey) {
		bep.shiftKey = false;
		bep.settings.duration = bep.settings.animation ? bep.settings.durationNormal : 0;		
	}
});

