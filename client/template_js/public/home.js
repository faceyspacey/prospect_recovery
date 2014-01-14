$(function() {
	$('#site_images img').live('mouseenter', function() {
		$(this).animate({top: '-=10'}, 200, 'easeInBack');

		var index = $('#site_images img').index(this);
		$('#site_image_drop_shadows .drop_shadow').eq(index).animate({top: '+=5'}, 200, 'easeInBack');
	}).live('mouseleave', function() {
		$(this).animate({top: '+=10'}, 200, 'easeOutBack');

		var index = $('#site_images img').index(this);
		$('#site_image_drop_shadows .drop_shadow').eq(index).animate({top: '-=5'}, 200, 'easeOutBack');
	});
});