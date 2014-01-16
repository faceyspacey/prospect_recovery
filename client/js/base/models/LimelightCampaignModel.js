/** LimelightCampaignModel attributes:
 *
 *  minutes                        						int
 *  name                        						Str
 *  limelight_actual_campaign_id      					Int
 *  user_id	  											Str
 *  recipient_campaign_id								Str
 *	destination_campaign_id								Str
 */

LimelightCampaignModel = function(doc) {
	this.collectionName = 'LimelightCampaigns';
	this.defaultValues = {};
	
	
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};



LimelightCampaignModel.prototype = {
	isRecipientCampaign: function() {
		return !!this.recipient_campaign_id;
	},
	isCurrentRecipientCampaign: function(currentCampaign) {
		if(!this.recipient_campaign_id) return false;
		return this.recipient_campaign_id == currentCampaign._id;
	},
	isDestinationCampaign: function() {
		return !!this.destination_campaign_id;
	},
	isCurrentDestinationCampaign: function(currentCampaign) {
		if(!currentCampaign.limelight_destination_campaign_id) return false;
		return this._id == currentCampaign.limelight_destination_campaign_id;
	},
	user: function() {
		return Meteor.users.findOne(this.user_id);
	},
	url: function() {
		return this.user().limelight_domain +'/admin/campaign/profile.php?id='+this.id;
	}
};