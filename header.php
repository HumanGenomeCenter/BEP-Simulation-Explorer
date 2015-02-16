<?php

if (!isset($path)) $path = "./";

echo "<!--";

print_r($_SERVER['REQUEST_URI']);

$uri = explode("/", trim($_SERVER['REQUEST_URI'], "/"));
print_r($uri);
$last = array_pop($uri);
print_r($last);

$pages = array('intro', 'explorer', 'about', 'help', 'code');
foreach($pages as $p) {
	$a[$p] = "";
}

$class = ' class="active"'; 

if ($last) {
	$a[array_pop($uri)] = $class;
} else {
	$a['intro'] = $class;
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
		<h1>Branching Evolutionary Processes</h1>
		<h2>How Cancer evolution simulation identifies possible principles 
			underlying intratumor heterogeneity</h2>
	</div>
	
	<nav class="navbar navbar-default">
		<div class="container">
			<div id="navbar">
				<ul class="nav navbar-nav">
					<li<?php echo $a['intro']; ?>><a href="<?php echo $path; ?>">Introduction</a></li>
					<li<?php echo $a['explorer']; ?>><a href="<?php echo $path; ?>explorer/">Simulation Explorer</a></li>
					<li<?php echo $a['about']; ?>><a href="<?php echo $path; ?>about/">About</a></li>
					<li<?php echo $a['help']; ?>><a href="<?php echo $path; ?>help/">Help</a></li>
					
					<li<?php echo $a['code']; ?>><a href="<?php echo $path; ?>code/">Code</a></li>
					
				</ul>
			</div><!--/.nav-collapse -->
		</div><!--/.container-fluid -->
	</nav>
	
