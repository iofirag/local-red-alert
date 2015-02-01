<?php 
	header("Access-Control-Allow-Origin: *");	
	$payload = file_get_contents('http://www.oref.org.il/WarningMessages/alerts.json');
	
	if (empty($payload))
		echo 'bad-result';
	else {
		echo $payload;
	}
?>