<div class="details container-fluid">

	<div class="row values">
		<table class="table table-striped table-bordered">
			<tr><td>s:</td><td id="s"></td></tr>
			<tr><td>r:</td><td id="r"></td></tr>
			<tr><td>d:</td><td id="d"></td></tr>
			<tr><td>f:</td><td id="f"></td></tr>
			<tr><td></td><td></td></tr>
			<tr><td>Population Entropy (ε):</td><td id="ε"></td></tr>
			<tr><td>Founder Mutation Count (μ):</td><td id="μ"></td></tr>
			<tr><td>Average Mutation Count (ρ):</td><td id="ρ"></td></tr>
			<tr><td>Population Fitness (λ):</td><td id="λ"></td></tr>
			<tr><td>Growth Time (τ):</td><td id="τ"></td></tr>
			<tr><td>Self-similarity (θ):</td><td id="θ"></td></tr>
		</table>
	</div>
	
	<div class="row mutprof">
		<figure>
			<img src='../results/s0.01_r0.0001/d4_f0.8_2.mutprof.png'>
		</figure>
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
