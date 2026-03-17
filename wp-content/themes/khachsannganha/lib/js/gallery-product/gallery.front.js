jQuery(document).ready(function()
{
	if(jQuery('.dev3b-slider-for').length > 0)
	{		
		
		if(gallery_single_custom.gallery_style == '1'){ 
			var slider_style = false;
			jQuery('.woocommerce div.product .images').addClass('gallery-horizontal');
		}else{
			var slider_style = true;
			jQuery('.woocommerce div.product .images').addClass('gallery-vertical clearfix');
		}

		var slider_thumbnails = parseInt(gallery_single_custom.gallery_thumbnails);

		if(gallery_single_custom.gallery_popup != '1'){ 
			jQuery('a.dev3b-popup').remove();
		}
		
		if(gallery_single_custom.gallery_autoplay == '1'){ 
			var slider_autoplay = true;
		}else{
			var slider_autoplay = false;
		}
		
		jQuery('.dev3b-slider-for').slick({
			fade: true,
			autoplay : slider_autoplay,
			arrows: false,
			slidesToShow: 1,
			infinite: false,
			slidesToScroll: 1,
			asNavFor: '.dev3b-slider-nav'
		});
		
		jQuery('.dev3b-slider-nav').slick({
			dots: false,
			arrows: true,
			vertical : slider_style,
			centerMode: false,
			focusOnSelect: true,
			infinite: false,
			slidesToShow: slider_thumbnails,
			slidesToScroll: 1,
			asNavFor: '.dev3b-slider-for'
		});
		console.log(jQuery('.slick-active img.attachment-full').attr('width'));
		console.log(jQuery('.dev3b-slider-for .slick-slide').width());
		if(gallery_single_custom.gallery_zoom == '1'){
			jQuery('.dev3b-slider-for .slick-slide').zoom();
		}
		jQuery('.dev3b-slider-for .slick-track').addClass('woocommerce-product-gallery__image single-product-main-image');
		jQuery('.dev3b-slider-nav .slick-track').addClass('flex-control-nav');
		jQuery('.dev3b-slider-nav .slick-track li img').removeAttr('srcset');
		
		jQuery('.variations select').change(function(){
			jQuery('.dev3b-slider-nav').slick('slickGoTo', 0);
			window.setTimeout( function() {
				if(gallery_single_custom.gallery_zoom == '1'){
					jQuery('.dev3b-slider-for .slick-track .slick-current').zoom();
				}
			}, 20 );
		});
	}
});