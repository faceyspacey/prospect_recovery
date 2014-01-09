LoginController = RouteController.extend({
	layoutTemplate: 'login_layout'
}); 


PanelController = RouteController.extend({
	layoutTemplate: 'main_layout',

  	before: function () {
		Session.set('current_page', this.route.name);
		
		if(!this.template) this.template = this.route.name;
		
		if(this.route.name == 'home') Session.set('current_page', 'dashboard'); //delete this eventually
		if(this.route.name == 'home') this.template = 'dashboard'; //delete this eventually
		
		if(!Meteor.user()) {
			Deps.afterFlush(function() {
				Router.go('login');
			});
		}
		if(Meteor.user() && !Meteor.user().limelight_login_configured) {
			Deps.afterFlush(function() {
				Router.go('limelight_account_info');
			});
		}
	},
	after: function () {},
	waitOn: function () {}
});

Router.map(function () {
	/** Public **/
	this.route('home', {
    	path: '/',
		template: 'dashboard',
		controller: PanelController
  	}); 
	this.route('login', {
    	path: '/login',
		template: 'login',
		controller: LoginController
  	});

	/** PanelController **/
	this.route('limelight_account_info', {
    	path: '/limelight',
		template: 'limelight_account_info',
		controller: LoginController
  	});

	this.route('dashboard', {
    	path: '/dashboard',
		controller: PanelController
  	});
	this.route('my_campaigns', {
    	path: '/my-campaigns',
		controller: PanelController
  	});
	this.route('my_recoveries', {
    	path: '/my-recoveries',		
		controller: PanelController
  	});
	this.route('realtime_metrics', {
    	path: '/realtime-metrics',
		controller: PanelController
  	});
	this.route('update_campaign_step_1', {
    	path: '/campaign/update/step-1',
		template: 'step_1',
		controller: PanelController
  	});
	this.route('update_campaign_step_2', {
    	path: '/campaign/update/step-2',
		template: 'step_2',
		controller: PanelController
  	});
	this.route('create_campaign', {
    	path: '/campaign/create',
		controller: PanelController
  	});
	this.route('edit_campaign', {
    	path: '/campaign/edit',
		controller: PanelController
  	});
	this.route('view_campaign', {
    	path: '/campaign/view',
		controller: PanelController
  	});
	this.route('my_account', {
    	path: '/my-account',
		controller: PanelController
  	});
});



//meteor really needs a way to specify a login callback as part of the accounts-password package so we dont need to do this:
Deps.autorun(function() {
    if(Meteor.user()) {
		try {
			if(Router.current().route.name == 'login') Router.go('dashboard');
		}
		catch(error) {} //Router.current() undefined at first, and therefore errs
	}
	else Router.go('login');
});



Handlebars.registerHelper('isCurrent', function(tab) {
	return tab == Session.get('current_page') ? 'current' : '';
});