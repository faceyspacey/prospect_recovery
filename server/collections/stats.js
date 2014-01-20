Meteor.publish("stats", function(userId, campaignId, days, timezone) {
	if(!campaignId) return this.stop();
	if(!Meteor.users.findOne(this.userId)) return this.stop();
	
  	var self = this,
		stats = new Stats(userId, campaignId, days, timezone),
		userSearch = Roles.userIsInRole(userId, ['admin']) ? {} : {user_id: userId},
		handle = Prospects.find(userSearch).observeChanges({
    		changed: function (id, prospect) {
				console.log(id, prospect);
      			self.changed("stats", userId, stats.getAllStats());
    		}
  		});
		
  	self.added("stats", userId, stats.getAllStats());
  	self.ready();

	//console.log('started stats subscription');
  	self.onStop(function () {
		//console.log('stopped stats subscription');
    	handle.stop();
  	});
});




Stats = function(userId, campaignId, days, timezone) {
	//console.log('arguments', arguments);
	this.userId = userId;
	this.timezone = timezone;//this needs to be the viewer's timezone, not the limelight account timezone
	this.userSelector = Roles.userIsInRole(this.userId, ['admin']) ? {} : {user_id: this.userId};
	this.campaign_id = campaignId;
	this.days = days || 7;
};

Stats.prototype = {
	getAllStats: function() {
		return {
			user: this.getUserStats(),
			campaigns: this.getCampaignStats(),
			days: this.getDayStats(),
			hours: this.getHourStats()
		};
	},
	
	getUserStats: function() {
		var user = {},
			month = getMonthSelector(this.timezone);
			
		user.discoveries = this._findCounts({status: {$gte: 0}, updated_at: month});
		user.deliveries = this._findCounts({status: {$gte: 1}, updated_at: month});
		user.returns = this._findCounts({status: {$gte: 2}, updated_at: month});
		user.recoveries = this._findCounts({status: {$gte: 3}, updated_at: month});
		user.recoveryPercentage = Math.round(user.recoveries / user.deliveries * 100) || 0;
		user.returnsPercentage = Math.round(user.returns / user.deliveries * 100) || 0;
		return user;
	},
	getCampaignStats: function() {
		var campaigns = {};
		
		Campaigns.find(this.userSelector).forEach(function(campaign) {	
			var c = campaigns[campaign._id] = {};
				
			c.discoveries = this._findCounts({status: {$gte: 0}, campaign_id: campaign._id});
			c.deliveries = this._findCounts({status: {$gte: 1}, campaign_id: campaign._id});
			c.returns = this._findCounts({status: {$gte: 2}, campaign_id: campaign._id});
			c.recoveries = this._findCounts({status: {$gte: 3}, campaign_id: campaign._id});
			c.recoveryPercentage = Math.round(c.recoveries / c.deliveries * 100) || 0;
		}.bind(this));
		return campaigns;
	},

	_findCounts: function(selector) {
		if(!Roles.userIsInRole(this.userId, ['admin'])) selector.user_id = this.userId;
		return Prospects.find(selector).count();
	},
	
	
	
	getDayStats: function() {
		var days = [];

		_.each(getDateSelectors(this.days, this.timezone), function(date) {
			this._preparePeriod(days, date);
		}.bind(this));

		return days;
	},
	getHourStats: function() {
		var hours = [];
				
		_.each(getHourSelectors(this.days, this.timezone), function(date) {
			this._preparePeriod(hours, date);
		}.bind(this));
			
		return hours;
	},
	_preparePeriod: function(periods, date) {
		var period = {};
		
		period.date = date.start;
		period.end = date.end;
		period.discoveries = this._findDateCounts({status: {$gte: 0}, discovered_at: date.selector}); 
		period.deliveries = this._findDateCounts({status: {$gte: 1}, delivered_at: date.selector}); 
		period.returns = this._findDateCounts({status: {$gte: 2}, returned_at: date.selector}); 
		period.recoveries = this._findDateCounts({status: {$gte: 3}, recovered_at: date.selector}); 
		period.recoveryPercentage = Math.round(period.recoveries / period.deliveries * 100) || 0;
		
		periods.push(period);
	},
	_findDateCounts: function(selector) {
		if(!Roles.userIsInRole(this.userId, ['admin'])) selector.user_id = this.userId;
		if(this.campaign_id != 'all') selector.campaign_id = this.campaign_id;		
		return Prospects.find(selector).count();
	}
};