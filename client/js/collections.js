Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};

Campaigns = new Meteor.Collection("campaigns", {
    transform: function (doc) { return new CampaignModel(doc); }
});

Delays = new Meteor.Collection("delays", {
    transform: function (doc) { return new DelayModel(doc); }
});

usersSub = Meteor.subscribe('users');
campaignsSub = Meteor.subscribe('campaigns');
delaysSub = Meteor.subscribe('delays');




//client only Collections
LimelightCampaigns = new Meteor.Collection(null, { //create local-only (temporary) mini-mongo collection
    transform: function (doc) { return new LimelightCampaignModel(doc); }
});


