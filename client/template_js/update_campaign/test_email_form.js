Template.test_email_form.created = function() {
	Deps.afterFlush(function() {
		$('#test_email_form').animate({right: '0%'}, 800, 'easeOutBack');
	});
};

Template.test_email_form.rendered = function() {
	$('#test_email_form').css({right: '0%'});
};

Template.test_email_form.events({
	'click .next-step': function() {
		var prospect = new ProspectModel();
		
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


		var campaign = CampaignModel.current();
		
		prospect.campaign_id = campaign._id;
		prospect.save();
		
		
		if($('.send_to_test_page').is(':checked')) campaign.url = getCurrentHost() + '/example/page-1';
		
		Meteor.call('sendProspectEmail', prospect, campaign, Meteor.user().getEmail());
		
		
		$('#test_email_form').animate({left: '100%', opacity: 0}, 600, 'easeInBack', function() {
			Router.go('my_recoveries');
		});
	}
});