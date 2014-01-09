Template.step_1.created = function() {
	Deps.afterFlush(function() {
		$('#campaign_step_1').animate({left: '0%'}, 800, 'easeOutBack');
	});
};

Template.step_1.events({
	'click .next-step': function() {
		campaign = new CampaignModel();
		campaign.title = $('#campaign_name').val();
		campaign.minutes_delay = $('#email_delay').val();
		campaign.complete = false;
		
		var _id = campaign.save();
		Session.set('current_campaign_id', _id);
		
		Meteor.user().limelightCampaigns(function(campaigns) {		
			$('#campaign_step_1').animate({left: '-100%', opacity: 0}, 600, 'easeInBack', function() {
				Router.go('update_campaign_step_2');
			});
		});
	}
});