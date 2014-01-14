Meteor.startup(function() {
	Meteor.setTimeout(function() {
		//Meteor.setInterval(ProspectFinder.findAllProspects, 60 * 1000);
	}, 0);
	
	Meteor.setTimeout(function() {
		//Meteor.setInterval(CustomerFinder.findAllCustomers, 60 * 1000);
	}, 333);
	
	Meteor.setTimeout(function() {
		//Meteor.setInterval(ProspectMailer.sendEmails, 60 * 1000);
	}, 666);
});
