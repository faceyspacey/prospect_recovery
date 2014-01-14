Meteor.methods({
	findAllProspects: function() {
		this.unblock();
		return ProspectFinder.findAllProspects();
	}
});


ProspectFinder = {
	findAllProspects: function() {
		console.log('findAllProspects');
		
		this.moment = moment();
		
		var users = Meteor.users.find({limelight_api_password: {$exists: true}}, {fields: {
				_id: 1, 
				limelight_api_username: 1,
				limelight_api_password: 1,
				limelight_api_domain: 1
			}});

		users.forEach(function(user) {
			this.limelightApi = new LimelightApi(user.limelight_api_username, user.limelight_api_password, user.limelight_api_domain);
			prospectFinder.findProspects(user._id, now, user.timezone);
		});
	},
	findProspects: function(userId, timezone) {
		try {
			var params = {
					campaign_id: 'all',
					return_type: 'prospect_view',
					start_date: this.moment.zone(timezone).startOf('day').subtract(0, 'day').format('MM/DD/YYYY'), 
					end_date: this.moment.zone(timezone).endOf('day').subtract(0, 'day').format('MM/DD/YYYY'), 
					start_time: this.moment.zone(timezone).subtract(1, 'minute').format('HH:mm:ss'),
					end_time: this.moment.zone(timezone).format('HH:mm:ss'),
					search_type: 'all'
				},
				self = this;
			
			this.limelightApi.api('prospect_find', params, function(error, response) {
				if(!error) {
					var content = response.content,
						start = content.indexOf('&data='),
						prospectString = content.substring(start+6),
						prospectObjects = EJSON.parse(prospectString),
						prospectId,
						prospects = [];
						
					for(prospectId in prospectObjects) {
						var prospect = self._prepProspect(prospectObjects[prospectId], userId);
						Prospects.insert(prospect, function() {});
						prospects.push(prospect);
					}
					
					console.log(prospects);
				}
				else console.log('prospect_find ERROR!', error);
			});
			
		}
		catch(error) {
			console.log('LimelightApi.findProspects ERROR!', error)
			return false;
		}
		return true;
	},
	_prepProspect: function(prospect, userId) {
		return {
			first_name: prospect.first_name,
			last_name: prospect.last_name,
			email: decodeURIComponent(prospect.email),
			phone: prospect.phone,
			limelight_actual_campaign_id: prospect.campaign_id,
			address: prospect.address,
			address_2: prospect.address_2,
			city: prospect.city,
			state: prospect.state,
			zip: prospect.zip,
			country: prospect.country,
			ip_address: prospect.ip_address,
			signedup_at: moment(decodeURIComponent(prospect.dated_created)).toDate(),
			status: 0,
			user_id: userId
		};
	}
};