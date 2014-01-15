$(function() {
	$('#site_images img').live('mouseenter', function() {
		$(this).animate({top: '-=10'}, 200, 'easeInBack');

		var index = $('#site_images img').index(this);
		$('#site_image_drop_shadows .drop_shadow').eq(index).animate({top: '+=5'}, 200, 'easeInBack');
	})
	.live('mouseleave', function() {
		$(this).animate({top: '+=10'}, 200, 'easeOutBack');

		var index = $('#site_images img').index(this);
		$('#site_image_drop_shadows .drop_shadow').eq(index).animate({top: '-=5'}, 200, 'easeOutBack');
	})
	.live('click', function() {
		var src = $(this).attr('src'),
			id = 'homepage_image_'+$('#site_images img').index(this);
		
		
		if($('img.lightbox_image.showing').length !== 0) {
			$('img.lightbox_image.showing').animate({
				top: -600,
				opacity: 0
			}, 550, 'easeInBack', function() {
				displayLightbox(src, id);
			});
		}		
		else displayLightbox(src, id);
		
	});
});

displayLightbox = function(src, id) {
	if($('#'+id).length === 0) { //append the image if it doesn't exist yet
		$('<img />', {
			id: id,
			src: src,
			class: 'lightbox_image'
		}).css({
			position: 'absolute', 
			zIndex: 99,
			cursor: 'pointer',
			borderRadius: 5,
			opacity: 0,
			left: '50%',
			marginLeft: -400,
			top: -600,
			width: 800
		}).prependTo('body').animate({ //animate in
				top: 120,
				opacity: 1
		}, 650, 'easeOutBack', function() { 
			$(this).addClass('showing');
		}).click(function() { //click to make disappear
			$(this).removeClass('showing');
			$(this).animate({
				top: -600,
				opacity: 0
			}, 550, 'easeInBack');
		});
	}
	else { //just display it because it exists already.
		$('#'+id).animate({
			top: 120,
			opacity: 1
		}, 650, 'easeOutBack', function() {
			$(this).addClass('showing');
		});
	}
}