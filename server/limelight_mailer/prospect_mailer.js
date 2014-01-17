ProspectMailer = {
	sendEmails: function() {
		console.log('sendEmails Start');
		var users = this._findUsers(),
			self = this;
		
		users.forEach(function(user) {
			var campaigns = self._findCampaigns(user._id);
			self._emailProspects(campaigns, user);
		});
	},
	_findUsers: function() {
		return Meteor.users.find({
			limelight_api_password: {$exists: true}
		}, {
			fields: {_id: 1, timezone: 1}
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
	_emailProspects: function(campaigns, user) {
		var self = this;
		campaigns.forEach(function(campaign) {
			var prospects = self._findProspects(campaign, user); 
			
			prospects.forEach(function(prospect) {
				var mailgun = new Mailgun(prospect, campaign);
				mailgun.send('james@faceyspacey.com,zach@vortextraffic.com'); 	
			});
		});
	},
	_findProspects: function(campaign, user) {	
		var limelightCampaignIds = this._findLimelightCampaigns(campaign._id);
		
		return Prospects.find({
			status: 0, 
			limelight_actual_campaign_id: {$in: limelightCampaignIds},
			discovered_at: {$gte: moment().zone(user.timezone).subtract(campaign.minutes_delay, 'minutes').subtract(5, 'minute').toDate(),
			 				$lte: moment().zone(user.timezone).subtract(campaign.minutes_delay, 'minutes').toDate() } //key 2 campaign.minutes_delay
		});
	},
	_findLimelightCampaigns: function(campaignId) {	
		return LimelightCampaigns.find({
			recipient_campaign_id: campaignId
		}, {
			fields: {limelight_actual_campaign_id: 1} //we actually need the IDs that limelight uses since that what we stored in prospect.limelight_campaign_id when discovered
		})
		.map(function(lc) {
			return lc.limelight_actual_campaign_id;
		});
	}
}













