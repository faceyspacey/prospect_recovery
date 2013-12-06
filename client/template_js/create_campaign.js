Template.create_campaign.events({
	'click #create_campaign_btn': function(e) {
		e.preventDefault();
		Router.go('edit_campaign');
	}
});