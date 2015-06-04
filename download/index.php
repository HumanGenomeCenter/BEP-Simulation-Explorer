<?php
$path = "../";
include("../header.php");
?>

<div class="row">
	
	<div class="col-xs-12">
		<p class="content1">
			Our simulation code is available from <a href="../code/src.tar.gz">here</a>.  
		</p>
		<p class="content1">
			The simulation results are  available as tsv files.
			<ul class="content2">
				<li>
					<a href="../data/tsv/populationEntropy.tsv">ε: Population Entropy</a>
				</li>
				<li>
					<a href="../data/tsv/founderMutationCount.tsv">μ: Founder Mutation Count</a>
				</li>
				<li>
					<a href="../data/tsv/averageMutationCount.tsv">ρ: Average Mutation Count</a>
				</li>
				<li>
					<a href="../data/tsv/populationFitness.tsv">λ: Population Fitness</a>
				</li>
				<li>
					<a href="../data/tsv/growthTime.tsv">τ: Growth Time</a>
				</li>
				<li>
					<a href="../data/tsv/selfSimilality.tsv">θ: Selfsimilarity</a>
				</li>
			</ul>
		</p>
	</div>	
</div>


<?php include("../footer.php"); ?>