Template.my_campaigns.created = function() {
	Deps.afterFlush(function() {
		$('html,body').animate({scrollTop: 0}, 0);
	});
};


Template.my_campaigns.helpers({
	campaigns: function() {
		return Campaigns.find({complete: true});
	}
});

Template.my_campaigns.events({
	'click .pause_play': function() {
		Campaigns.update(this._id, {$set: {play: !this.play}});
	},
	'click .remove_campaign': function() {
		var yes = confirm('Are you sure you want to delete campaign, ' + this.name + '?');
		console.log(this._id);
		if(yes) {
			Campaigns.update(this._id, {$set: {complete: false}});
			Meteor.call('unsetLimelightCampaigns', this._id);
		}
	}
});