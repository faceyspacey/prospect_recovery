Meteor.publish("stats", function(campaignId, days) {
  	var self = this,
		userId = this.userId,
		stats = new Stats(this.userId, campaignId, days),
		userSearch = Roles.userIsInRole(userId, ['admin']) ? {} : {user_id: userId},
		handle = Prospects.find(userSearch).observeChanges({
    		changed: function (id, prospect) {
				console.log(id, prospect);
      			self.changed("stats", userId, stats.getAllStats());
    		}
  		});
		
  	self.added("stats", userId, stats.getAllStats());
  	self.ready();

	console.log('started stats subscription');
  	self.onStop(function () {
		console.log('stopped stats subscription');
    	handle.stop();
  	});
});




Stats = function(userId, campaignId, days) {
	console.log('arguments', arguments);
	this.userId = userId;
	this.userSelector = Roles.userIsInRole(this.userId, ['admin']) ? {} : {user_id: this.userId};
	this.campaign_id = campaignId;
	this.days = days || 7;
}

Stats.prototype = {
	getAllStats: function() {
		return {
			user: this.getUserStats(),
			campaigns: this.getCampaignStats(),
			days: this.getDayStats()
		};
	},
	
	getUserStats: function() {
		var user = {};
		user.deliveries = this.findDeliveryCounts({updated_at: getMonthSelector()});
		user.returns = this.findReturnCounts({updated_at: getMonthSelector()});
		user.recoveries = this.findRecoveryCounts({updated_at: getMonthSelector()});
		user.recoveryPercentage = Math.round(user.recoveries / user.deliveries * 100) || 0;
		return user;
	},
	getCampaignStats: function() {
		var campaigns = {},
			self = this;

		Campaigns.find(this.userSelector).forEach(function(campaign) {	
			var c = campaigns[campaign._id] = {}
				selector = {campaign_id: campaign._id};
				
			c.deliveries = self.findDeliveryCounts(selector);
			c.returns = self.findReturnCounts(selector);
			c.recoveries = self.findRecoveryCounts(selector);
			c.recoveryPercentage = Math.round(c.recoveries / c.deliveries * 100) || 0;
		});
		return campaigns;
	},
	getDayStats: function() {
		var days = [],
			self = this;

		_.each(getDateSelectors(this.days), function(date) {
			var day = {},
				selector = {};
			
			if(self.campaign_id != 'all') selector.campaign_id = self.campaign_id;
			
			day.date = date.name;
			day.deliveries = self.findDeliveryCounts(selector, date.selector); 
			day.returns = self.findReturnCounts(selector, date.selector);
			day.recoveries = self.findRecoveryCounts(selector, date.selector);
			day.recoveryPercentage = Math.round(day.recoveries / day.deliveries * 100) || 0;
			days.push(day);
		});

		return days;
	},
	
	findDeliveryCounts: function(selector, dateSelector) {
		selector.status = {$gte: 1};
		if(dateSelector) selector.updated_at = dateSelector; //enhance to delivered_at
		return this._findCounts(selector);
	},
	findReturnCounts: function(selector, dateSelector) {
		selector.status = {$gte: 2};
		if(dateSelector) selector.updated_at = dateSelector; //enhance to returned_at
		return this._findCounts(selector);
	},
	findRecoveryCounts: function(selector, dateSelector) {
		selector.status = {$gte: 3};
		if(dateSelector) selector.updated_at = dateSelector; //enhance to recovered_at
		return this._findCounts(selector);
	},
	_findCounts: function(selector) {
		if(!Roles.userIsInRole(this.userId, ['admin'])) selector.user_id = this.userId;
		return Prospects.find(selector).count()
	}
};