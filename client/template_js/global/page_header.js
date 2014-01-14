Template.page_header.events({
	'click #logout': function() {
		Meteor.logout();
		Deps.afterFlush(function() {
			Router.go('home');
		});
	}
});