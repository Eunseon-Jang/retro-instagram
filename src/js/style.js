'use strict';

$(document).ready(function() {
	(function() {
		axios.get('https://api.instagram.com/v1/users/self/?access_token=1387185290.543433f.4b71ac6a690943c7bcf2d9d69dc7ad26')
		.then(({data}) => {
			console.log(data);
			console.log(data.data.profile_picture)
			$('.tit_bar').text(data.data.username);
			$('.user_msg').text(data.data.bio);
			$('.info_labels .media .amount').text(data.data.counts.media);
			$('.info_labels .lb_flws .amount').text(data.data.counts.followed_by);
			$('.info_labels .lb_flins .amount').text(data.data.counts.follows);
			$('.user_img').css(`background-image`,`url(${data.data.profile_picture})`);
		});


		axios.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=1387185290.543433f.4b71ac6a690943c7bcf2d9d69dc7ad26')
		.then(({data}) => {
			console.log(data);
			let itemList = data.data.map(
				item => {
					if(item.carousel_media) {
						 return {images :item.carousel_media, user: item.user, likes: item.likes.count, caption: item.caption}
					} else {
						 return {images:[{images: item.images,}], user: item.user, likes: item.likes.count, caption: item.caption}
					}
				}
			);

			let thumbList = data.data.map(
				item => {
					return {
					thumbnail: item.images.thumbnail,
					type: item.type
					}
				}
			);

			console.log(itemList);
			console.log(thumbList);

			itemList.map(
				(item, index) => {
					let current_idx = index;
					let template ='';

					template += `
					<div class="image-item insta-page" id="post_idx_${current_idx}">
						<div class="user_info_bar">
							<span class="media_user_img">
								<img src="${item.user.profile_picture}"/>
							</span>
							<span class="media_user_name">${item.user.username}</span>
							
							<div class="modify_btns">
								<button class="btn_options">≡</button>
								<button class="edit">edit</button>
								<button class="delete">delete</button>
							</div>
						</div>
						<div class="images_wrap">
							<div class="slider instagram_slider">
							</div>
						</div>
						<div class="img-backdrop-tutorial">
							<div class="media_btns">
								<button class="btn_like">Like</button>
								<button class="btn_comment">Comment</button>
								<button class="btn_share">Share</button>
							</div>
							<div class="insta-caption">
								<p>Liked by <span class="likes">${item.likes} others</span></p>
								<p>${item.caption.text}</p>
							</div>
						</div>
						<div class="captions">
							<a></a>
						</div>
					</div>
					`;

					$('#temp-insta_feed').append(template);
					console.log(item.images);

					item.images.map(
						(image) => {
							let url = '';
							if(image.type == "video") {
								if(image.videos.standard_resolution) {
									url = image.videos.standard_resolution.url;

								}
							}else{
							url = image.images.standard_resolution.url;
							}

							let ele = image.type == "video" ?
							 `<video controls=""  name="media"><source src="${url}" type="video/mp4"></video>` :`<img src="${url}" width="${image.width}"/>`;
								
							let images = ``;
							images += `
								<div>
									${ele}
								</div>`;

							$(`#post_idx_${current_idx} .images_wrap > div`).append(images);
						}
					)
				}
			)

			setTimeout(function(){
				$(".instagram_slider").slick({
					infinite: false,
					dots: true,
					arrows: false,
					fade: false,
					slidesToScroll:1,
				});
			}, 1500);

			let createThumbnail = function() {thumbList.map(
				item => {
						let template ='';
						template += `
						<a class="image insta-image" href="#none">
							<span class="media_type ${item.type}">${item.type}</span>
							<img alt="" src="${item.thumbnail.url}" width="${item.thumbnail.width}">
						</a>
						`
						$('#temp-insta_square').append(template);
					}
				)
			};

			createThumbnail();

			let infinityScroll = function() {
				var win = $("#medias");

				win.scroll(function() {
					let winHeight = $("#medias").height();
					let winScrollTop = winHeight + win.scrollTop();

					if ($("#temp-insta_square").height() - winScrollTop < 50) {
							createThumbnail();
					}
				});
			};

			infinityScroll();
		})
	}());


	
var close_popup = (function(){
	var $win_btns = $('.popup .win_btns');
	var $pop_btns = $('.popup .pop_btns');

	$win_btns.on('click','button',function(e) {
		if($(e.currentTarget).hasClass('win_close')) {
			$(e.currentTarget).parents('.popup').removeClass('is-active');
		}
	});

	$pop_btns.on('click','button',function(e) {
		if($(e.currentTarget).hasClass('pop_submit')) {
			console.log('submit');
			// $(e.currentTarget).parents('.popup').removeClass('is-active');
		}else if($(e.currentTarget).hasClass('pop_cancel')) {
			console.log('cancel');
			// $(e.currentTarget).parents('.popup').removeClass('is-active');
		}
	});
}());


if($('.content_sort_lst').length){
		// oSortImgList.init();
		var sortImgList = new oSortImgList({wrapper: ".content_sort_lst", btn: "button", list: "#medias"});
		sortImgList._$init();
		}
		
		var aOpenPopup = new OpenPopup({btns: $('button'), popups: $('.popup')});

		aOpenPopup._$init();
})

var oSortImgList = (function () {
	function oSortImgList(param) {
		param = param || {};

		this._$init = function() {
				$(param.wrapper).on("click", param.btn, function(e) {
					var sortBy = $(e.currentTarget).data("sortBy");
						changeListStyle($(param.list), sortBy);
				});
			};
	}

	var changeListStyle = function(oImgList, sortBy) {
		oImgList.removeAttr('class');
		oImgList.addClass(`pic_sort_${sortBy}`);
	}

	return oSortImgList;
}());

var OpenPopup = (function() {
	function OpenPopup(param) {
		param = param || {};
		
		this._$init = function() {

			$(param.btns).on('click',  function (e) {

				if($(e.currentTarget).data("popupName")) {
					var openPopup = $(e.currentTarget).data("popupName");
				}
			
				openedPopupSet(openPopup, param.popups)
			});
		};

		var openedPopupSet = function(popupName, popups) {
			popups
			.find(`.${popupName}`)
			.parent('.popup')
			.addClass('is-active');
		}
	}

	return OpenPopup;
}());




// var oSortImgList = (function (){

// 	function init() {
// 		var oBtnList = $('.content_sort_lst'),
// 				oImgList = $('#tutorial-instafeed');

// 		oBtnList.on("click", "button", function(e){
// 			var sortBy = $(e.currentTarget).data("sortBy");
// 			oImgList.removeAttr('class');
// 			oImgList.addClass(`is_sort_${sortBy}`);
// 		});
// 	}

// 	return {
// 		init: init
// 	};
// }());
