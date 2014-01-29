PublicController = RouteController.extend({
	layoutTemplate: 'public_layout'
});

LoginController = RouteController.extend({
	layoutTemplate: 'login_layout',
	before: function() {
		if(Router.current() && Router.current().route.name == 'limelight_account_info') {
			if(!Meteor.user()) {
				Deps.afterFlush(function() {
					Router.go('login');
				});
			}
			else if(Meteor.user().limelight_login_configured) {
				Deps.afterFlush(function() {
					Router.go('dashboard');
				});
			}
		}
	}
}); 

ExampleSiteController = RouteController.extend({
	layoutTemplate: 'example_site_layout'
});


PanelController = RouteController.extend({
	layoutTemplate: 'main_layout',

  	before: function () {
		if(!this.ready()) return;
		
		Session.set('current_page', this.route.name);	
		if(!this.template) this.template = this.route.name;

		console.log('before triggered');
		
		var user = Meteor.user();
		Deps.afterFlush(function() {
			if(user) {
				if(!user.limelightCredentialsWorking()) Router.go('limelight_account_info');
				else RT.redirectIf(user.isNewUser(), 'update_campaign_step_1');
			}
			else Router.go('login');
		});
	},
	action: function() {
		console.log('controller action render');
		this.render();
	},
	after: function () {},
	waitOn: function () {
		return campaignsSub;
	}
});

Router.map(function () {
	/** Public **/
	this.route('home', {
    	path: '/',
		template: 'home',
		controller: PublicController
  	}); 
	this.route('faq', {
    	path: '/faq',
		template: 'faq',
		controller: PublicController
  	});
	this.route('faq_private', {
    	path: '/faq-private',
		template: 'faq_private',
		controller: PublicController
  	});

	this.route('login', {
    	path: '/login',
		template: 'login',
		before: function() {
			Session.set('Meteor.loginButtons.inSignupFlow', false);
		},
		controller: LoginController
  	});
	this.route('signup', {
    	path: '/signup',
		template: 'login',
		before: function() {
			Session.set('Meteor.loginButtons.inSignupFlow', true);
		},
		controller: LoginController
  	});
	this.route('limelight_account_info', {
    	path: '/limelight',
		template: 'limelight_account_info',
		controller: LoginController
  	});


	/** PanelController **/
	this.route('dashboard', {
    	path: '/dashboard',
		controller: PanelController
  	});

	this.route('my_recoveries', {
    	path: '/my-recoveries',		
		controller: PanelController
  	});

	this.route('my_campaigns', {
    	path: '/my-campaigns',
		controller: PanelController,
		before: function() {
			Campaigns.find({complete: false, user_id: Meteor.userId()}).forEach(function(campaign) {
				campaign.update({limelight_destination_campaign_id: null});
				Meteor.call('unsetLimelightCampaigns', campaign._id);
			});
		}
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
	this.route('test_email', {
    	path: '/campaign/test/:id',
		before: function() {
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
		before: function() {
			Session.set('p', this.params.p);
			Session.set('c', this.params.c);
		},
		controller: ExampleSiteController
  	});
	this.route('page_2', {
    	path: '/example/page-2',
		controller: ExampleSiteController
  	});
	this.route('page_2', {
    	path: '/example/page-2/:p/:c/:order_id',
		before: function() {
			Session.set('p', this.params.p);
			Session.set('c', this.params.c);
			Session.set('order_id', this.params.order_id);
		},
		controller: ExampleSiteController
  	});
});