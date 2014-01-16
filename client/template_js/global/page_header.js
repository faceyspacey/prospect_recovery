Template.page_header.events({
	'click #logout': function() {
		Router.go('home');
		Meteor.logout();
	}
});