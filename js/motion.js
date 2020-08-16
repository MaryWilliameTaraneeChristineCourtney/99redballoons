// JavaScript Document

$(document).ready(function(){
	init();
});

function init(){
		blurType = $('.blurType').val();
	shadowLength = $('.shadowDistance').val();
	shadowBlur = $('.shadowBlur').val();
	textContent = $('.textContent').val();

	scrollPos1 = null;
	scrollPos2 = 0;
	scrollDis = 0;
	scrollTime1 = 0;
	scrollTime = 0;
	scrollSpeed = 0;

	scrolling = false;

	opacity = 1;
	textPos = 0;


	origText = document.getElementsByClassName("motion")[0];
	body = document.getElementsByTagName("body")[0];
	body.style.height = origText.offsetHeight + "px";

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                     		 	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  	window.requestAnimationFrame = requestAnimationFrame;

  	setTimeout(function(){ // if the page is scrolled and refreshed, the .motion div is also scrolled
  		origText.style.webkitTransform = "translate3d(0,"+ -window.pageYOffset +"px,0)";
  	},50);

  	controls();
}

function controls(){
	$motion = $(".motion")
	$('.blurType').change(function(){
		var value = parseInt($(this).val());
		blurType = value;
		$(this).val(blurType)
		if(blurType){
			$('.shadowDistance').removeAttr('disabled');
			$('.textContent').removeAttr('disabled');
			$('.shadowBlur').val(10)
			$('.webkitBlur').css('display', 'none')
			$('.textShadow').css('display', 'block')
			body.style.height = origText.offsetHeight + "px";
			window.scrollTo(0)

		} else {
			$('.shadowDistance').attr('disabled', 1);
			$('.textContent').attr('disabled', 1);
			$('.shadowBlur').val(15)
			$('.webkitBlur').css('display', 'block')
			$('.textShadow').css('display', 'none')
			body.style.height = origText.offsetHeight + "px";
			window.scrollTo(0)
		}
	});
	$('.shadowDistance').change(function(){
		var value = $(this).val();
		shadowLength = value;
	});
	$('.shadowBlur').change(function(){
		var value = $(this).val();
		shadowBlur = value;
	});
	$('.textContent').keyup(function(){
		var value = $(this).val();
		$('.textShadow').html(value.replace(/\n/g, '<br>'));
		body.style.height = origText.offsetHeight + window.outerHeight + "px";
	})
}

window.onscroll = function (oEvent) {
	
	if(scrollPos1 == null){
		scrollPos1 = window.pageYOffset;
		scrollTime1 = new Date().getTime();
		return;
	}

	scrollPos2 = window.pageYOffset;
	scrollTime = new Date().getTime() - scrollTime1;

	scrollDis = scrollPos2 - scrollPos1;
	scrollDis = (scrollDis < 0) ? scrollDis * -1 : scrollDis; //Make both directions positive

	scrollSpeed = scrollDis / scrollTime;

	// End
	scrollPos1 = scrollPos2;
	scrollTime1 = new Date().getTime()

	opacity = 1 - (scrollSpeed/10);

	if(!scrolling){
		requestAnimationFrame(step);
	}
	

	scrolling = true;
}

function step(timestamp) {
	if(scrolling){
		requestAnimationFrame(step);
	}

	xDif = parseInt(scrollPos2 + textPos)

	textPos -= (xDif*.1);
	opacity = (xDif < 0) ? 1-((xDif * -1)/200) : 1-(xDif/200);

	if(xDif > 0) { //if scrolling down
		upOrDown = 1
	} else { //if scrolling up
		upOrDown = -1
	}


		if(blurType){
			textShadow =    "0px "+ (0*upOrDown) * shadowLength +"px "+shadowBlur+"px rgba(255,255,255,"+ (1-opacity)/2 +"),\
							 0px "+ (1*upOrDown) * shadowLength +"px "+shadowBlur+"px rgba(255,255,255,"+ (1-opacity)/4 +"),\
							 0px "+ (2*upOrDown) * shadowLength +"px "+shadowBlur+"px rgba(255,255,255,"+ (1-opacity)/8 +"),\
							 0px "+ (3*upOrDown) * shadowLength +"px "+shadowBlur+"px rgba(255,255,255,"+ (1-opacity)/16 +"),\
							 0px "+ (4*upOrDown) * shadowLength +"px "+shadowBlur+"px rgba(255,255,255,"+ (1-opacity)/32 +")";

		

			var newStyle = "color: rgba(255,255,255,"+ opacity +");\
							transform: translate3d(0,"+ textPos +"px,0);\
							-webkit-transform: translate3d(0,"+ textPos +"px,0);\
							text-shadow: " + textShadow;


		} else {
			blurFilter =    -opacity*(shadowBlur/7)+"px";

			var newStyle = "transform: translate3d(0,"+ textPos +"px,0);\
							-webkit-transform: translate3d(0,"+ textPos +"px,0);\
							-webkit-filter: blur(" + blurFilter + ")";

		}


		origText.style.cssText = newStyle;

	if(xDif == 0){
		scrolling = false;
	}

}
 
requestAnimationFrame(step);