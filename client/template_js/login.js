Template.login.rendered = function() {
    $('.dropdown-toggle').css('opacity', 0);
	$('#login-dropdown-list .dropdown-menu').show();
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
			
		Meteor.user().loginToLimelight(domain, username, password, function(cookieToken) {
			Session.set('loading_limelight_login', false);
			if(cookieToken) {
				Meteor.user().saveLimelightCredentials(domain, username, password);
				Meteor.user().createLimelightApiAccount();
				Router.go('dashboard');
			}
			else FlashMessages.sendError('Your Limelight credentials are incorrect.', {autoHide: false});
		});
	}
});


