<?php 
$path = "../";
include("../header.php");
?>

<div class="row">
	<div class="col-xs-12" id="panel-settings">
		<div class="panel panel-primary">
			<div class="panel-heading">Settings</div>
			<div class="panel-body">
				<div id="animation" class="btn-group" data-toggle="buttons">
					<div class="btn btn-label">
						<span>Animations</span>
					</div>
					<div class="btn btn-default active">
						<input type="radio" name="options" value="on">
						<span>On</span>
					</div>
					<div class="btn btn-default ">
						<input type="radio" name="options" value="off">
						<span>Off</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-xs-12">
		<div role="tabpanel">
			<!-- Nav tabs -->
			
			<div id="settings" class="btn-group" data-toggle="buttons" style="float:right">
				<div class="btn btn-default">
					<a href="#"><i class="fa fa-cog fa-lg"></i></a>
				</div>
			</div>
			
			<div id="abs" class="btn-group" data-toggle="buttons" style="float:right">
				<div class="btn btn-label">
					<span>Scale</span>
				</div>
				<div class="btn btn-default">
					<input type="radio" name="options" value="abs">
					<span>Absolute</span>
				</div>
				<div class="btn btn-default active">
					<input type="radio" name="options" value="rel">
					<span>Relative</span>
				</div>
			</div>

			
			<ul class="nav nav-tabs center" role="tablist">
				<li role="presentation" class="active"><a href="#parameter" id="tab_parameter" aria-controls="home" role="tab" data-toggle="tab">Parameter-centered View</a></li>
				<li role="presentation"><a href="#statistic" id="tab_statistic" aria-controls="profile" role="tab" data-toggle="tab">Statistic-centered View</a></li>
				<li><a href="#help" id="tab_help">Help</a></li>
			</ul>
		</div>
	</div>
</div>
	

<!-- Tab panes -->
<div class="tab-content">
	<div role="tabpanel" class="tab-pane active" id="parameter">
<?php include("parameter-centric.php"); ?>
	</div>

	<!-- Tab Overview -->
	<div role="tabpanel" class="tab-pane" id="statistic">
<?php include("statistics-centric.php"); ?>
	</div>
	
	<div class="row results">
		<div class="col-xs-12">
			Simulation Instances: <em>(click for more details)</em>
			<br/><br/>
		</div>
		<div class="col-xs-2">
			<a href="#" data-id="0">
				<img class="tumor" src="../results/s0.01_r0.0001/d5_f0.8_0.tumor.png">
				<img class="mutprof" src="../results/s0.01_r0.0001/d5_f0.8_0.mutprof.png">
			</a>
			<div class="line"></div>
		</div>
		<div class="col-xs-2">
			<a href="#" data-id="1">
				<img class="tumor" src="../results/s0.01_r0.0001/d5_f0.8_1.tumor.png">
				<img class="mutprof" src="../results/s0.01_r0.0001/d5_f0.8_1.mutprof.png">
			</a>
			<div class="line"></div>
		</div>
		<div class="col-xs-2">
			<a href="#" data-id="2">
				<img class="tumor" src="../results/s0.01_r0.0001/d5_f0.8_2.tumor.png">
				<img class="mutprof" src="../results/s0.01_r0.0001/d5_f0.8_2.mutprof.png">
			</a>
			<div class="line"></div>
		</div>
		<div class="col-xs-2">
			<a href="#" data-id="3">
				<img class="tumor" src="../results/s0.01_r0.0001/d5_f0.8_3.tumor.png">
				<img class="mutprof" src="../results/s0.01_r0.0001/d5_f0.8_3.mutprof.png">
			</a>
			<div class="line"></div>
		</div>
		<div class="col-xs-2">
			<a href="#" data-id="4">
				<img class="tumor" src="../results/s0.01_r0.0001/d5_f0.8_4.tumor.png">
				<img class="mutprof" src="../results/s0.01_r0.0001/d5_f0.8_4.mutprof.png">
			</a>
			<div class="line"></div>
		</div>
	</div>
	
	<div class="row results-placeholder" style="display:none">
		<div class="col-xs-12">
			<p class="text-center">
				Sorry, the experiment did not yield any results.
			</p>
		</div>
	</div>
	
</div>


<!-- Modal -->
<div class="modal fade" id="detailsModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="modalLabel">Details</h4>
			</div>
			<div class="modal-body">
				<?php include("modal.php"); ?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>

<!-- Help Modal -->
<div class="modal fade" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="modalHelpLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="modalHelpLabel">Help</h4>
			</div>
			<div class="modal-body">
				<?php include("help.php"); ?>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>



<?php 

$addlJS = "";
$addlJS .= '<script src="'.$path.'js/simex.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/ui.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/detail.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/overview.js"></script>'."\n";

include("../footer.php"); ?>