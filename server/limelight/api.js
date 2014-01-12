Meteor.methods({
	updateLimelightCampaigns: function() {
		var limelightApi = new LimelightApi;
		return limelightApi.updateCampaigns();
	},
	limelightTest: function(method, params) {
		var limelightApi = new LimelightApi;
		return limelightApi._api(method, params);
	},
	prospects: function() {
		this.unblock();
		var limelightApi = new LimelightApi;
		limelightApi.findProspects();
	}
});

LimelightApi = function() {
	this.username = Meteor.user().limelight_api_username;
	this.password = Meteor.user().limelight_api_password;
	this.domain = Meteor.user().limelight_domain;
};

LimelightApi.prototype = {
	updateCampaigns: function() {
		try {
			var response = this._api('campaign_find_active');
			if(response && response.content) {		
				var campaigns = this._parseLimelightCampaigns(response.content);
				this._storeLimelightCampaigns(campaigns);
			}
		}
		catch(error) {
			console.log('LimelightApi.updateCampaigns ERROR!', error)
			return false;
		}
		return true;
	},
	_api: function(method, data, callback) {
		data = _.isObject(data) ? data : {};	
			
		data.username = this.username;
		data.password = this.password;
		data.method = method;
		
		if(callback) HTTP.post(this.domain+'/admin/membership.php', {params: data}, callback);
		else {
			var response = HTTP.post(this.domain+'/admin/membership.php', {params: data});
			console.log(this.domain+'/admin/membership.php', data, method, response);
			return response;
		}
	},
	_parseLimelightCampaigns: function(response) {
		response = response.replace('response=100&campaign_id=', '');
		response = response.split('&campaign_name=');
		
		var campaignIds = response[0].split(','),
			campaignNames = response[1].split(',')
			campaigns = [];
			
		_.each(campaignIds, function(id, index) {
			campaigns.push({id: id, name: campaignNames[index]});
		});
		
		console.log('limelight campaigns parsed', campaigns);
		return campaigns;
	},
	_storeLimelightCampaigns: function(campaigns) {
		var highestId = Meteor.user().highest_limelight_campaign_id;

		_.each(campaigns, function(campaign) {
			var id = parseInt(campaign.id);
			console.log(id,  Meteor.user().highest_limelight_campaign_id, campaign);
			
			if(id > Meteor.user().highest_limelight_campaign_id) {
				campaign.user_id = Meteor.userId();
				LimelightCampaigns.insert(campaign);
				
				if(id > highestId) highestId = id;
			}
		});
		
		if(highestId > Meteor.user().highest_limelight_campaign_id) 
			Meteor.users.update(Meteor.userId(), {$set: {highest_limelight_campaign_id: highestId}});
	},
	findProspects: function() {
			try {
				var params = {
					campaign_id: 'all',
					return_type: 'prospect_view',
					start_date: moment().startOf('day').subtract(0, 'day').format('MM/DD/YYYY'),
					end_date: moment().endOf('day').subtract(0, 'day').format('MM/DD/YYYY')
				};
				
				this._api('prospect_find', params, function(error, response) {
					if(!error) {
						var content = response.content,
							start = content.indexOf('&data='),
							prospectString = content.substring(start+6),
							prospectObjects = EJSON.parse(prospectString),
							prospectId,
							prospects = [];
							
						for(prospectId in prospectObjects) {
							prospects.push(prospectObjects[prospectId]);
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
	}
}




