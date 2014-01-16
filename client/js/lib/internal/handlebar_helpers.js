Handlebars.registerHelper('delays', function() {
	return Delays.find();
});

Handlebars.registerHelper('current_campaign', function() {
	return CampaignModel.current();
});

Handlebars.registerHelper('getCurrentHost', function() {
	return getCurrentHost();
});

Handlebars.registerHelper('isCurrent', function(tab) {
	return tab == Session.get('current_page') ? 'current' : '';
});

Handlebars.registerHelper('activeTab', function(tab) {
	if(!Router.current()) return;
	
	return tab == Router.current().route.name ? 'active' : '';
});

Handlebars.registerHelper('isAdmin', function() {
	return Roles.userIsInRole(Meteor.userId(), ['admin']);
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

Handlebars.registerHelper('todaysDiscoveries', function() {
	if(!Stats.findOne()) return 0;
	return Stats.findOne().days[0].discoveries;
});


Handlebars.registerHelper('unapprovedCampaigns', function() {
	return Campaigns.find({complete: true, $or: [{approved: undefined}, {approved: false}]}).count()
});



shortenText = function(text, maxChars) {
	if(text.length <= maxChars) return text;
    else return text.substr(0, maxChars) + '...';
}

Handlebars.registerHelper('shorten', function(text, maxChars) {
	return shortenText(text, maxChars);
});


Handlebars.registerHelper('timezones', function() {
	return [
		{offset: 5, name: 'EST +5'},
		{offset: 6, name: 'CT +6'},
		{offset: 7, name: 'MT +7'},
		{offset: 8, name: 'PST +8'}
	];
});

Handlebars.registerHelper('selectedTimezone', function() {
	return this.offset == Meteor.user().timezone ? 'selected="selected"' : '';
})