<?php 
	header("Access-Control-Allow-Origin: *");	
	$seconds=(int)3;
	
	// Ignore user aborts and allow the script
	// to run forever
	ignore_user_abort(true);
	set_time_limit(0);
	
	function getData() {
		try {
		    $payload = file_get_contents('http://www.oref.org.il/WarningMessages/alerts.json');
		
			if (empty($payload)){
				echo 'bad-result';
				sleep($seconds);	
			}
			else {
				$file = 'alerts.txt';
				file_put_contents($file, $payload);
				//echo $payload;
			}
		} catch (Exception $e) {
		    echo 'Caught exception: ',  $e->getMessage(), "\n";
			sleep($seconds);
		}
	}
	
	
    while(true)
    {
        getData();
        sleep($seconds);
    }
	
?>