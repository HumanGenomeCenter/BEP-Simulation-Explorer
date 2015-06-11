	<div class="row">
		<div class="col-xs-12 selection-overview">
			<div class="btn-toolbar" role="toolbar" aria-label="...">
				<div class="btn-group" data-toggle="buttons">
					<div class="btn btn-default populationEntropy active" data-value="ε">
						<input type="radio" name="options">
						<span>ε: Population Entropy</span>
					</div>
					<div class="btn btn-default founderMutationCount" data-value="μ">
						<input type="radio" name="options">
						<span>μ: Founder Mutation Count</span>
					</div>
					<div class="btn btn-default averageMutationCount" data-value="ρ">
						<input type="radio" name="options">
						<span>ρ: Average Mutation Count</span>
					</div>
					<div class="btn btn-default populationFitness" data-value="λ">
						<input type="radio" name="options">
						<span>λ: Population Fitness</span>
					</div>
					<div class="btn btn-default growthTime" data-value="τ">
						<input type="radio" name="options">
						<span>τ: Growth Time</span>
					</div>
					<div class="btn btn-default selfSimilarity" data-value="θ">
						<input type="radio" name="options">
						<span>θ: Self-Similarity</span>
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
	