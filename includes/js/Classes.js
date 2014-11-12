
function Alert(alertIdVal, areasVal) {
	var timeStampVal = new TimeStamp();
	var alertItem = {
		alertId : alertIdVal,
		areaList : areasVal,
		time : timeStampVal
	};
	//alert.areaList.push(areas);
	return alertItem;
}


function Area(areaNumberVal, areaNameVal, areaTTSVal, timeToShowVal, placesVal) {
	var areaItem = {
		areaNumber : areaNumberVal,
		areaName : areaNameVal,
		areaTTSName : areaTTSVal,
		timeToShow : timeToShowVal,
		placeList : placesVal
	};
	return areaItem;
}

function Place(placeNameVal, placeLatitudeVal, placeLongitudeVal) {
	var placeItem = {
		placeName : placeNameVal,
		placeLatitude : placeLatitudeVal,
		placeLongitude : placeLongitudeVal
	};
	return placeItem;
}

function TimeStamp(){
	var d = new Date();
	// Add zero to string
	tempHour = "0"+d.getHours();
	tempMinutes = "0"+d.getMinutes();
	
	// Substring from str
	tempHour = tempHour.substring(tempHour.length-2);
	tempMinutes = tempMinutes.substring(tempMinutes.length-2);
	
	// Build timeReceived
	time= tempHour+":"+tempMinutes;

	var timeStamp = {
		hour : d.getHours(),
		minutes : d.getMinutes(),
		timeReceived : time
	};
	return timeStamp;
}
