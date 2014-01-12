UserModel = function(doc) { 
    this.collectionName = 'Users';

    _.extend(this, Model);
	this.extend(doc);

    return this;
};


UserModel.prototype = {
	getEmail: function() {
		return this.emails[0].address;
	},
	loginToLimelight: function(domain, username, password, callback) {
		Meteor.call('getLimelightCookieToken', this._id, domain, username, password, function(error, cookieToken) {
			console.log("COOKIE TOKEN IS:", cookieToken);

			if(cookieToken) this.update({cookie_token: cookieToken, limelight_login_configured: true});
			else this.update({limelight_login_configured: false});
			
			callback(cookieToken);
		}.bind(this));
	},
	saveLimelightCredentials: function(domain, username, password) {	
		this.update({
			limelight_domain: domain,
			limelight_username: username,
			limelight_password: password
		});
	},
	createLimelightApiAccount: function() {
		Meteor.call('createLimelightApiAccount', function(error, limeApiCredentialsObj) {
			if(limeApiCredentialsObj) this.update(limeApiCredentialsObj);
			else console.log('error create limelight api account')
		}.bind(this));
	},
	updateLimelightCampaigns: function(callback) {	
		return Meteor.call('updateLimelightCampaigns', function(error, response) {
			if(!error) {
				console.log('updateLimelightCampaigns success', response);
				if(callback) callback();
			}
			else console.log('something failed with the updating your limelight campaigns');
		}.bind(this));
	},
	limelightCampaigns: function() {
		return LimelightCampaigns.find({user_id: this._id}, {sort: {id: -1}});
	},
	createLimelightCampaignUrl: function() {
		return this.limelight_domain + '/admin/campaign/profile.php';
	},
	campaigns: function() {
		return Campaigns.find();
	},
	prospects: function(campaignId) {
		return this._findProspects(campaignId);
	},
	prospectsCount: function(campaignId) {
		return this._findProspects(campaignId).count();
	},
	_findProspects: function(campaignId) {
		if(!campaignId || campaignId == 'all') return Prospects.find({}, {sort: {updated_at: -1}}); //published is actually: {user_id: Meteor.userId()} if not admin
		return Prospects.find({campaign_id: campaignId}, {sort: {updated_at: -1}});
	}	
};