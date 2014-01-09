Template.page_header.events({
	'click #logout': function() {
		Meteor.logout();
	}
});