PublicController = RouteController.extend({
	layoutTemplate: 'public_layout'
});

LoginController = RouteController.extend({
	layoutTemplate: 'login_layout'
}); 

ExampleSiteController = RouteController.extend({
	layoutTemplate: 'example_site_layout'
});


PanelController = RouteController.extend({
	layoutTemplate: 'main_layout',

  	before: function () {
		Session.set('current_page', this.route.name);
		
		if(!this.template) this.template = this.route.name;
		
		if(!Meteor.user()) {
			Deps.afterFlush(function() {
				Router.go('login');
			});
		}
		if(Meteor.user() && !Meteor.user().limelightCredentialsWorking()) {
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
		template: 'home',
		controller: PublicController
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
	this.route('update_campaign_step_1', {
    	path: '/campaign/update/step-1',
		template: 'step_1',
		before: function() {
			Session.set('updateCampaignStep', 'Step 1');
		},
		controller: PanelController
  	});
	this.route('update_campaign_step_2', {
    	path: '/campaign/update/step-2/:id',
		template: 'step_2',
		before: function() {
			Session.set('updateCampaignStep', 'Step 2');
			Session.set('current_campaign_id', this.params.id);
		},
		controller: PanelController
  	});
	this.route('update_campaign_step_3', {
    	path: '/campaign/update/step-3/:id',
		template: 'step_3',
		before: function() {
			Session.set('updateCampaignStep', 'Step 3');
			Session.set('current_campaign_id', this.params.id);
		},
		controller: PanelController
  	});
	this.route('my_account', {
    	path: '/my-account',
		controller: PanelController
  	});


	/** ADMIN **/
	this.route('admin_campaign_approval', {
    	path: '/admin/campaign-approval',
		controller: PanelController
  	});
	this.route('admin_campaign_dns', {
    	path: '/campaign/admin/dns/:id',
		before: function() {
			Session.set('current_campaign_id', this.params.id);
		},
		controller: PanelController
  	});
	this.route('admin_campaign_pixel', {
    	path: '/campaign/admin/pixel/:id',
		before: function() {
			Session.set('current_campaign_id', this.params.id);
		},
		controller: PanelController
  	});

	/** EXAMPLE SITE **/
	this.route('page_1', {
    	path: '/example/page-1',
		controller: ExampleSiteController
  	});
	this.route('page_2', {
    	path: '/example/page-2',
		controller: ExampleSiteController
  	});
});