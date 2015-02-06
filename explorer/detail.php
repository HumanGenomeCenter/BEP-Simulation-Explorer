	<div class="row">
		<div class="col-xs-12 selection">
		
			<div class="btn-toolbar text-center" role="toolbar" aria-label="...">
				<div id="s" class="btn-group" data-toggle="buttons">
					<label class="btn btn-label">S</label>
					<div class="btn btn-default">
						<input type="radio" name="options">
						<span>0.01</span>
					</div>
					<div class="btn btn-default active">
						<input type="radio" name="options">
						<span>0.1</span>
					</div>
					<div class="btn btn-default">
						<input type="radio" name="options">
						<span>1</span>
					</div>
				</div>
			
				<div id="r" class="btn-group" data-toggle="buttons">
					<label class="btn btn-label">R</label>
					<div class="btn btn-default">
						<input type="radio" name="options">
						<span>0.0001</span>
					</div>
					<div class="btn btn-default active">
						<input type="radio" name="options">
						<span>0.001</span>
					</div>
					<div class="btn btn-default">
						<input type="radio" name="options">
						<span>0.01</span>
					</div>
				</div>
			
				<div id="d" class="btn-group" data-toggle="buttons">
					<label class="btn btn-label">
						D
					</label>	
					<div class="btn-group" role="group">
						<div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
							<span>4</span>
							<i class="fa fa-angle-down"></i>
						</div>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">1</a></li>
							<li><a href="#">2</a></li>
							<li><a href="#">3</a></li>
							<li><a href="#">4</a></li>
							<li><a href="#">5</a></li>
							<li><a href="#">6</a></li>
							<li><a href="#">7</a></li>
							<li><a href="#">8</a></li>
							<li><a href="#">9</a></li>
							<li><a href="#">10</a></li>
						</ul>
					</div>
				
				</div>
			
				<div id="f" class="btn-group top" data-toggle="buttons">
					<label class="btn btn-label">
						F
					</label>
					<div class="btn-group" role="group">
						<div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
							<span>0.8</span>
							<i class="fa fa-angle-down"></i>
						</div>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">0.1</a></li>
							<li><a href="#">0.2</a></li>
							<li><a href="#">0.3</a></li>
							<li><a href="#">0.4</a></li>
							<li><a href="#">0.5</a></li>
							<li><a href="#">0.6</a></li>
							<li><a href="#">0.7</a></li>
							<li><a href="#">0.8</a></li>
							<li><a href="#">0.9</a></li>
							<li><a href="#">1.0</a></li>
							<li><a href="#">1.1</a></li>
							<li><a href="#">1.2</a></li>
							<li><a href="#">1.3</a></li>
							<li><a href="#">1.4</a></li>
							<li><a href="#">1.5</a></li>
						</ul>
					</div>
				</div>
			
				<div id="abs" class="btn-group" data-toggle="buttons">
					<div class="btn btn-default">
						<input type="radio" name="options" value="abs">
						<span>abs</span>
					</div>
					<div class="btn btn-default active">
						<input type="radio" name="options" value="rel">
						<span>rel</span>
					</div>
				</div>
			
			</div>
		</div>
	</div>
	
	<div class="row">
		<div class="col-xs-12">
			<div id="details" width="100%" height="500px"></div><!-- svg container -->
		</div>
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
			From the  the cell-wise dendrogram of the mutation profile heatmap, 
			we obtained <i>c</i> clusters by cutting the dendrogram at the height <i>l</i>. the relationship between <i>c</i> and <i>l</i> was plotted in log scale.
			vertical and horizontal axes denote <i>c</i> and <i>l</i>, respectively. Since their linear relationship indicates self similality,
			we performed linear regression between <i>log</i>(<i>c</i>) and <i>log</i>(<i>l</i>), and assumed that the dendrogram has self-similarity if R<sup>2</sup> &gt 0.95
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
