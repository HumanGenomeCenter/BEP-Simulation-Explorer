<?php

if (!isset($path)) $path = "./";

echo "<!--";



$uri = explode("/", trim($_SERVER['REQUEST_URI'], "/"));

$a['home'] = "";
$a['about'] = "";
$a['explorer'] = "";
$class = ' class="active"'; 

if (count($uri)>1) {
	$a[$uri[1]] = $class;
} else {
	$a['home'] = $class;
}

echo "-->";

?>

<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<title>BEP Simulation Explorer</title>
	<link rel="stylesheet" href="<?php echo $path; ?>css/bootstrap.min.css" charset="utf-8">
	<link rel="stylesheet" href="<?php echo $path; ?>css/font-awesome.min.css" type='text/css'>
	<link rel="stylesheet" href="<?php echo $path; ?>css/bep.css" type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400,700,800' rel='stylesheet' type='text/css'>
</head>

<body>
	
<div class="container">
	
	<div class="page-header">
	  <h1>B.E.P</h1>
	</div>
	
	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li<?php echo $a['home']; ?>><a href="<?php echo $path; ?>">Home</a></li>
					<li<?php echo $a['about']; ?>><a href="<?php echo $path; ?>about/">About</a></li>
					<li<?php echo $a['explorer']; ?>><a href="<?php echo $path; ?>explorer/">Simulation Explorer</a></li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Action</a></li>
							<li><a href="#">Another action</a></li>
							<li><a href="#">Something else here</a></li>
							<li class="divider"></li>
							<li class="dropdown-header">Nav header</li>
							<li><a href="#">Separated link</a></li>
							<li><a href="#">One more separated link</a></li>
						</ul>
					</li>
				</ul>
			</div><!--/.nav-collapse -->
		</div><!--/.container-fluid -->
	</nav>
	
