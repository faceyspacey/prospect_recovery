var adminUsers = ['james@faceyspacey.com', 'zach@vortextraffic.com', 'stephen@vortextraffic.com', 'austin@vortextraffic.com'];

Accounts.onCreateUser(function (options, user) {	
	if(options.profile) user.profile = options.profile;
	else user.profile = {};
	
	if(_.contains(adminUsers, user.emails[0].address)) user.roles = ['admin', 'user'];
	else user.roles = ['user'];
	
	user.highest_limelight_campaign_id = -1;
	
	return user;
});


