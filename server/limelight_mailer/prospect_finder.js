Meteor.methods({
	findAllProspects: function() {
		this.unblock();
		return ProspectFinder.findAllProspects();
	}
});


ProspectFinder = {
	findAllProspects: function() {
		this.moment = moment();
		
		var users = Meteor.users.find({limelight_api_password: {$exists: true}}, {fields: {
				_id: 1, 
				limelight_api_username: 1,
				limelight_api_password: 1,
				limelight_domain: 1,
				timezone: 1
			}}),
			self = this;

		users.forEach(function(user) {
			self.limelightApi = new LimelightApi(user.limelight_api_username, user.limelight_api_password, user.limelight_domain);
			self.findProspects(user._id, user.timezone);
		});
	},
	findProspects: function(userId, timezone) {
		timezone = parseInt(timezone);
		
		try {
			var params = {
					campaign_id: 'all',
					return_type: 'prospect_view',	
					end_time: this.moment.zone(timezone).format('HH:mm:ss'), //now -- watch out, this.moment changes with calls to subtract()
					start_time: this.moment.zone(timezone).subtract(1, 'minute').format('HH:mm:ss'), //1 minute ago				
					end_date: this.moment.zone(timezone).endOf('day').subtract(0, 'day').format('MM/DD/YYYY'), 
					start_date: this.moment.zone(timezone).startOf('day').subtract(0, 'day').format('MM/DD/YYYY'), 				
					search_type: 'all'
				},
				self = this;

			this.limelightApi.api('prospect_find', params, function(error, response) {			
				if(!error) {
					console.log('prospect_find', response, params);
					
					var content = response.content,
						start = content.indexOf('&data='),
						prospectString = content.substring(start+6),
						prospectId;
						
					try {
						prospectObjects = EJSON.parse(prospectString);
						for(prospectId in prospectObjects) self._insertProspect(prospectObjects[prospectId], userId);
					}
					catch(error) {
						console.log('no prospects found for user_id: ' + userId, error);
						return;
					}
					
				}
				else console.log('api/prospect_find ERROR!', userId, error);
			});
			
		}
		catch(error) {
			console.log('LimelightApi.findProspects ERROR!', error)
			return false;
		}
		return true;
	},
	_insertProspect: function(prospect, userId) {
		var limelightActualCampaignId = parseInt(prospect.campaign_id),
			limelightCampaign = LimelightCampaigns.findOne({user_id: userId, limelight_actual_campaign_id: limelightActualCampaignId}),
			campaignId;
			
		if(limelightCampaign && limelightCampaign.recipient_campaign_id) campaignId = limelightCampaign.recipient_campaign_id;
		else return;
		
		var prospect = {
			first_name: prospect.first_name,
			last_name: prospect.last_name,
			email: decodeURIComponent(prospect.email),
			phone: prospect.phone,
			limelight_actual_campaign_id: limelightActualCampaignId,
			address: prospect.address,
			address_2: prospect.address_2,
			city: prospect.city,
			state: prospect.state,
			zip: prospect.zip,
			country: prospect.country,
			ip_address: prospect.ip_address,
			signedup_at: moment(decodeURIComponent(prospect.date_created)).toDate(),
			status: 0,
			user_id: userId,
			campaign_id: campaignId,
			discovered_at: moment().toDate(),
			created_at: moment().toDate(),
			updated_at: moment().toDate()
		};
		
		console.log('new prospect!', userId, campaignId, prospect);
		
		Prospects.insert(prospect, function() {});
	}
};