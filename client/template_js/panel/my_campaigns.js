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
			LimelightCampaigns.update({recipient_campaign_id: this._id}, {$set: {recipient_campaign_id: undefined}}, {multi: true});
			LimelightCampaigns.update({destination_campaign_id: this._id}, {$set: {destination_campaign_id: undefined}}, {multi: true});
		}
	}
});