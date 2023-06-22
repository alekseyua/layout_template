
	/*
	Это должно быть помещено в документе голове , лучше всего перед первой <script>встречаемостью
		
	*/



window.onload = function() {

		/*прослушивать все клики во всем документе*/
	document.addEventListener("click", documentActions)

	function documentActions(e) {
		const targetElement = e.target;// содержит информацию о клике, т.е. будим получать информацию об обекте на который нажали 

console.log(targetElement);
/*======================если экран меньше какогото размера и устроцсьвр мобильное===================================================*/

		if(window.innerWidth < 992 && isMobile.any()){/*определяем что это устройство мобильное или планшет*/

		}

/*======================БУРГЕР МЕНЮ===================================================*/

		if(targetElement.classList.contains('menu-chart__links')){
			alert('12345')
		}

/************************************************************/


}

			document.querySelector('.icon-menu').addEventListener('click',function() {

				if( document.querySelector('.header__menu').classList.contains('_active') ){
					document.querySelector('.header__menu').classList.remove('_active');
					document.querySelector('.icon-menu').classList.remove('_active');
					document.querySelector('body').classList.remove('_lock');

				}else{

					document.querySelector('.header__menu').classList.add('_active');
					document.querySelector('.icon-menu').classList.add('_active');
					document.querySelector('body').classList.add('_lock');
				}

			})




gsap.from(".box" , {
  y:80,
  opacity:0,
  duration:2
})
/*TweenMax.to("#logo", 10, {x:600});*/

// the thing that we want to move is a DOM element with the id of logo.
// it will move for 10 seconds
// it will move to an x position of 600
;

}





