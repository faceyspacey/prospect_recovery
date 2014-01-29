Template.test_email.created = function() {
	Deps.afterFlush(function() {
		setTimeout(function() {
			$('#test_email_form').animate({right: '0%'}, 800, 'easeOutBack');
			Template.test_email.is_created = true;
		}, 100);
	});
};

Template.test_email.destroyed = function() {
	Template.test_email.is_created = false;
};

Template.test_email.rendered = function() {
	if(Template.test_email.is_created) $('#test_email_form').css({right: '0%'});
};

Template.test_email.events({
	'click .next-step': function() {
		var prospect = new ProspectModel(),
			testEmail = $('#test_email').val();
	
		if(!isValidEmailBasic(testEmail)) {
			FlashMessages.sendError("Where do you want this test email to go? Please fill out the final field at the bottom.", {hideDelay: 10000});
			$('html,body').animate({scrollTop: 0}, 500, 'easeOutExpo');
			return;
		}
		
		
		prospect.first_name = $('.vortex_first_name').val();
		prospect.last_name = $('.vortex_last_name').val();
		prospect.email = $('.vortex_email').val();
		prospect.phone = $('.vortex_phone').val();
		prospect.address = $('.vortex_address').val();
		prospect.address_2 = $('.vortex_address_2').val();
		prospect.city = $('.vortex_city').val();
		prospect.state = $('.vortex_state').val();
		prospect.country = $('.vortex_country').val();
		prospect.zip = $('.vortex_zip').val();
		prospect.ip_address = $('.vortex_ip_address').val();
		prospect.status = 0;
		prospect.discovered_at = moment().toDate();
		prospect.created_at = moment().toDate();
		prospect.updated_at = moment().toDate();

		var campaign = CampaignModel.current();

		prospect.campaign_id = campaign._id;
		prospect.user_id = campaign.user_id;
		prospect.save();
		
		
		if($('.send_to_test_page').is(':checked')) campaign.url = getCurrentHost() + '/example/page-1';
		
		Meteor.call('sendProspectEmail', prospect, campaign, testEmail);
		
		
		$('#test_email_form').animate({left: '100%', opacity: 0}, 600, 'easeInBack', function() {
			Router.go('my_recoveries');
		});
	}
});