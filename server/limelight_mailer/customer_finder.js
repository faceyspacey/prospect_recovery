Meteor.methods({
	findAllCustomers: function() {
		this.unblock();
		return CustomerFinder.findAllCustomers();
	}
});


CustomerFinder = {
	findAllCustomers: function() {
		console.log('findAllCustomers');
		
		this.moment = moment();
		
		var users = Meteor.users.find({limelight_api_password: {$exists: true}}, {fields: {
				_id: 1, 
				limelight_api_username: 1,
				limelight_api_password: 1,
				limelight_api_domain: 1
			}});

		users.forEach(function(user) {
			this.limelightApi = new LimelightApi(user.limelight_api_username, user.limelight_api_password, user.limelight_api_domain);
			this.findCustomers(now, user.timezone);
		});
	},
	findCustomers: function(nowMoment, timezone) {
		try {
			var params = {
					campaign_id: 'all',
					return_type: 'customer_view',
					start_date: this.moment.zone(timezone).startOf('day').subtract(0, 'day').format('MM/DD/YYYY'),
					end_date: this.moment.zone(timezone).endOf('day').subtract(0, 'day').format('MM/DD/YYYY'),
					start_time: this.moment.zone(timezone).subtract(1, 'minute').format('HH:mm:ss'),
					end_time: this.moment.zone(timezone).format('HH:mm:ss'),
					search_type: 'all'
				},
				self = this;
			
			this.limelightApi.api('customer_find', params, function(error, response) {
				if(!error) {
					var content = response.content,
						start = content.indexOf('&data='),
						customerString = content.substring(start+6),
						customerObjects = EJSON.parse(customerString),
						customerId,
						customers = [];
						
					for(customerId in customerObjects) {
						var customer = customerObjects[customerId]
							email = customer.email;
						
						Prospects.update({email: email, status: {$gte: 2}}, {$set: {status: 3, recovered_at: Date.now(), not_via_link: true}}, 	
							function(error, docCountUpdated) {
								console.log('customer found', error, docCountUpdated);
								if(!docCountUpdated) Prospects.remove({email: email, status: 0}, function() {});
						});
						
						
						customers.push(customer);
					}
					
					console.log(customers);
				}
				else console.log('prospect_find ERROR!', error);
			});
			
		}
		catch(error) {
			console.log('LimelightApi.findProspects ERROR!', error)
			return false;
		}
		return true;
	}
};