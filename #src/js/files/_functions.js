/*=============================================================*/
let ua = window.navigator.userAgent;
let msia = ua.indexOf("MSIE ");
let isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
                isMobile.Android()
                || isMobile.BlackBerry()
                || isMobile.iOS()
                || isMobile.Opera()
                || isMobile.Windows()
                );
    }
};

/*===================================================================*/
function isIE() {
	ua = navigator.userAgent;
	let is_ie = msia > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;	
}

if (isIE()){
	document.querySelector('html').classList.add('ie');	
}

if (isMobile.any()){
	document.querySelector('html').classList.add('_touch');	
}

/*===================================================================*/

function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
	callback(webP.height == 2);
	};
webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	}else{
		document.querySelector('body').classList.add('no-webp');
	}
});

/*===================================================================*/

function ibg(){

let ibg=document.querySelectorAll("._ibg");
for (var i = 0; i < ibg.length; i++) {
	if(ibg[i].querySelector('img')){
		ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
	}
}
}
ibg()
//.then(() => { console.log('images BG added correctly') })
/*.catch(err => { console.log('Error: ', err) throw err; });*/

/*===================================================================*/
function _removeClasses(arr_object, what_dell) {
	console.log(arr_object);
	for (var i = 0; i < arr_object.length; i++) {
		arr_object[i].classList.remove(what_dell);
	}
}


/*==================СПОЛЛЕР============================*/

const spollersArray = document.querySelectorAll('[data-spollers]');
if( spollersArray.length > 0 ){
		//получение обычных слайдеров
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			//проверяем отсутствие параметров у спойлера и добавляем в новый массив
			return !item.dataset.spollers.split(',')[0];
		});
		//инициализация обычных слайдеров
		// проверка на существование
		if( spollersRegular.length > 0 ){
			initSpollers(spollersRegular);
		}

		//получение слайдеров с медиа запросом
		const spollersMedia = Array.from(spollersArray).filter(function(item, index, self) {
			//проверяем наличие параметров у спойлера и добавляем в новый массив
			return item.dataset.spollers.split(',')[0];
		});

		//инициализация обычных слайдеров с медиа запросом
		// проверка на существование//
		if( spollersMedia.length > 0 ){
			const breakpointsArray = [];
			spollersMedia.forEach(item => {
				const params 		= item.dataset.spollers;
				const breakpoint 	= {};
				const paramsArray	= params.split(',');
				breakpoint.value	= paramsArray[0];
				breakpoint.type 	= paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item 	= item;
				breakpointsArray.push(breakpoint);
			});
			//получаем уникальные брейкпоинты
			let mediaQueries	= breakpointsArray.map(function(item) {
				return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
			});
			mediaQueries = mediaQueries.filter(function(item, index, self) {
				return self.indexOf(item) === index;
			});
			// работа с каждым брейкпоинтом
			mediaQueries.forEach(breakpoint => {
				const paramsArray 		= breakpoint.split(',');
				const mediaBreakpoint	= paramsArray[1];
				const mediaType 			= paramsArray[2];
				const matchMedia 			= window.matchMedia(paramsArray[0]);

				//объекты с нужными условиями
				const spollersArray = breakpointsArray.filter(function(item) {
					if( item.value === mediaBreakpoint && item.type === mediaType ){
						return true;
					}
				});
				// события
				matchMedia.addListener(function() {
					initSpollers(spollersArray, matchMedia);
				});
				initSpollers(spollersArray, matchMedia);
			});

		}


	//инициализация//
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if( matchMedia.matches || !matchMedia ){
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener('click', setSpollerAction);
			}else{
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener('click', setSpollerAction);
			}
		});
	}

	//работа с контекстом спойлера//
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if ( spollerTitles.length > 0 ){
			spollerTitles.forEach(spollerTitle => {
				if( hideSpollerBody ){
					spollerTitle.removeAttribute('tabindex');
					if( !spollerTitle.classList.contains('_active') ){
						spollerTitle.nextElementSibling.hidden = true;
					}
				}else{
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	////
	function setSpollerAction(e) {
		const el = e.target;
		if( el.hasAttribute('data-spoller') || el.closest('[data-spoller]') ){
			const spollerTitle 	= el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock	= spollerTitle.closest('[data-spollers]');
			const oneSpoller		= spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if( !spollersBlock.querySelectorAll('._slide').length ){
				if( oneSpoller && !spollerTitle.classList.contains('_active') ){
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			//e.preventDefault();
		}
	}
	////
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if( spollerActiveTitle ){
			spollerActiveTitle.classList.remove('_active');
			//скрываем все элементы
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}

}
// работа со скрытыми элементами
//SlideToggle
//функция анимировано скрывает объект
let _slideUp = (target, duration = 500) => {
	if( !target.classList.contains('_slide') ){
		target.classList.add('_slide');
		target.style.transitionProperty 	= 'height, margin, padding';
		target.style.transitionDuration 	= duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(()=>{
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		},duration);
	}
}

//функция анимировано показывает объект
let _slideDown = (target, duration = 500) => {
	if( !target.classList.contains('_slide') ){
		target.classList.add('_slide');
		if( target.hidden ){
			target.hidden = false;
		}
		let height = target.offsetHeight
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty 	= 'height, margin, padding';
		target.style.transitionDuration 	= duration + 'ms';
		target.style.height = height +'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(()=>{
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		},duration);
	}
} 

let _slideToggle = (target, duration = 500) => {
	if( target.hidden ){
		return _slideDown(target, duration);
	}else{
		return _slideUp(target, duration);
	}
}

/*
		для родителя спойлеров пишем атрибут data-spollers
		для заголовков спойлеров пишем атрибут data-spoller
		если нужно включить/выключить работу спойлера на разных размерах экрана
		пишем параметры ширины и типа брейкпоинта.
		например:
		data-spollers="992,max" - спойлер будит работать только на экранах меньше или равно 992px
		data-spollers="768,min" - спойлер будит работать только на экранах больше или равно 768px
		если нужно чтобы в блоке открывался только один спойлер добавляем атрибут data-one-spoller
*/



/**************Кеширование SVG Sprite в localStorage****************************/
