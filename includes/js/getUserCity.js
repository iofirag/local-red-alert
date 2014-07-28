var userLatitude;
var userLongitude;
var userCity;

jQuery(document).ready(function($) {
	getLocation();
});


function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPositionCity);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}
function savePosition(position){
	userLatitude = position.coords.latitude;
	userLongitude = position.coords.longitude;
	
	/*static location for test */
	// userLatitude = 31.228281;
	// userLongitude = 34.284559;
}

function showPositionCity(position) {
	userLatitude = position.coords.latitude;
	userLongitude = position.coords.longitude;
	
	//console.log("Latitude: " + position.coords.latitude + "  Longitude: " + position.coords.longitude);

	//apiKey = "AIzaSyDIqDiNyzt3qDt84d_5Lds7cHTPx7xLqaY";

	var method = 'GET';
	var mapsUrl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true';
	var async = true;
	$.ajax({
		url : mapsUrl,
		dataType : 'json',
		type : 'GET',
		success : function(res) {
			//console.log(res.results[0].formatted_address);
			
			/* Way A */
			// if (res.results.length>0){
				// address = res.results.formatted_address;	// get key "formatted_address"
				// address = address.split(",");	//split all address string by "," delimiter
				// cityWithSpace = address[1];		//get array[1]
				// userCity = cityWithSpace.substring(1);	//remove the space
			// }
			
			/* Way B */
			if (res.results.length>0){
				for (var i=0; i<res.results[0].address_components.length; i++){
					if (res.results[0].address_components[i].types[0] == "locality"){
						userCity = res.results[0].address_components[i].long_name;	
						break;	
					}
				}
			}
			console.log(userCity);
			tag = "<section id='city'><b>Location: </b>" + userCity + "</section><br>";
			$("#connection").after(tag);
		},
		error : function(res, error) {
			console.log(arguments);
			alert(" Can't do because: " + error);
		}
	});

	/* Show user on map */
	//var lat = position.coords.latitude;
	//var lng = position.coords.longitude;
	//map.setCenter(new google.maps.LatLng(lat, lng));
}