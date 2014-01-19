Meteor.methods({
	updateLimelightCampaigns: function() {
		this.unblock();
		var limelightApiCampaigns = new LimelightApiCampaigns;
		return limelightApiCampaigns.updateCampaigns();
	}
});

LimelightApiCampaigns = function(username, password, domain, user) {
	this.limelightApi = new LimelightApi(username, password, domain);
	this.user = user || Meteor.user();
};


LimelightApiCampaigns.prototype = {
	updateCampaigns: function() {
		try {
			var response = this.limelightApi.api('campaign_find_active');
			if(response && response.content) {		
				var campaigns = this._parseLimelightCampaigns(response.content);
				this._storeLimelightCampaigns(campaigns);
			}
		}
		catch(error) {
			console.log('LimelightApi.updateCampaigns ERROR!', error);
			return false;
		}
		return true;
	},
	_parseLimelightCampaigns: function(response) {
		response = response.replace('response=100&campaign_id=', '');
		response = response.split('&campaign_name=');
		
		var campaignIds = response[0].split(','),
			campaignNames = response[1].split(',')
			campaigns = [];
			
		_.each(campaignIds, function(id, index) {
			campaigns.push({limelight_actual_campaign_id: parseInt(id), name: campaignNames[index]});
		});
		
		console.log('limelight campaigns parsed', campaigns);
		return campaigns;
	},
	_storeLimelightCampaigns: function(campaigns) {
		var highestId = this.user.highest_limelight_campaign_id,
			self = this;

		_.each(campaigns, function(campaign) {
			var id = campaign.limelight_actual_campaign_id;
			console.log(id,  self.user.highest_limelight_campaign_id, campaign);
			
			if(id > self.user.highest_limelight_campaign_id) {
				campaign.user_id = self.user._id;
				campaign.name = decodeURIComponent(campaign.name);
				LimelightCampaigns.insert(campaign);
				
				if(id > highestId) highestId = id;
			}
		});
		
		if(highestId > this.user.highest_limelight_campaign_id) 
			Meteor.users.update(this.user._id, {$set: {highest_limelight_campaign_id: highestId}});
	}
};