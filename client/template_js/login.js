Template.login.rendered = function() {
    $('.dropdown-toggle').css('opacity', 0);
	$('#login-dropdown-list .dropdown-menu').show();
};

Template.limelight_account_info.events({
	'click #limelight_proceed': function() {
		var domain = $('#limelight_domain').val(),
			username = $('#limelight_username').val(),
			password = $('#limelight_password').val();
			
		Meteor.call('applyLimelightInfo', domain, username, password);
	}
});


