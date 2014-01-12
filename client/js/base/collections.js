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

prospectsIncrementAmount = 30,
Deps.autorun(function() {	
	var page = Session.get('prospects_page'),
		limit = page * prospectsIncrementAmount,
		campaignId = Session.get('my_recoveries_campaign_id');
		
	prospectsSub = Meteor.subscribe('prospects', limit, campaignId);
});




Stats = new Meteor.Collection("stats");


Deps.autorun(function() {
	var campaignId = Session.get('chart_campaign_id') || 'all',
		days = Session.get('chart_days') || 7;
	
	console.log('stats subscription autorun');
		
	Meteor.subscribe('stats', campaignId, days);
});

Stats.find().observeChanges({
	changed: function() {
		console.log('stats observeChanges - changed');
		if(Router.current() && Router.current().route.name == 'dashboard') displayChart();
	}
});






