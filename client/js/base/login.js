//meteor really needs a way to specify a login callback as part of the accounts-password package so we dont need to do this:
Deps.autorun(function() {
	console.log('login auto run');

	if(!Router || !Router.current()) return; 
	
    if(Meteor.user()) {
		try {
			if(Router.current().route.name == 'login') {
				Router.go('dashboard');
				loginCallback();
			}
		}
		catch(error) {} //Router.current() undefined at first, and therefore errs
	}
	else {
		//only send users in panel to login, let other logged-out users be
		if(Router.current().layoutTemplate == 'main_layout') Router.go('login'); 
	}
});

loginCallback = function() {
	//if limelight credentials aren't working but we stored in the db that we think it is (i.e. in user.limelight_login_configured = true), then
	//here we will find out what's going on and end up marking user.limelight_login_configured = false if need be. i.e. each login, we make sure
	//limelight is working.
	console.log('logging in');
	if(Meteor.user().limelightCredentialsWorking()) Meteor.user().updateLimelightCampaigns();
};

