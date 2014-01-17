LimelightCampaigns = new Meteor.Collection('limelight_campaigns');

Meteor.publish("limelight_campaigns", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return LimelightCampaigns.find();
    else return LimelightCampaigns.find({user_id: this.userId});
});


LimelightCampaigns.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = moment().toDate();
        doc.updated_at = moment().toDate();
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = moment().toDate();
        return doc.user_id == userId || Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return doc.user_id == userId || Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id', 'created_at', 'updated_at']
});


Meteor.methods({
	setRecipientLimelightCampaigns: function(ids, campaignId) {
		console.log('setRecipientLimelightCampaigns', ids, campaignId);
		
		LimelightCampaigns.update({recipient_campaign_id: campaignId}, {$set: {recipient_campaign_id: null}}, {multi: true}, function() {
			LimelightCampaigns.update({_id: {$in: ids}}, {$set: {recipient_campaign_id: campaignId}}, {multi: true});
		});
	},
	unsetLimelightCampaigns: function(campaignId) {
		LimelightCampaigns.update({recipient_campaign_id: campaignId}, {$set: {recipient_campaign_id: null}}, {multi: true}, function() {
			LimelightCampaigns.update({destination_campaign_id: campaignId}, {$set: {destination_campaign_id: null}}, {multi: true});
		});
	}
});
