Handlebars.registerHelper('comment_time', function() {
    return Session.get('comment_time') - 1;
});

Handlebars.registerHelper('delays', function() {
	return Delays.find();
});

Handlebars.registerHelper('current_campaign', function() {
	return Campaigns.findOne(Session.get('current_campaign_id'));
});