var alertItem;
var database = [];
var alertNoise = "<audio autoplay><source src='includes/noise/alarm.mp3'><source src='includes/noise/alarm.ogg'></audio>";
var geocoder;
var popupRedW = 700;
var popupRedH = 500;
var lastDay;

$(window).load(function() {
	rocketPic_randomImage();
	readFromDatabase();
	geocoder = new google.maps.Geocoder();
	
	pikudHaoref_jsonLoader();
	window.setInterval(function() {
		pikudHaoref_jsonLoader();
	}, 3000);
});

function readFromDatabase() {
	$.getJSON('includes/js/database.json', function(data) {
		for (i in data) {
			database.push(data[i]);
		}
	});
}



function rocketPic_randomImage() {
	var random = getRandomInt(1, 7);
	$("#rocketPic").css('background', "url('includes/images/rocket/" + random + ".png') no-repeat");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pikudHaoref_jsonLoader() {

	/* **********************************************************************************************************************************************************************************************************************
	* api's:
	*
	* (1) - http://www.oref.org.il/WarningMessages/alerts.json	(Pikud Haoref)
	* (2) - http://www.mako.co.il/Collab/amudanan/adom.txt		(Mako)
	* (3) - http://iofirag.github.io/personal-red-alert/test/adom.txt			(Test file from my server)
	* (4) - http://iofirag.github.io/personal-red-alert/test/adomAlert.txt		(Test file from my server + alert)
	*
	* YQL:	select * from html where url='' and charset='utf-16'
	*
	* YQL +(1):   https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.oref.org.il%2FWarningMessages%2Falerts.json%22%20and%20charset%3D'utf-16'&format=json&callback=
	* YQL +(2):   https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.mako.co.il%2FCollab%2Famudanan%2Fadom.txt%22%20and%20charset%3D'utf-16'&format=json&callback=
	* YQL +(3):   https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fiofirag.github.io%2Fpersonal-red-alert%2Ftest%2Fadom.txt'%20and%20charset%3D'utf-16'&format=json&callback=
	* YQL +(4):   https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fiofirag.github.io%2Fpersonal-red-alert%2Ftest%2FadomAlert.txt'%20and%20charset%3D'utf-16'&format=json&callback=
	* YQL error:   https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fredalert.eu5.org%2Fnot_use%2FadomAlert.txt'%20and%20charset%3D'utf-16'&format=json&callback=
	*************************************************************************************************************************************************************************************************************************/

	// 2 - Mako with YQL
	alertFile = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.mako.co.il%2FCollab%2Famudanan%2Fadom.txt%22%20and%20charset%3D'utf-16'&format=json&callback=";
	//alertFile = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fiofirag.github.io%2Fpersonal-red-alert%2Ftest%2Fadom.txt'%20and%20charset%3D'utf-16'&format=json&callback=";
	//alertFile = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fiofirag.github.io%2Fpersonal-red-alert%2Ftest%2FadomAlert.txt'%20and%20charset%3D'utf-16'&format=json&callback=";
	$.ajax({
		dataType : "json",
		url : alertFile,
		type : 'GET',
		success : function(res) {
			//debugger;
			if (res.query.results != null) {
				var allp = res.query.results.body.p;
				connectionGoodResult();

				console.log(allp);

				var buffer = [];

				var bufferWordsData = [];
				var currAlertId;
				var areas = [];

				/* Run on all dynamic string */
				for ( i = 0; i < allp.length; i++) {
					/* Take a character */
					c = allp[i];

					/* if character is [a-z, A-Z, 0-9] */
					if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')) {
						buffer.push(allp[i]);
						/* if character is not [a-z, A-Z, 0-9] */
					} else {
						/* if buffer has data */
						if (buffer.length > 0) {
							//build string from buffer [d,a,t,a,2,1.....]
							str = "";
							for ( j = 0; j < buffer.length; j++) {
								str += buffer[j];
							}

							/* Ignore specific words */
							if (str != "id" && str != "title" && str != "data") {
								bufferWordsData.push(str);
							}

							//init
							buffer = [];
						}
					}
				}
				// read (first, second, [third, fourth,..last]) items and split data to variables
				for ( k = 0; k < bufferWordsData.length; k++) {
					if (k == 0) {
						currAlertId = bufferWordsData[k];
					} else {
						//get area object [number, name, timeToShow]
						var areaObj = getAreaObj_ByNum(parseInt(bufferWordsData[k]));
						areas.push(areaObj);
					}
				}

				/* if this is the first object
				 * or if there is areas +and+ ID not equeal to the last ID */
				if ((areas.length > 0) && ((alertItem == null) || ((currAlertId != alertItem.alertId) && (areas.length > 0)))) {
					/* Create Alert Obj */
					alertItem = new Alert(currAlertId, areas);

					/* show alert with html */
					var now_strToShow = "<ul>";
					var past_strToShow = "";
					
					/* Run on area list */
					for ( n = 0; n < alertItem.areaList.length; n++) {

						/* if not last area in array */
						if (n != alertItem.areaList.length - 1) {
							now_strToShow += "<li>" + alertItem.areaList[n].areaName + " " + alertItem.areaList[n].areaNumber + "</li>";
							past_strToShow += alertItem.areaList[n].areaName + " " + alertItem.areaList[n].areaNumber + ",   ";
						} else {
							now_strToShow += "<li>" + alertItem.areaList[n].areaName + " " + alertItem.areaList[n].areaNumber + "</li></ul>";
							past_strToShow += alertItem.areaList[n].areaName + " " + alertItem.areaList[n].areaNumber;
						}
					}

					/* open menu for the higher time to show area */
					var timeToShow_higher = 0;
					for ( i = 0; i < alertItem.areaList.length; i++) {
						if (timeToShow_higher < areaObj.timeToShow)
							timeToShow_higher = areaObj.timeToShow;
					}

					/* check if there is a place with alarm near the user */
					var nearUser = 1;
					for (var i = 0; i < alertItem.areaList.length; i++) {
						for (var j = 0; j < alertItem.areaList[i].placeList.length; j++) {
							KmDistanceBetweenTwoLatLon = getDistanceFromLatLonInKm(userLatitude, userLongitude, alertItem.areaList[i].placeList[j].placeLatitude, alertItem.areaList[i].placeList[j].placeLongitude);

							/* play alarm - if user in range of one of the alarms area */
							if (KmDistanceBetweenTwoLatLon <= 5) {
								nearUser = 2;

								/* Play alarm sound */
								var alarm = new Audio("includes/noise/alarm.mp3");
								if (alarm == null)
									alarm = new Audio("includes/noise/alarm.ogg");
								alarm.play();

								/* Open window alarm */
								var left = (screen.width / 2) - (popupRedW / 2);
								var top = (screen.height / 2) - (popupRedH / 2);
								console.log(left +" "+top);
								var popupRed = window.open('http://iofirag.github.io/personal-red-alert/red.html', 'Red-Alert in your location',            'width='+popupRedW+', height='+popupRedH+', top='+top+', left='+left+ ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1');
								setTimeout(function() {
									popupRed.close();
								}, timeToShow_higher*1000);
								break;
							}
						}
						if (nearUser == 2)
							break;
					}

					/* Decleare dynamic height for top menu */
					/* toggle top menu */
					//toggleNav("close");
					toggleNav("open",nearUser);

					/* put data on top menu */
					$("#now_alertList").html("<section class='now_alertItem'>" + now_strToShow + "</section>");

					setTimeout(function() {
						toggleNav("close");
						toggleNav("open",0);
						$(".past_alertItem").css("background-color", "");
					}, timeToShow_higher * 1000);

					/* if this is the first alarm item we adding -remove the bomb picture */
					if ($('#rocketPic').length > 0) {
						/* Put value for lastDay variable */
						lastDay = new Date().getDay();
						
						$('#rocketPic').attr("style", "");
						//clear the inline style add in the random image
						$('#rocketPic').attr("id", "past_alertsList");
					}else {
						/* Check if this is a new day */
						currDay = new Date().getDay();
						if ( (lastDay==null || lastDay=="") && lastDay!= currDay){
							$("#past_alertsList").prepend("<hr>");
							lastDay = currDay;
						}
					}

					item = "<b>" + alertItem.time.timeReceived + "</B> - " + past_strToShow;
					
					/* get the number of child of #past_alertsList and calculate dynamic height to set */
					// console.log( $("#past_alertsList").length );
					//$("#past_alertsList").css("height",  );
					//only max height ??
					
					/* Add alarm line */
					$("#past_alertsList").prepend("<section class='past_alertItem' style='background-color: black;'>" + item + "</section>");

				} else {
					/* garbich data */
					toggleNav("open",0);
				}

				//init areas
				areas = [];
			} else {
				connectionBadResult();
			}
		},
		error : function(res, error) {
			internetConnectionError();
			console.log(arguments);
			console.log("Can't do because: " + error);
		}
	});
}

function popupwindow(url, title, w, h) {

}

function connectionGoodResult() {
	$('.right_part').eq(0).attr("id", "connected");
	$('.right_part').eq(0).html("listening...");
}

function connectionBadResult() {
	$('.right_part').eq(0).attr("id", "server_busy");
	$('.right_part').eq(0).html("server busy");
	console.log("Server is busy.");
}

function internetConnectionError() {
	$('.right_part').eq(0).attr("id", "no_internet");
	$('.right_part').eq(0).html("No internet");
	console.log("No internet conncection.");
}

function getAreaObj_ByNum(num) {
	var areaObj = new Area();

	areaObj.areaNumber = num;
	areaObj.areaName = "";
	areaObj.timeToShow = "";

	placeList = [];
	/* find areaNumber in database */
	for (i in database) {

		if (database[i].ExcelAreaNumber == num) {
			/*only 1 time */
			if (areaObj.timeToShow == "") {
				areaObj.timeToShow = database[i].ExcelTimeToShow;
			}
			if (areaObj.areaName == "") {
				areaObj.areaName = database[i].ExcelAreaName;
			}
			/* Build placeList */
			placeItem = new Place(database[i].ExcelPlaceName, database[i].ExcelPlaceLatitude, database[i].ExcelPlaceLongitude);
			placeList.push(placeItem);
		}
	}
	areaObj.placeList = placeList;
	return areaObj;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371;
	// Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);
	// deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	// Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}