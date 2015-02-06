<?php 
$path = "../";
include("../header.php");
?>


<div class="row">
	
	<div class="col-xs-12">
		<div role="tabpanel">
			<!-- Nav tabs -->
			<ul class="nav nav-tabs center" role="tablist">
				<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Details</a></li>
				<li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Overview</a></li>
			</ul>
		</div>
	</div>
	
</div>

<!-- Tab panes -->
<div class="tab-content">
	<div role="tabpanel" class="tab-pane active" id="home">
<?php include("detail.php"); ?>
	</div>

	<!-- Tab Overview -->
	<div role="tabpanel" class="tab-pane" id="profile">
<?php include("overview.php"); ?>
	</div>
</div>

<?php 

$addlJS = '<script src="'.$path.'js/detail.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/overview.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/ui.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/simex.js"></script>'."\n";

include("../footer.php"); ?>