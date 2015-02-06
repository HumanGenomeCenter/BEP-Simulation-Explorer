	<div class="row">
		<div class="col-xs-12 selection-overview">
			<div class="btn-toolbar text-center" role="toolbar" aria-label="...">
				<div id="abs" class="btn-group" data-toggle="buttons">
					<div class="btn btn-default populationEntropy active">
						<input type="radio" name="options">
						<span>ε Population Entropy</span>
					</div>
					<div class="btn btn-default founderMutationCount">
						<input type="radio" name="options">
						<span>μ Founder Mutation Count</span>
					</div>
					<div class="btn btn-default averageMutationCount">
						<input type="radio" name="options">
						<span>ρ Average Mutation Count</span>
					</div>
					<div class="btn btn-default populationFitness">
						<input type="radio" name="options">
						<span>λ Population Fitness</span>
					</div>
					<div class="btn btn-default growthTime">
						<input type="radio" name="options">
						<span>τ Growth Time</span>
					</div>
					<div class="btn btn-default selfSimilarity">
						<input type="radio" name="options">
						<span>θ Selfsimilarity</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	
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