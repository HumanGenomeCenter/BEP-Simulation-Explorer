<?php


$s = $_GET['s'];
$r = $_GET['r'];
$d = $_GET['d'];
$f = $_GET['f'];
$id= $_GET['id'];
$e = $_GET['e'];
$o = $_GET['o'];
$l = $_GET['l'];
$m = $_GET['m'];
$rho = $_GET['rho'];
$t = $_GET['t'];

$path = "s".$s."_r".$r."/d".$d."_f".$f."_".$id;

?>
<head>
	<meta charset="utf-8">
	<title>BEP Simulation Explorer</title>
	<link rel="stylesheet" href="../css/bootstrap.min.css" charset="utf-8">
	<link rel="stylesheet" href="../css/bootstrap-theme.min.css" charset="utf-8">
	<link rel="stylesheet" href="../css/font-awesome.min.css" type='text/css'>
	<link rel="stylesheet" href="../css/bep.css" type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,700,800' rel='stylesheet' type='text/css'>
</head>

<body>
<div class="popup">
	<div class="page-header">
		<h1>B.E.P</h1>
		<h2>How Cancer evolution simulation identifies possible principles 
			underlying intratumor heterogeneity</h2>
	</div>	

	<div class="row values">
		<table class="table table-striped table-bordered">
			<tr><td>s:</td><td><?php echo $s; ?></td></tr>
			<tr><td>r:</td><td><?php echo $r; ?></td></tr>
			<tr><td>d:</td><td><?php echo $d; ?></td></tr>
			<tr><td>f:</td><td><?php echo $f; ?></td></tr>
			<tr><td>Variations:</td><td><?php
				$arr = array(0,1,2,3,4);
				foreach($arr as $a) {
					if ($a == $id) {
						echo $a;
					} else {
						$link = "../explorer/details.php?s=$s&r=$r&d=$d&f=$f&id=$a&e=$e&o=$o&l=$l&m=$m&rho=$rho&t=$t";
						echo " <a href='".$link."'>$a</a>\n";
					}
				}
				
				
			?></td></tr>
			<tr><td></td><td></td></tr>
			<tr><td>Population Entropy (ε):</td><td><?php echo $e; ?></td></tr>
			<tr><td>Founder Mutation Count (μ):</td><td><?php echo $m; ?></td></tr>
			<tr><td>Average Mutation Count (ρ):</td><td><?php echo $rho; ?></td></tr>
			<tr><td>Population Fitness (λ):</td><td><?php echo $l; ?></td></tr>
			<tr><td>Growth Time (τ):</td><td><?php echo $t; ?></td></tr>
			<tr><td>Self-similarity (θ):</td><td><?php echo $o; ?></td></tr>
		</table>
	</div>
	
	<div class="row mutprof">
		<div class="col-xs-12">
			<img src="../results/<?php echo $path;?>.mutprof.png">
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
			<img src='../results/<?php echo $path;?>.tumor.png'>
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
			<img src='../results/<?php echo $path;?>.pc.png'>
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
			<img src='../results/<?php echo $path;?>.selfsim.png'>
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
			<img src='../results/<?php echo $path;?>.cellsim.png'>
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
			<img src='../results/<?php echo $path;?>.alfrq.png'>
		</figure>
	</div>

	<div class="row caption">
		<figcaption>
			<b>A histogram of the mutant cell frequencies.</b>
			For each gene, a fraction of mutated cells was calculated and the distribution was presented as the histogram.
		</figcaption>
	</div>

</div>
</body>
</html>