Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};

Campaigns = new Meteor.Collection("campaigns", {
    reactive: true,
    transform: function (doc) { return new CampaignModel(doc); }
});

usersSub = Meteor.subscribe('users');
campaignsSub = Meteor.subscribe('campaigns');


