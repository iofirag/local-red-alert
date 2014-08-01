
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
	if (make=="close"){
    	if (navOpen==true){
	        // Do things on Nav Close
	        $('#site-wrapper').removeClass('show-nav');
	        
	        $("#site-canvas").css('-webkit-transform', "translate3d(0, 0, 0)");
			$("#site-canvas").css('transform', "translate3d(0, 0, 0)");
			$("#site-canvas").css('-webkit-transform', "");	//clear
			$("#site-canvas").css('transform', "");		//clear
			navOpen=false;
		}
    } else if (make =="open") {
        // Do things on Nav Open
        $('#site-wrapper').addClass('show-nav');
        
        if (nearUser==true){ 
        	$('#site-menu').css('background-color', '#FF0000');
        }
        else{
        	$('#site-menu').css('background-color', 'orange');
        }
        
		 var calculateHeight = (alertItem.areaList.length*30)+80;
		 $("#site-canvas").css('-webkit-transform', "translate3d(0, "+calculateHeight+"px, 0)");
		 $("#site-canvas").css('transform', "translate3d(0, "+calculateHeight+"px, 0)");
		 $("#site-menu").css("height",calculateHeight);
		 $("#site-menu").css("top",-calculateHeight);
		 navOpen=true;	 
    }
}

/* Make the escape key close the nav */
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        if (navOpen==true) {
            // Assuming you used the function I made from the demo
            toggleNav("close");
        }
    } 
});