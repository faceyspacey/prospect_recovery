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
		return Campaigns.find({user_id: this._id, complete: true}).count();
	},
	limelightCredentialsWorking: function() {
		return this.limelight_login_configured;
	},
	
	
	
	/** LIMELIGHT METHODS **/
	loginToLimelight: function(domain, username, password, callback) {
		Meteor.call('getLimelightCookieToken', this._id, domain, username, password, function(error, cookieToken) {
			console.log("COOKIE TOKEN IS:", cookieToken);

			if(cookieToken) {
				FlashMessages.sendSuccess('Successfully logged into Limelight on your behalf.', { hideDelay: 5000 });
				this.refreshLimelight(domain, username, password, cookieToken, callback);
			}
			else {
				var message = 'We were unable to login to Limelight on your behalf. If you are sure your login credentials are correct, please report this to support@vortexconvert.com';
				
				this.update({limelight_login_configured: false, limelight_error_message: message});
				
				Deps.afterFlush(function() {
					FlashMessages.sendError(message);
				});
				
				callback(false); //call login callback (remove loading animation)
			}
		}.bind(this));
	},
	refreshLimelight: function(domain, username, password, cookieToken, callback) {
		this.saveLimelightCredentials(domain, username, password, cookieToken);
		this.createLimelightApiAccount(function() {	
			this.updateLimelightCampaigns(callback);
		}.bind(this), callback);
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
	createLimelightApiAccount: function(callback, loginCallback) {
		Meteor.call('createLimelightApiAccount', function(error, limeApiCredentialsObj) {
			if(limeApiCredentialsObj) {
				this.update(limeApiCredentialsObj);
				
				FlashMessages.sendSuccess('Successfully created/updated your Vortex Limelight API Key!', { hideDelay: 5000 });
				
				
				callback(); //updateCampaigns
			}
			else {
				var message = 'We were unable to create a Limelight API account on your behalf. Please report this to support@vortexconvert.com';
				
				this.update({limelight_login_configured: false, limelight_error_message: message});
				
				Deps.afterFlush(function() {
					FlashMessages.sendError(message);
				});
				
				loginCallback(false); //call login callback (remove loading animation)
			}
		}.bind(this));
	},
	updateLimelightCampaigns: function(callback) {	
		return Meteor.call('updateLimelightCampaigns', function(error, response) {
			if(response) {
				console.log('updateLimelightCampaigns success', response);

				this.update({limelight_login_configured: true, limelight_error_message: undefined});//FINALLY ALL IS CLEAR!! WE ARE IN TO LIMELIGHT.
				if(callback) {
					callback(response); //call login callback (remove loading animation) -- SUCCESS!
					FlashMessages.sendSuccess("And we're done! We have synced your Limelight campaigns with Vortex!!", { hideDelay: 5000 });
				}
			}
			else {
				var message = 'There is something wrong with limelight. We failed to pull in your latest Limelight campaigns. Please report this to support@vortextconvert.com';
				
				this.update({limelight_login_configured: false, limelight_error_message: message});
				
				Deps.afterFlush(function() {
					FlashMessages.sendError(message);
				});
				
				if(callback) callback(false); //call login callback (remove loading animation)
			}
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
		return Campaigns.find({complete: true});
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