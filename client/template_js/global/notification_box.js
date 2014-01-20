Template.notification_box.created = function() {	
	var self = this.data,
		id = 'notification_'+self._id + '_' + self.getStatus();
		
	Deps.afterFlush(function() {	
		NotificationBox.raise();
		NotificationBox.changePageTitle(self);
		
		$('#'+id).on('click', function() {
			NotificationBox.hide(id);
		});
		
		
		setTimeout(function() {
			NotificationBox.hide(id);
		}, 5000);
	});
};


NotificationBox = {
	raise: function() {
		$('.notification_box').animate({
			bottom: '+=130'
		}, 300, 'easeOutBack');
	},
	hide: function(id) {
		$('#'+id).animate({
			bottom: -120
		}, 300, 'easeInBack', function() {
			$(this).remove();
		});
	},
	changePageTitle: function(self) {
		$('title').text(self.getStatus() + ': ' + self.email);
		setTimeout(function() {
			$('title').text('VORTEX CONVERT');
		}, 1500);
	}
}
