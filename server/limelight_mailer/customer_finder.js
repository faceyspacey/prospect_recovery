Meteor.methods({
	findAllCustomers: function() {
		this.unblock();
		return CustomerFinder.findAllCustomers();
	}
});


CustomerFinder = {
	findAllCustomers: function() {		
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
			self.findCustomers(user._id, user.timezone);
		});
	},
	findCustomers: function(userId, timezone) {
		timezone = parseInt(timezone);
		this.moment = moment();
		
		try {
			var params = {
					campaign_id: 'all',
					return_type: 'customer_view',
					end_time: this.moment.zone(timezone).format('HH:mm:ss'), //now -- watch out, this.moment changes with calls to subtract()
					start_time: this.moment.zone(timezone).subtract(1, 'minute').format('HH:mm:ss'), //1 minute ago				
					end_date: this.moment.zone(timezone).endOf('day').subtract(0, 'day').format('MM/DD/YYYY'), 
					start_date: this.moment.zone(timezone).startOf('day').subtract(0, 'day').format('MM/DD/YYYY'),
					search_type: 'all'
				},
				self = this;
			
			this.limelightApi.api('customer_find', params, function(error, response) {
				if(!error) {
					var content = response.content,
						start = content.indexOf('&data='),
						customerString = content.substring(start+6),
						customObjects,
						customerId;
						
					try {
						customerObjects = EJSON.parse(customerString);
						for(customerId in customerObjects) self._updateProspect(customerObjects[customerId]);
					}
					catch(error) {
						console.log('no customers found for user_id: ' + userId, error);
						return;
					}
									
				}
				else console.log('api/customer_find ERROR!', error);
			});
			
		}
		catch(error) {
			console.log('LimelightApi.findProspects ERROR!', error)
			return false;
		}
		return true;
	},
	_updateProspect: function(customer) {
		customer.email = decodeURIComponent(customer.email); //it's weird that prospect_find does not need this;
		console.log('new customer found!', customer);
		
		Prospects.update({email: customer.email, status: {$gte: 1}}, {$set: {
			status: 3, 
			recovered_at: moment().toDate(), 
			updated_at: moment().toDate(), 
			not_via_link: true
		}}, function(error, docCountUpdated) {
				if(docCountUpdated) console.log(error, 'customer found -- prospects /w recovered status: ', docCountUpdated);
				else {
					 Prospects.remove({email: customer.email, status: 0}, function(error, docCountUpdated) {
						console.log('customer found -- prospects removed:', docCountUpdated);
					});
				}
		});
	}
};