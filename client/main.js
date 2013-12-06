LoginController = RouteController.extend({
	layoutTemplate: 'login_layout',
});

PanelController = RouteController.extend({
	layoutTemplate: 'main_layout',

  	before: function () {
		Session.set('current_page', this.route.name);
		
		this.template = this.route.name;
		
		if(this.route.name == 'home') Session.set('current_page', 'dashboard'); //delete this eventually
		if(this.route.name == 'home') this.template = 'dashboard'; //delete this eventually
	},
	after: function () {},
	waitOn: function () {
		
	}
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


Handlebars.registerHelper('isCurrent', function(tab){
	return tab == Session.get('current_page') ? 'current' : '';
});