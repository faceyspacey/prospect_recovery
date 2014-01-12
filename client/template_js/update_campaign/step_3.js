Template.step_3.created = function() {
	Deps.afterFlush(function() {
		$('#campaign_step_3').animate({left: '0%'}, 800, 'easeOutBack');
	});
};

Template.step_3.helpers({
	selected: function() {
		return this.minutes == CampaignModel.current().minutes_delay ? 'selected="selected"' : '';
	},
	checked: function() {
		return CampaignModel.current().continue_recovery ? 'checked="checked"' : '';
	}
});

Template.step_3.events({
	'click .next-step': function() {
		campaign = CampaignModel.current();
		
		campaign.email_html = $('#campaign_email_html').val();
		campaign.email_plain = $('#campaign_email_plain').val();
		
		campaign.name = $('#campaign_name').val();
		campaign.url = $('#campaign_url').val();
		campaign.completion_url = $('#completion_campaign_url').val();
		campaign.email = $('#campaign_email').val();
		campaign.minutes_delay = parseInt($('#email_delay').val());
		campaign.continue_recovery = $('#continue_recovery').is(':checked');
		campaign.complete = true;
		campaign.status = 'play';
		
		campaign.save();
		
		Router.go('my_campaigns');
	},
	'click .cancel': function() {
		campaign = CampaignModel.current();
		campaign.status = 'pause';
		
		campaign.save();
		
		Router.go('my_campaigns');
	}
});