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
	this.defaultValues = {};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};





UserModel.prototype = {
	getEmail: function() {
		return this.emails[0].address;
	},
	totalCampaigns: function() {
		return this.isAdmin() ? Campaigns.find({complete: true}).count() : Campaigns.find({user_id: this._id, complete: true}).count();
	},
	isAdmin: function() {
		return Roles.userIsInRole(this._id, ['admin']);
	},
	limelightCredentialsWorking: function() {
		return this.limelight_login_configured;
	},
	
	
	
	/** LIMELIGHT METHODS **/
	loginToLimelight: function(domain, username, password, callback) {
		Meteor.call('getLimelightCookieToken', this._id, domain, username, password, function(error, cookieToken) {
			if(cookieToken) {
				this._loginSuccess(UserModel.successes.loginToLimelight);	
				this.refreshLimelight(domain, username, password, cookieToken, callback);
			}
			else this._loginError(UserModel.errors.loginToLimelight);
		}.bind(this));
	},
	refreshLimelight: function(domain, username, password, cookieToken) {
		this.saveLimelightCredentials(domain, username, password, cookieToken);
		this.createLimelightApiAccount();
	},
	saveLimelightCredentials: function(domain, username, password, cookieToken) {	
		this.update({
			limelight_domain: domain,
			limelight_username: username,
			limelight_password: password,
			cookie_token: cookieToken,
			limelight_error_message: undefined
		});
	},
	createLimelightApiAccount: function() {
		Meteor.call('createLimelightApiAccount', function(error, limeApiCredentialsObj) {
			if(limeApiCredentialsObj) {
				this._loginSuccess(UserModel.successes.createLimelightApiAccount);
				
				this.update(limeApiCredentialsObj);
				this.updateLimelightCampaigns();						
			}
			else this._loginError(UserModel.errors.createLimelightApiAccount);
		}.bind(this));
	},
	updateLimelightCampaigns: function() {	
		return Meteor.call('updateLimelightCampaigns', function(error, response) {
			if(response) this._loginSuccess(UserModel.successes.updateLimelightCampaignsMessage, true);
			else this._loginError(UserModel.errors.updateLimelightCampaignsMessage);
		}.bind(this));
	},
	_loginSuccess: function(message, loginComplete) {
		FlashMessages.sendSuccess(message, { hideDelay: 8000 });
		
		if(loginComplete && !Meteor.user().limelight_login_configured) {//graceful entrance of final success message on dashboard
			setTimeout(function() {
				this.update({limelight_login_configured: true, limelight_error_message: undefined});
				FlashMessages.clear()
				setTimeout(function() {
					FlashMessages.sendSuccess(UserModel.successes.loginComplete, { hideDelay: 10000 });
				}, 500);
			}.bind(this), 2000);
		}
	},
	_loginError: function(message) {
		Session.set('loading_limelight_login', false);
		
		this.update({limelight_login_configured: false, limelight_error_message: message});
		
		Deps.afterFlush(function() {
			FlashMessages.sendError(message, { hideDelay: 12000 });
		});
	},
	/** END LIMELIGHT METHODS **/
	
	
	
	limelightCampaigns: function() {
		if(Roles.userIsInRole(this._id, ['admin'])) return LimelightCampaigns.find({}, {sort: {limelight_actual_campaign_id: -1}});
		else return LimelightCampaigns.find({user_id: this._id}, {sort: {limelight_actual_campaign_id: -1}});
	},
	createLimelightCampaignUrl: function() {
		return this.limelight_domain + '/admin/campaign/profile.php';
	},
	campaigns: function() { 
		return Campaigns.find({complete: true});
	},
	isNewUser: function() {
		return !Campaigns.findOne();
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



UserModel.successes = {
	loginToLimelight: 'Successfully logged into Limelight on your behalf.',
	createLimelightApiAccount: 'Successfully created your Vortex Limelight API Key!',
	updateLimelightCampaignsMessage: "Successfully synced your Limelight campaigns!!",
	loginComplete: 'Limelight CRM Fully Synced! Welcome to VORTEX CONVERT!!!'
};


UserModel.errors = {
	loginToLimelight: 'We were unable to login to Limelight on your behalf. If you are sure your login credentials are correct, please report error code 01 to support@vortexconvert.com.',
	createLimelightApiAccount: 'We were unable to create a Limelight API account on your behalf. Please report error code 02 to support@vortexconvert.com.',
	updateLimelightCampaignsMessage: 'There is something wrong with limelight. We failed to pull in your latest Limelight campaigns. Please report error code 03 to support@vortextconvert.com.'
};
