LimelightCampaignModel = function(doc) {
	doc = doc || {};
	_.extend(this, doc);
	
    return this;
};



LimelightCampaignModel.prototype = {
	isRecipientCampaign: function() {
		return _.indexOf(this.recipientCampaigns(), this.id) > -1 ? true : false;
	},
	recipientCampaigns: function() {
		return this.campaign ? this.campaign.recipientLimelightCampaigns() : [];
	}
};
