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
		
	prospectsSub = Meteor.subscribe('prospects', limit, campaignId);
});


//display notifications 
Meteor.startup(function() {
	Prospects.find({created_at: {$gt: moment().zone(Meteor.user().timezone).toDate()}}).observeChanges({
		added: function(id, fields) {
			console.log('prospect discovered', fields);
			if(fields.status === 0) Prospects.findOne(id).displayNotification();
		}
	});

	Prospects.find().observeChanges({
		changed: function(id, fields) {
			console.log('prospect delivered', fields);
			if(fields.status) Prospects.findOne(id).displayNotification();
		}
	});
});




Stats = new Meteor.Collection("stats");


//auto run dashboard graph stats based on campaign, and chart days
Deps.autorun(function() {
	if(Router.current() && Router.current().route.name == 'dashboard') {
		var campaignId = Session.get('chart_campaign_id') || 'all',
			days = Session.get('chart_days') || 7;

		console.log('stats subscription autorun');
		Meteor.subscribe('stats', campaignId, days);
	}
	else {
		console.log('stats subscription turned off');
		Meteor.subscribe('stats', null);
	}
	
});

Stats.find().observeChanges({
	changed: function() {
		console.log('stats observeChanges - changed');
		if(Router.current() && Router.current().route.name == 'dashboard') displayChart();
	}
});






