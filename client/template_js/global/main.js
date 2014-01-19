Template.main_layout.helpers({
	notifSelected: function(onOff) {
		if(Session.equals('notifications_on_off', 'on') && onOff == 'on') return 'primary';
		if(Session.equals('notifications_on_off', 'off') && onOff == 'off') return 'primary';
		return 'default';
	}
});

Template.main_layout.events({
	'click #notification_off': function() {
		return Session.set('notifications_on_off', 'off');
	},
	'click #notification_on': function() {
		return Session.set('notifications_on_off', 'on');
	}
});

Template.main_layout.created = function() {
	if(!Session.get('notifications_on_off')) Session.set('notifications_on_off', 'on');
};