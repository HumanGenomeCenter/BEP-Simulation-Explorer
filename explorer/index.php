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
				<!-- <div class="btn btn-default">
					<input type="radio" name="options" value="missing">
					<span>Missing</span>
				</div>-->
			</div>

			
			<ul class="nav nav-tabs center" role="tablist">
				<li role="presentation" class="active"><a href="#parameter" id="tab_parameter" aria-controls="home" role="tab" data-toggle="tab">Parameter-centered View</a></li>
				<li role="presentation"><a href="#statistic" id="tab_statistic" aria-controls="profile" role="tab" data-toggle="tab">Statistic-centered View</a></li>
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
				Sorry, the experiment with value span>d=2, sf</span> did not yield any results.
			</p>
		</div>
	</div>
	
</div>


<div class="details">

	<div class="row values"></div>
	
	<div class="row mutprof">
		<div class="col-xs-6">
			<img src='../results/s0.01_r0.0001/d4_f0.8_1.mutprof.png'>
		</div>
		<div class="col-xs-6">
			<img src='../results/s0.01_r0.0001/d4_f0.8_1.mutprof.png'>
		</div>
	</div>
	
	<div class="row caption">
		<figcaption>
		<b>Mutation profile of each cell in a simulated tumor.</b>
		500 cells were sampled from the simulated tumor and their mutation profiles were shown as a clustered heatmap.
		Row and columns represent gene and cells, respectively. left blue bars indicate driver genes and top colored indicates each clone.
		</figcaption>
	</div>

	<div class="row tumor">
		<figure>
			<img src='../results/s0.01_r0.0001/d5_f0.8_2.tumor.png'>
		</figure>
	</div>
	
	<div class="row caption">
		<figcaption>
		<b>The simulated tumor.</b>
		 Each clone was colored  according to top colored bar of the mutation profile heatmap.
		</figcaption>
	</div>

	<div class="row pc">
		<figure>
			<img src='../results/s0.01_r0.0001/d5_f0.8_2.pc.png'>
		</figure>
	</div>

	<div class="row caption">
		<figcaption>
			<b>A principal component plot of cells.</b>
			Principal component analysis was applied to the mutation profiles and 
			each cell was plotted based on loadings of the top three principal components.
			Note that colors of each clone was obtained from the three dimensional coordinates.
		</figcaption>
	</div>

	<div class="row selfsim">
		<figure>
			<img src='../results/s0.01_r0.0001/d5_f0.8_2.selfsim.png'>
		</figure>
	</div>

	<div class="row caption">
		<figcaption>
			<b> Self similality of the cell-wise dendrogram. </b>
			From the cell-wise dendrogram of the mutation profile heatmap, 
			we obtained <i>b</i> clusters by cutting the dendrogram at the height <i>a</i>. the relationship between <i>a</i> and <i>b</i> was plotted in log scale.
			vertical and horizontal axes denote <i>b</i> and <i>a</i>, respectively. Since their linear relationship indicates self similality,
			we performed linear regression between <i>log</i>(<i>b</i>) and <i>log</i>(<i>a</i>), and assumed that the dendrogram has self-similarity if R<sup>2</sup> &gt 0.95
		</figcaption>
	</div>

	<div class="row cellsim">
		<figure>
			<img src='../results/s0.01_r0.0001/d5_f0.8_2.cellsim.png'>
		</figure>
	</div>

	<div class="row caption">
		<figcaption>
			<b> Genetic distance matrix among cells.</b>
			Distance between each pair of cells was calculated from the mutation profiles and presented as a heatmap.  
		</figcaption>
	</div>

	<div class="row alfrq">
		<figure>
			<img src='../results/s0.01_r0.0001/d5_f0.8_2.alfrq.png'>
		</figure>
	</div>

	<div class="row caption">
		<figcaption>
			<b>A histogram of the mutant cell frequencies.</b>
			For each gene, a fraction of mutated cells was calculated and the distribution was presented as the histogram.
		</figcaption>
	</div>

</div>


<?php 

$addlJS = "";
$addlJS .= '<script src="'.$path.'js/simex.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/ui.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/detail.js"></script>'."\n";
$addlJS .= '<script src="'.$path.'js/overview.js"></script>'."\n";

include("../footer.php"); ?>