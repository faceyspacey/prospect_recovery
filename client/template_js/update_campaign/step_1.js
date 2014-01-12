Template.step_1.created = function() {
	Deps.afterFlush(function() {
		$('#campaign_step_1').animate({left: '0%'}, 800, 'easeOutBack');
	});
};

Template.step_1.events({
	'click .next-step': function() {
		campaign = new CampaignModel();
		campaign.name = $('#campaign_name').val();
		campaign.url = $('#campaign_url').val();
		campaign.completion_url = $('#completion_campaign_url').val();
		campaign.email = $('#campaign_email').val();
		campaign.minutes_delay = parseInt($('#email_delay').val());
		campaign.user_id = Meteor.userId();
		campaign.complete = false;
		
		var _id = campaign.save();
	
		Meteor.user().updateLimelightCampaigns();
		
		$('#campaign_step_1').animate({left: '-100%', opacity: 0}, 600, 'easeInBack', function() {
			Router.go('update_campaign_step_2', {id: _id});
		});
	}
});