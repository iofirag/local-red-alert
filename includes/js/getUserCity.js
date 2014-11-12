var userLatitude;
var userLongitude;
var userCity;

jQuery(document).ready(function($) {
	//debugger;
	//var u = new SpeechSynthesisUtterance('Hello World');
     //u.text = 'Hello World';
     // u.lang = 'en-US';
     // u.rate = 1.2;
     // u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.'); }
     // speechSynthesis.speak(u);
//      
     // var msg = new SpeechSynthesisUtterance('Hello World2');
	// speechSynthesis.speak(msg);
// 	
	// msg = new SpeechSynthesisUtterance('שלום');
	// speechSynthesis.speak(msg);
	
	//speechSynthesis.speak(new SpeechSynthesisUtterance('Hello World'));
	getLocation();
	window.setInterval(function() {
		getLocation();
	}, 60000);
});



function getLocation() {
	if (navigator.geolocation) {
		//$(".right_part").eq(1).html("Location Enabled");		// or -  $(".right_part:eq(1)").html(userCity);
		navigator.geolocation.getCurrentPosition(showPositionCity);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

//http://maps.googleapis.com/maps/api/geocode/json?address=%D7%90%D7%99%D7%A8%D7%AA%D7%90%D7%97&language=he&sensor=true
function showPositionCity(position) {
	if (position!= null){
		userLatitude = position.coords.latitude;
		userLongitude = position.coords.longitude;
		
		//console.log("Latitude: " + position.coords.latitude + "  Longitude: " + position.coords.longitude);
	
		//apiKey = "AIzaSyDIqDiNyzt3qDt84d_5Lds7cHTPx7xLqaY";
	
		var method = 'GET';
		var mapsUrl_he = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&language=he&sensor=true';
		//var mapsUrl_en = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&language=en&sensor=true';
		var async = true;
		$.ajax({
			url : mapsUrl_he,
			dataType : 'json',
			type : 'GET',
			success : function(res) {
				//console.log(res.results[0].formatted_address);
				
				/* Way A */
				if (res.results.length>0){
					for (var i=0; i<res.results[0].address_components.length; i++){
						if (res.results[0].address_components[i].types[0] == "locality"){
							userCity = res.results[0].address_components[i].long_name;	
							break;	
						}
					}
					
					if (userCity==null){
						/* Way B */
						address = res.results.formatted_address;	// get key "formatted_address"
						address = address.split(",");	//split all address string by "," delimiter
						cityWithSpace = address[1];		//get array[1]
						userCity = cityWithSpace.substring(1);	//remove the space
					}
				}
				//console.log(userCity);
				$(".right_part").eq(1).html(userCity);		// or -  $(".right_part:eq(1)").html(userCity);		
			},
			error : function(res, error) {
				console.log(arguments);
				alert(" Can't do because: " + error);
			}
		});
	}else {
		$(".right_part").eq(1).html("error");
	}
	/* Show user on map */
	//var lat = position.coords.latitude;
	//var lng = position.coords.longitude;
	//map.setCenter(new google.maps.LatLng(lat, lng));
}