
// UI Helper Functions
var setLabel = function(id, val) {
	$("#"+id+"_label").html(val);
}


// Details UI

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




// scale
$("#abs .btn.btn-default").on('click', function(e) {	
	var v = $(this).children("input").val()
	if (v==="rel") bep.settings.relative = true;
	if (v==="abs") bep.settings.relative = false;
	updateDetails();
});

// Checking for shift key down
var shiftKey = false;
$(window).on("keydown", function(e) {
	shiftKey = e.shiftKey;
});

$(window).on("keyup", function(e) {
	shiftKey = e.shiftKey
});


// Overview UI


// buttons
$(".selection-overview .btn.btn-default").on('click', function(e) {
	e.preventDefault();
	var v = $(this).data('value');
	updateOverview(v);
});



// Fading
var slowShift = function() {
	if (shiftKey) return 3000;
	return 1000;
}
		