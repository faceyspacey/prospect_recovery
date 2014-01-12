//meteor really needs a way to specify a login callback as part of the accounts-password package so we dont need to do this:
Deps.autorun(function() {
    if(Meteor.user()) {
		try {
			if(Router.current().route.name == 'login') {
				Router.go('dashboard');
				loginCallback();
			}
		}
		catch(error) {} //Router.current() undefined at first, and therefore errs
	}
	else Router.go('login');
});

loginCallback = function() {
	if(!Meteor.user().limelight_login_configured) Meteor.user().updateLimelightCampaigns();
};

