ProspectMailer = {
	sendEmails: function() {
		var users = this._findUsers();
		
		users.forEach(function(user) {
			var campaigns = this._findCampaigns(user._id);
			this.emailProspects(campaigns);
		});
	},
	_findUsers: function() {
		return Meteor.users.find({
			limelight_api_password: {$exists: true}
		}, {
			fields: {_id: 1}
		});
	},
	_findCampaigns: function(userId) {	
		return Campaigns.find({
			user_id: userId,
			complete: true,
			play: true,
			approved: true
		});
	},
	_emailProspects: function(campaigns) {
		campaigns.forEach(function(campaign) {
			var prospects = this._findProspects(campaign); 

			prospects.forEach(function(prospect) {
				var mailgun = new Mailgun(prospect, campaign);
				mailgun.send();
			});
		});
	},
	_findProspects: function(campaign) {	
		var limelightCampaignIds = this._findLimelightCampaigns(campaign._id);
		
		return Prospects.find({
			status: 0, 
			limelight_campaign_id: {$in: limelightCampaignIds},
			discovered_at: {$lte: moment().subtract(campaign.minutes_delay, 'minutes').toDate() } //this is key to actualizing campaign.minutes_delay
		});
	},
	_findLimelightCampaigns: function(campaignId) {	
		return LimelightCampaigns.find({
			recipient_campaign_id: campaignId
		}, {
			fields: {_id: 1}
		})
		.map(function(lc) {
			return lc._id;
		});
	}
}













