/* Menu Canvas Off */
// $(function() {
// // Toggle Nav on Click
// $('.toggle-nav').click(function() {
// // Calling a function in case you want to expand upon this.
// toggleNav();
// });
// });

var navOpen = false;
function toggleNav(make, nearUser) {
	if (make == "close") {
			$('#now_alertList').html("");
		
		if (navOpen == true) {
			// Do things on Nav Close
			$('#site-wrapper').removeClass('show-nav');

			$("#site-canvas").css('-webkit-transform', "translate3d(0, 0, 0)");
			$("#site-canvas").css('transform', "translate3d(0, 0, 0)");
			$("#site-canvas").css('-webkit-transform', "");
			//clear
			$("#site-canvas").css('transform', "");
			//clear
			navOpen = false;
		}
	} else if (make == "open") {
		// Do things on Nav Open
		$('#site-wrapper').addClass('show-nav');

		var calculateHeight;
		
		switch (nearUser) {
			case 0:	/* Green = 0 */
				/* Can open green nav just if it close */ 
				if (navOpen==false){
					$('#menu_title').html("אין אזעקות כרגע");
					$('#now_alertList').html("");
					
					$('#site-menu').css('background-color', '#2CD202');
					calculateHeight =  70;
					$("#site-canvas").css('-webkit-transform', "translate3d(0, " + calculateHeight + "px, 0)");
					$("#site-canvas").css('transform', "translate3d(0, " + calculateHeight + "px, 0)");
					$("#site-menu").css("height", calculateHeight);
					$("#site-menu").css("top", -calculateHeight);
					navOpen = true;
				}
				break;
			case 1:	/* Orange = 1 */
				$('#menu_title').html(":אזעקות כרגע");
				$('#site-menu').css('background-color', 'orange');
				calculateHeight = (alertItem.areaList.length * 30) + 80;
				$("#site-canvas").css('-webkit-transform', "translate3d(0, " + calculateHeight + "px, 0)");
				$("#site-canvas").css('transform', "translate3d(0, " + calculateHeight + "px, 0)");
				$("#site-menu").css("height", calculateHeight);
				$("#site-menu").css("top", -calculateHeight);
				navOpen = true;
				break;
			case 2:	/* Green = 2 */
				$('#menu_title').html(":אזעקות כרגע");
				$('#site-menu').css('background-color', '#FF0000');
				calculateHeight = (alertItem.areaList.length * 30) + 80;
				$("#site-canvas").css('-webkit-transform', "translate3d(0, " + calculateHeight + "px, 0)");
				$("#site-canvas").css('transform', "translate3d(0, " + calculateHeight + "px, 0)");
				$("#site-menu").css("height", calculateHeight);
				$("#site-menu").css("top", -calculateHeight);
				navOpen = true;
				break;
		}
		// if (nearUser==3){
		// $('#site-menu').css('background-color', '#FF0000');
		// }
		// else{
		// $('#site-menu').css('background-color', 'orange');
		// }

		// var calculateHeight = (alertItem.areaList.length * 30) + 80;
		// $("#site-canvas").css('-webkit-transform', "translate3d(0, " + calculateHeight + "px, 0)");
		// $("#site-canvas").css('transform', "translate3d(0, " + calculateHeight + "px, 0)");
		// $("#site-menu").css("height", calculateHeight);
		// $("#site-menu").css("top", -calculateHeight);
		
		// navOpen = true;
	}
}

/* Make the escape key close the nav */
$(document).keyup(function(e) {
	if (e.keyCode == 27) {
		if (navOpen == true) {
			// Assuming you used the function I made from the demo
			toggleNav("close");
		}
	}
});
