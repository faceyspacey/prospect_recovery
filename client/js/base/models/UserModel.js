/** UserModel attributes:
 *
 *  _id                         			Str
 *  limelight_username                      Str
 *  limelight_password                      Str
 *  limelight_login_configured              Bool
 *  cookie_token                      		Str
 *  limelight_domain                  		Str
 *	limelight_api_username					Str
 *  limelight_api_password                 	Str
 *
**/


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
	totalCampaigns: function() {
		return Campaigns.find({user_id: this._id, complete: true}).count();
	},
	limelightCredentialsWorking: function() {
		
	},
	
	/** LIMELIGHT METHODS **/
	loginToLimelight: function(domain, username, password, callback) {
		Meteor.call('getLimelightCookieToken', this._id, domain, username, password, function(error, cookieToken) {
			console.log("COOKIE TOKEN IS:", cookieToken);

			if(cookieToken) this.refreshLimelight(domain, username, password, cookieToken, callback);
			else this.update({limelight_login_configured: false});
			
			callback(cookieToken);
		}.bind(this));
	},
	refreshLimelight: function(domain, username, password, cookieToken, callback) {
		this.saveLimelightCredentials(domain, username, password, cookieToken);
		this.createLimelightApiAccount(callback);
		this.updateLimelightCampaigns();
	},
	saveLimelightCredentials: function(domain, username, password, cookieToken) {	
		this.update({
			limelight_domain: domain,
			limelight_username: username,
			limelight_password: password,
			cookie_token: cookieToken,
			limelight_login_configured: true
		});
	},
	createLimelightApiAccount: function(callback) {
		Meteor.call('createLimelightApiAccount', function(error, limeApiCredentialsObj) {
			if(limeApiCredentialsObj) {
				callback(); //i.e. logging in
				this.update(limeApiCredentialsObj);
			}
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
	/** END LIMELIGHT METHODS **/
	
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