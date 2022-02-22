/*alert("ok test");*/
//header
//функция для добавления класса хедеру при прокручивании
const headerEl = document.querySelector('.header');
const callback = function(entries, observer) {
	if(entries[0].isIntersecting){
		headerEl.classList.remove('_scroll');
	}else{
		headerEl.classList.add('_scroll');
	}
}
const headerObserver = new IntersectionObserver(callback);

headerObserver.observe(headerEl);
/************************************************************/


