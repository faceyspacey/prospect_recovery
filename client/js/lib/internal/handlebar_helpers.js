Handlebars.registerHelper('delays', function() {
	return Delays.find();
});

Handlebars.registerHelper('current_campaign', function() {
	return CampaignModel.current();
});

Handlebars.registerHelper('isCurrent', function(tab) {
	return tab == Session.get('current_page') ? 'current' : '';
});

Handlebars.registerHelper('stats', function() {
	return Stats.findOne();
});

Handlebars.registerHelper('breadCrumbs', function() {
	if(!Router.current()) return '';
	
	var route = Router.current().route.name;
	
	if(route == 'update_campaign_step_1') return '<li><a href="#">CREATE CAMPAIGN</a></li><li><a href="#">STEP 1</a></li>';
	if(route == 'update_campaign_step_2') return '<li><a href="#">UPDATE CAMPAIGN</a></li><li><a href="#">STEP 2</a></li>';
	if(route == 'update_campaign_step_3') return '<li><a href="#">UPDATE CAMPAIGN</a></li><li><a href="#">STEP 3</a></li>';
	
	return '<li><a href="#">'+route.replace(/_/g, ' ')+'</a></li>';
});

Handlebars.registerHelper('todaysRecoveries', function() {
	if(!Stats.findOne()) return 0;
	return Stats.findOne().days[0].recoveries;
});


