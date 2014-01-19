Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};

Campaigns = new Meteor.Collection("campaigns", {
    transform: function (doc) { return new CampaignModel(doc); }
});

Delays = new Meteor.Collection("delays", {
    transform: function (doc) { return new DelayModel(doc); }
});

LimelightCampaigns = new Meteor.Collection('limelight_campaigns', { //create local-only (temporary) mini-mongo collection
    transform: function (doc) { return new LimelightCampaignModel(doc); }
});

Prospects = new Meteor.Collection("prospects", {
    transform: function (doc) { return new ProspectModel(doc); }
});



usersSub = Meteor.subscribe('users');
campaignsSub = Meteor.subscribe('campaigns');
limelightCampaignsSub = Meteor.subscribe('limelight_campaigns');
delaysSub = Meteor.subscribe('delays');


//subscribe to prospects based on how many pages the user has loaded, and what campaign is chosen
prospectsIncrementAmount = 30,
Deps.autorun(function() {	
	var page = Session.get('prospects_page') || 1,
		limit = page * prospectsIncrementAmount,
		campaignId = Session.get('my_recoveries_campaign_id') || 'all';
		
	prospectsSub = Meteor.subscribe('prospects', limit, campaignId, function() {
		setupNotificationsObservation();
	});
});


prospectObseverAdded = null
prospectObseverChanged = null;
setupNotificationsObservation = function() {
	Deps.afterFlush(function() {
		if(prospectObseverAdded) prospectObseverAdded.stop();
		if(prospectObseverChanged) prospectObseverChanged.stop();

		if(!Meteor.user() || !Meteor.user().timezone) return false;
		var now = moment().zone(Meteor.user().timezone).toDate();
		prospectObseverAdded = Prospects.find({created_at: {$gt: now}}).observeChanges({
			added: function(id, fields) {
				console.log('prospect discovered', fields);
				if(fields.status === 0) Prospects.findOne(id).displayNotification();
			}
		});

		prospectObseverChanged = Prospects.find().observeChanges({
			changed: function(id, fields) {
				console.log('prospect delivered', fields);
				if(fields.status) Prospects.findOne(id).displayNotification();
			}
		});
	});
};
Deps.autorun(function() {
	setupNotificationsObservation();
});



Stats = new Meteor.Collection("stats", {
    transform: function (doc) { return new StatsModel(doc); }
});

//auto run dashboard graph stats based on campaign, and chart days
Deps.autorun(function() {
	var campaignId = Session.get('chart_campaign_id') || 'all',
		days = Session.get('chart_days') || 12;

	console.log('stats subscription autorun');
	Meteor.subscribe('stats', Meteor.userId(), campaignId, days, viewerTimezone());	
});

Stats.find().observeChanges({
	changed: function() {
		console.log('stats observeChanges - changed');
		if(Router.current() && Router.current().route.name == 'dashboard') displayChart();
	}
});






