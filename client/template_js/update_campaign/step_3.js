Template.step_3.created = function() {
	Deps.afterFlush(function() {
		var embedCode = Template.embed_code({host: getCurrentHost()});
		$('#copy_paste_code').text(embedCode);
		
		$('#campaign_step_3').animate({left: '0%'}, 800, 'easeOutBack');
	});
};

Template.step_3.rendered = function() {
	$('#campaign_step_3').css({left: '0%'});
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
		var campaign = CampaignModel.current(),
			email = $('#campaign_email').val(),
			html = $('#campaign_email_html').val(),
			plain = $('#campaign_email_plain').val();
		
		//confirm email, which must be valid to configure mailgun domain, etc	
		if(!isValidEmailBasic(email)) {
			FlashMessages.sendError("You entered an invalid email address. Please fix it. It's key to this whole thing :)");
			$('html,body').animate({scrollTop: 0}, 750, 'easeInExpo');
			return;
		}
		
		//confirm campaign has [DESTINATION_URL]
		if(html.indexOf('[DESTINATION_URL]') === -1 || plain.indexOf('[DESTINATION_URL]') === -1) {
			FlashMessages.sendError("Oops! You forgot the most important part. Please provide a [DESTINATION_URL] token for both HTML and PLAIN emails.");
			$('html,body').animate({scrollTop: 0}, 750, 'easeInExpo');
			return;
		}
				
		//set back data from fields
		campaign.email_subject = $('#campaign_email_subject').val();
		campaign.email_html = $('#campaign_email_html').val();
		campaign.email_plain = $('#campaign_email_plain').val();	
		campaign.name = $('#campaign_name').val();
		campaign.url = $('#campaign_url').val();
		campaign.from_email = $('#campaign_email').val();
		campaign.domain = campaign.getDomain();
		campaign.from_name = $('#from_name').val();
		campaign.minutes_delay = parseInt($('#email_delay').val());
		campaign.continue_recovery = $('#continue_recovery').is(':checked');
		campaign.complete = true;
		campaign.play = true;
			
		//create mailgun domains only if not created before
		var campaignWithDomain = Campaigns.findOne({domain: campaign.domain, mailgun_dkim_hostname: {$not: undefined}});
		if(!campaignWithDomain) Meteor.call('createMailgunDomain', campaign._id, campaign.domain);
		else { 
			campaign.mailgun_dkim_hostname = campaignWithDomain.mailgun_dkim_hostname;
			campaign.mailgun_dkim_value = campaignWithDomain.mailgun_dkim_value;
		}
		
		//booya
		campaign.save();
		
		//allow recovery of prospects even from destination campaign (i.e. deliver 2nd emails to the same user)
		var destId = campaign.limelight_destination_campaign_id;
		if(campaign.continue_recovery) LimelightCampaigns.update(destId, {$set: {recipient_campaign_id: campaign._id}});
		else LimelightCampaigns.update(destId, {$set: {recipient_campaign_id: undefined}});
		
		//on to the next one...
		Router.go('my_campaigns');
	},
	'click .cancel': function() {
		campaign = CampaignModel.current();
		campaign.status = 'pause';
		
		campaign.save();
		
		Router.go('my_campaigns');
	}
});