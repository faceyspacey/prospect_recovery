UserModel = function(doc) { 
    this.collectionName = 'Users';

	this.getEmail = function() {
		return this.emails[0].address;
	};

	this.loginToLimelight = function(domain, username, password, callback) {
		Meteor.call('getLimelightCookieToken', this._id, domain, username, password, function(error, cookieToken) {
			console.log("COOKIE TOKEN IS:", cookieToken);

			if(cookieToken) this.update({cookie_token: cookieToken, limelight_login_configured: true});
			else this.update({limelight_login_configured: false});
			
			callback(cookieToken);
		}.bind(this));
	};
	;
	this.saveLimelightCredentials = function(domain, username, password) {	
		this.update({
			limelight_domain: domain,
			limelight_username: username,
			limelight_password: password
		});
	};
	
	this.createLimelightApiAccount = function() {
		Meteor.call('createLimelightApiAccount', function(error, limeApiCredentialsObj) {
			if(limeApiCredentialsObj) this.update(limeApiCredentialsObj);
			else console.log('error create limelight api account')
		}.bind(this));
	};
	
	this.limelightCampaigns = function(callback) {
		if(this._limelightCampaigns) return this._limelightCampaigns;
		
		return Meteor.call('limelightCampaigns', function(error, response) {
			if(!error && response && response.content) {		
				this._limelightCampaigns = this._parseLimelightCampaigns(response.content);
				if(callback) callback(this._limelightCampaigns);
			}
		}.bind(this));
	};
	
	this._parseLimelightCampaigns = function(response) {
		response = response.replace('response=100&campaign_id=', '');
		response = response.split('&campaign_name=');
		
		var campaignIds = response[0].split(','),
			campaignNames = response[1].split(',')
			campaigns = {};
			
		_.each(campaignIds, function(id, index) {
			campaigns[id] = campaignNames[index];
		});
		
		console.log('limelight campaigns parsed', campaigns);
		return campaigns;
	};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};