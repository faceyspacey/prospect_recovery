Meteor.startup(function() {
	Meteor.setTimeout(function() {
		ProspectFinder.findAllProspects();
		Meteor.setInterval(function() {
			ProspectFinder.findAllProspects();
		}, 60 * 1000);
	}, 10);
	
	Meteor.setTimeout(function() {
		CustomerFinder.findAllCustomers();
		Meteor.setInterval(function() {
			CustomerFinder.findAllCustomers();
		}, 60 * 1000);
	}, 333);
	
	
	Meteor.setTimeout(function() {
		ProspectMailer.sendEmails();
		Meteor.setInterval(function() {
			ProspectMailer.sendEmails();
		}, 60 * 1000);
	}, 666);


});
