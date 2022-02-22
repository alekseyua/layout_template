

async function getProducts(button) {
	if(!button.classList.contains('_hold')){
		button.classList.add('_hold');
		const file = "json/products.json";
		let response = await fetch(file,{
			method: "GET"
		});
		if(response.ok){
			let result = await response.json();
			loadProducts(result);
			button.classList.remove('_hold');
			button.remove();
		}else{
			alert('Attention fail!!!');
		}
	}
}

function loadProducts(data) {
	const productsItems = document.querySelector('.products__items');

	data.products.forEach(item => {
		const productId = item.id;
		const productUrl = item.url;
		const productImage = item.image;
		const productTitle = item.title;
		const productText = item.text;
		const productPrice = item.price;
		const productOldPrice = item.priceOld;
		const productShareUrl = item.shareUrl;
		const productLikeUrl = item.likeUrl;
		const productLabels = item.labels;

	let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
				let productTemplateEnd = `</article>`;

				let productTemplateLabels = '';
				if (productLabels) {
					let productTemplateLabelsStart = `<div class="item-product__labels">`;
					let productTemplateLabelsEnd = `</div>`;
					let productTemplateLabelsContent = '';

					productLabels.forEach(labelItem => {
						productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
					});

					productTemplateLabels += productTemplateLabelsStart;
					productTemplateLabels += productTemplateLabelsContent;
					productTemplateLabels += productTemplateLabelsEnd;
				}

				let productTemplateImage = `
			<a href="${productUrl}" class="item-product__image _ibg">
				<img src="img/products/${productImage}" alt="${productTitle}">
			</a>
		`;

				let productTemplateBodyStart = `<div class="item-product__body">`;
				let productTemplateBodyEnd = `</div>`;

				let productTemplateContent = `
			<div class="item-product__content">
				<h3 class="item-product__title">${productTitle}</h3>
				<div class="item-product__text">${productText}</div>
			</div>
		`;

				let productTemplatePrices = '';
				let productTemplatePricesStart = `<div class="item-product__prices">`;
				let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
				let productTemplatePricesOld = `<div class="item-product__price item-product__price_old">Rp ${productOldPrice}</div>`;
				let productTemplatePricesEnd = `</div>`;

				productTemplatePrices = productTemplatePricesStart;
				productTemplatePrices += productTemplatePricesCurrent;
				if (productOldPrice) {
					productTemplatePrices += productTemplatePricesOld;
				}
				productTemplatePrices += productTemplatePricesEnd;

				let productTemplateActions = `
			<div class="item-product__actions actions-product">
				<div class="actions-product__body">
					<a href="" class="actions-product__button btn btn_white">Add to cart</a>
					<a href="${productShareUrl}" class="actions-product__link _icon-share">Share</a>
					<a href="${productLikeUrl}" class="actions-product__link _icon-favorite">Like</a>
				</div>
			</div>
		`;

				let productTemplateBody = '';
				productTemplateBody += productTemplateBodyStart;
				productTemplateBody += productTemplateContent;
				productTemplateBody += productTemplatePrices;
				productTemplateBody += productTemplateActions;
				productTemplateBody += productTemplateBodyEnd;

				let productTemplate = '';
				productTemplate += productTemplateStart;
				productTemplate += productTemplateLabels;
				productTemplate += productTemplateImage;
				productTemplate += productTemplateBody;
				productTemplate += productTemplateEnd;
				productsItems.insertAdjacentHTML('beforeend', productTemplate);
	ibg()
	})
}


//********************************* Добавление в карзину товара***************************************
//====================================================================================================
function addToCart(productButton, productId){
	if(!productButton.classList.contains('_hold')){
		productButton.classList.add('_hold');
		productButton.classList.add('_fly');

		const cart = document.querySelector('.cart-header__icon');
		const product = document.querySelector(`[data-pid="${productId}"]`);
		const productImage = product.querySelector('.item-product__image');

//****************создаём клон карточки товара*********************************

		const productImageFly = productImage.cloneNode(true);

//получаем данные оригинальной картинки
						//ширину
		const productImageFlyWidth =productImage.offsetWidth;
						//высоту
		const productImageFlyHeight = productImage.offsetHeight;
						//позицию сверху
		const productImageFlyTop = productImage.getBoundingClientRect().top;
						//позицию с лева
		const productImageFlyleft = productImage.getBoundingClientRect().left;

		//применяем получинные размеры нашему клону
					//через setAttribute обращаюсь к классу и переписываю существующие на новые
		productImageFly.setAttribute('class', '_flyImage');
					// присваевую свойства клону
		productImageFly.style.cssText =
		`
			left: ${productImageFlyleft}px;
			top: ${productImageFlyTop}px;
			width: ${productImageFlyWidth}px;
			height: ${productImageFlyHeight}px;
		`;
					//выводим результат в самый конец
			document.body.append(productImageFly); 

			// стили для клона мзображения
			//._flyimage.{
			//opacity: 1;
			//position: fixed;
			//z-index: 100;
			//transition: all 1s ease 0s;
			//}
			//

			//получаем координаты корзины

			const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			// присваеваем новые свойства клону при движении к корзине
			productImageFly.style.cssText =
			`
				left: 	${cartFlyLeft}px;
				top: 		${cartFlyTop}px;
				width: 	0;
				height: 	0;
				opacity: 0;
			`;
			// отлавливаем когда изображение достигло корзины через transitionend
			productImageFly.addEventListener('transitionend', function() {
				if(productButton.classList.contains('_fly')){
					productImageFly.remove();
					updateCart(productButton, productId);
					productButton.classList.remove('_fly');
				}
			})
	}
}

//добавляем позиции в корзину
function updateCart(productButton, productId, productAdd = true) {
	const cart 					= document.querySelector('.cart-header');
	const cartIcon 			= document.querySelector('.cart-header__icon');
	const cartQuantity		= cartIcon.querySelector('span');
	const cartProduct			= document.querySelector(`[data-cart-pid="${productId}"]`);
	const cartList				= document.querySelector('.cart-list');

	if(productAdd){
		if(cartQuantity){
			cartQuantity.innerHTML = ++cartQuantity.innerHTML;
		}else{
			cartIcon.insertAdjacentHTML('beforeend','<span class="cart-header__span">1</span>');
		}
	

		if(!cartProduct){
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const cartProductImage = product.querySelector('.item-product__image').innerHTML;
			const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
			const cartProductContent = 
			`
				<a href="#" class="cart-list__image">${cartProductImage}</a>
				<div class="cart-list__body">
					<a href="#" class="cart-list__title">${cartProductTitle}</a>
					<div class="cart-list__quantity">Quantity: <span class="cart-list__quantity-span">1</span></div>
					<a href="#" class="cart-list__delete">Delete</a>
				</div>
			`;
			cartList.insertAdjacentHTML('beforeend', `<li class="cart-list__item" data-cart-pid="${productId}">${cartProductContent}</li>`)
		}else{
			const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
		}

		//удаляем класс _hold чтобы можно было повторно добавлять позиции в заказ
		productButton.classList.remove('_hold');
		}else{
			const cartProduct			= document.querySelector(`[data-cart-pid]`);
			console.log(cartProduct)
			const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
			if(!parseInt(cartProductQuantity.innerHTML)){
				cartProduct.remove();
			}

			const cartQuantityValue = --cartQuantity.innerHTML;

			if(cartQuantityValue){
				cartQuantity.innerHTML = cartQuantityValue;
			}else{
				cartQuantity.remove();
				cart.classList.remove('_active');
			}
		}
		
}


