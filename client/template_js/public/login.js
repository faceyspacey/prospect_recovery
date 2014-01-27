Template.login.rendered = function() {
    $('.dropdown-toggle').css('opacity', 0);
	$('#login-dropdown-list .dropdown-menu').show();
};


Template.limelight_account_info.created = function() {
	Session.set('loading_limelight_login', false);
};


Template.limelight_account_info.helpers({
	loading: function() {
		return Session.get('loading_limelight_login');
	}
});

Template.limelight_account_info.events({
	'click #limelight_proceed': function() {	
		Session.set('loading_limelight_login', true);
		
		var domain = $('#limelight_domain').val(),
			username = $('#limelight_username').val(),
			password = $('#limelight_password').val();
		
		
		if(domain.substring(0, 12) != "https://www.") {
			Session.set('loading_limelight_login', false);
			return FlashMessages.sendError('Please enter your domain starting with "https://www."');
		}
		
		
		Meteor.call('domainInUse', domain, function(error, inUse) {
			if(error) return FlashMessages.sendError('Something is wrong with the domain you entered.'); 
			
			if(inUse) {
				Session.set('loading_limelight_login', false);
				return FlashMessages.sendError('That Limelight Domain is already in use. Only one user per domain please.');
			}
			else Meteor.user().loginToLimelight(domain, username, password);
		}); 
	}
});


