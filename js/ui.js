
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
	values[id] = value;
	setLabel(id, value);
	update();	
});

// f,d dropdown
$("#f .dropdown-menu > li > a").on('click', function(e) {
	e.preventDefault();
	var id = "f";
	var value = parseFloat( $(this).html() );
	$("#f .dropdown-toggle span").first().html(value); 		// update button
	values[id] = value;
	setLabel(id, value);
	updateIndicators();
	updateImages();
});

$("#d .dropdown-menu > li > a").on('click', function(e) {
	e.preventDefault();
	var id = "d";
	var value = parseFloat( $(this).html() );
	$("#d .dropdown-toggle span").first().html(value);		// update button
	
	values[id] = value;
	setLabel(id, value);
	updateIndicators();
	updateImages();
});




// scale
$("#abs .btn.btn-default").on('click', function(e) {	
	var v = $(this).children("input").val()
	if (v==="rel") settings.relative = true;
	if (v==="abs") settings.relative = false;
	update();
});
