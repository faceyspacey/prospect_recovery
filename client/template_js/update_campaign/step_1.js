Template.step_1.created = function() {
	Deps.afterFlush(function() {
		$('#campaign_step_1').animate({left: '0%'}, 800, 'easeOutBack');
	});
};


Template.step_1.rendered = function() {
	$('#campaign_step_1').css({left: '0%'});
};

Template.step_1.events({
	'click .next-step': function() {
		campaign = new CampaignModel();
		campaign.name = $('#campaign_name').val();
		campaign.url = $('#campaign_url').val();
		campaign.from_email = $('#campaign_email').val();
		campaign.from_name = $('#from_name').val();
		campaign.minutes_delay = parseInt($('#email_delay').val());
		campaign.user_id = Meteor.userId();
		campaign.complete = false;
		
		var _id = campaign.save();
		
		$('#campaign_step_1').animate({left: '-100%', opacity: 0}, 600, 'easeInBack', function() {
			Router.go('update_campaign_step_2', {id: _id});
		});
	}
});