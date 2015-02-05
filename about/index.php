<?php
$path = "../";
include("../header.php");
?>

	<div class="row">
		
		<div role="tabpanel">
			<!-- Nav tabs -->
			<ul class="nav nav-tabs" role="tablist">
				<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>
				<li role="presentation" ><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Overview</a></li>
				<li role="presentation"><a href="#about" aria-controls="about" role="tab" data-toggle="tab">About</a></li>
			</ul>
		</div>

	</div>
	
	<!-- Tab About -->
	<div role="tabpanel" class="tab-pane" id="about">about.
	
	</div>
	
	
	<!-- Tab Overview -->
	<div role="tabpanel" class="tab-pane" id="profile">
		
		<div class="row">
			<div class="col-xs-12">
				<div id="overview" width="100%" height="500px"></div><!-- svg container -->
			</div>
		</div>
		
		<div class="row">
			<div class="col-xs-12">
				<img src="../results/heatmap/founderMutationCount.jpg">
			</div>
		</div>
		
	</div>
	
	<!-- Tab About -->
	<div role="tabpanel" class="tab-pane" id="about">about.
	
	</div>
</div>


</div>

<br />
<br />

<script src="../js/d3.min.js"></script>
<script src="../js/jquery-2.0.3.min.js"></script>
<script src="../js/bootstrap.min.js"></script>



</body>
</html>