//const popupLinls 	= document.querySelectorAll('.popup-link');
const popupLinls 	= document.querySelectorAll('[data-message="subscribe"]');
const body 			= document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');


//data-message="subscribe"

let unlock = true;
const timeout = 800;

if ( popupLinls.length > 0 ){
	for (var i = 0; i < popupLinls.length; i++) {
		const popupLink = popupLinls[i];
		popupLink.addEventListener('click', function(e) {
			const popupName = popupLink.getAttribute('data-message') //.replace('#', '');
			const currentPopup = document.querySelector('.popup_' + popupName + '-message');
			if ( !(e.target.getAttribute('type') === 'text') ){
				popupOpen(currentPopup);
				e.preventDefault();
			}
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if ( popupCloseIcon.length > 0 ){
	for (var i = 0; i < popupCloseIcon.length; i++) {
		const el = popupCloseIcon[i];
		el.addEventListener('click', function(e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(currentPopup) {

	if( currentPopup && unlock ){
		const popupActive = document.querySelector('.popup.open');
		if( popupActive ){
			popupClose(popupActive, false);
		}else{
			bodyLock();
		}
		currentPopup.classList.add('open');
		currentPopup.addEventListener('click', function(e) {
			if( !e.target.closest('.popup__content') ){
				popupClose(e.target.closest('.popup'));

			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if( unlock ) {
		popupActive.classList.remove('open');
		if( doUnlock ){
			bodyUnlock();
		}
	}
}

function bodyLock() {
const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
	if( lockPadding.length > 0 ){
		for (var i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i];
			el.style.paddingRight = lockPaddingValue;
		}
	}

		body.style.paddingRight = lockPaddingValue;
		body.classList.add('_lock');

		unlock = false;
		setTimeout(function() {
			unlock = true;			
		}, timeout);
}

function bodyUnlock() {

	setTimeout(function() {
		for (var i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('_lock');
	}, timeout);
}

document.addEventListener('keydown', function(e) {
	if( e.which === 27 ){
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});
