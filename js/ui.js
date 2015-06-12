
// UI Helper Functions
var updateLabels = function() {
	$("#d .dropdown-toggle span").first().html(bep.values.d);		// update button
	$("#f .dropdown-toggle span").first().html(bep.values.f); 		// update button
	// deselect & select
	var s = bep.s.indexOf(bep.values.s);	// get index
	var r = bep.r.indexOf(bep.values.r);	// get index
	$("#s .btn-default").removeClass("active").eq(s).addClass("active");
	$("#r .btn-default").removeClass("active").eq(r).addClass("active");
	
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
	updateLabels();
	updateParameterView();
	updateImages();
		
});

// f,d dropdown
$("#f .dropdown-menu > li > a").on('click', function(e) {
	e.preventDefault();
	bep.values["f"] = parseFloat( $(this).html() );
	updateLabels();
	updateIndicators();
	updateImages();
});

$("#d .dropdown-menu > li > a").on('click', function(e) {
	e.preventDefault();
	bep.values["d"] = parseFloat( $(this).html() );
	updateLabels();
	updateIndicators();
	updateImages();
});




// Statisic-centered View UI

$("#tab_statistic").click(function() {
	bep.settings.view = "statistics";
	updateIndicators();
	updateStatisticsView();
});

$(".selection-overview .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var v = $(this).data('value');
	bep.overviewValue = v;
	updateStatisticsView(v);
});

// Absolute/Relative Scale Button
$("#abs .btn.btn-default").on('click', function(e) {	
	var v = $(this).children("input").val();
	
	if (v==='missing') {
		bep.settings.missingView = true;
	} else {
		bep.settings.missingView = false;
		bep.settings.valuesView = v;		// rel, abs or missing
	}
	
	updateParameterView();
	updateStatisticsView();
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


// Help Modal
$('a#tab_help').on('click', function(e) {
	e.preventDefault();
	$('#helpModal').modal();
});




var allValesAreNull = function(d) {
	return ![d.ε, d.λ, d.μ, d.ρ, d.τ].reduce(function(a,b){return a||b});
}

// Grid Interactions
var gridMouseDown = function(d,x,y) {

	d3.select(this).classed("hover", true);
	
	console.log(d,x,y);
	bep.allValuesAreNull = allValesAreNull(d) ? true : false;
	
	bep.mouseDown = true;
	bep.values.f = map.f.i(x);
	bep.values.d = map.d.i(y);
	
	if (bep.settings.view==="statistics") {
		// update r&s
		var b = bep[bep.statisticsOver]
		bep.values.r = b.r;
		bep.values.s = b.s;
		// update labels
		updateLabels();
	}
	updateIndicators(d);
}

var gridMouseUp = function(d,x,y) {
	d3.select(this).classed("hover", false);
	updateImages();
}

var gridMouseMove = function(d,x,y) {
	if (bep.mouseDown) {
		d3.select(this).classed("hover", true);
		bep.values.f = map.f.i(x);
		bep.values.d = map.d.i(y);
		updateIndicators(d);
		updateImages();
	}
}

// add event listener, get class, temp store in bep.statisticsOver, on mousedown update s&r
var readyStatisticsMouseOver = function() {	 
	$("#statistic svg > g").on('mouseover', function(e, d) {
		bep.statisticsOver = $(this).attr('class');
	});
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

