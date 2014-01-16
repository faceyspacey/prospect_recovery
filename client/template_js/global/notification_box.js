Template.notification_box.created = function() {
	var id = this.data._id;
	
	Deps.afterFlush(function() {
		setTimeout(function() {
			$('.notification_box').animate({
				bottom: '+=130'
			}, 300, 'easeOutBack');
		},50);
	});
	
	setTimeout(function() {
		$('#notification_'+id).animate({
			bottom: -120
		}, 300, 'easeInBack', function() {
			$(this).remove();
		});
	}, 5000);
};
