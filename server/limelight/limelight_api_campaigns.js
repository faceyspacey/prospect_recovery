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
			campaigns = {};
			
		_.each(campaignIds, function(id, index) {
			id = parseInt(id);
			campaigns[id] = {limelight_actual_campaign_id: id, name: campaignNames[index]};
		});
		
		console.log('limelight campaigns parsed', campaigns);
		return campaigns;
	},
	_storeLimelightCampaigns: function(campaigns) {
		var highestId = this.user.highest_limelight_campaign_id,
			self = this;

		var ourLLcampaigns = _.indexBy(LimelightCampaigns.find({user_id: this.user._id}).fetch(), 'limelight_actual_campaign_id');
		
		_.each(campaigns, function(campaign, id) {
			if(id > self.user.highest_limelight_campaign_id) { //if newly found lime light campaign
				campaign.user_id = self.user._id;
				campaign.name = self.prepName(campaign.name);
				LimelightCampaigns.insert(campaign);
				
				if(id > highestId) highestId = id; //prepare highest id for storage in user model
			}
			else if(ourLLcampaigns[id] && ourLLcampaigns[id].name != self.prepName(campaign.name)) { //update changed limelight campaign names
				LimelightCampaigns.update(ourLLcampaigns[id]._id, {$set: {name: self.prepName(campaign.name)}});
			}
		});
		
		if(highestId > this.user.highest_limelight_campaign_id) 
			Meteor.users.update(this.user._id, {$set: {highest_limelight_campaign_id: highestId}});
			
		this._removeDeletedCampaigns(ourLLcampaigns, campaigns);
	},
	_removeDeletedCampaigns: function(ourLLcampaigns, LLcampaigns) {
		_.each(ourLLcampaigns, function(ourLLcampaign, id) {
			if(!LLcampaigns[id]) LimelightCampaigns.remove(ourLLcampaign._id); //campaign doesn't exist in Lime Light anymore.
		});
	},
	prepName: function(name) {
		return decodeURIComponent(name.replace(/\+/g, ' ')); //i need to implement this some time.
	}
};

