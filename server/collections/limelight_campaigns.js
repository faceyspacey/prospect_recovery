LimelightCampaigns = new Meteor.Collection('limelight_campaigns');

Meteor.publish("limelight_campaigns", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return LimelightCampaigns.find();
    else return LimelightCampaigns.find({user_id: this.userId});
});


LimelightCampaigns.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = new Date;
        doc.updated_at = new Date;
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
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
		
		LimelightCampaigns.update({recipient_campaign_id: campaignId}, {$set: {recipient_campaign_id: undefined}}, {multi: true});
		LimelightCampaigns.update({_id: {$in: ids}}, {$set: {recipient_campaign_id: campaignId}}, {multi: true});
	}
});
