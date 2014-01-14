Template.admin_campaign_approval.helpers({
	campaigns: function() {
		return Campaigns.find({complete: true}, {sort: {approved: 1}});
	}
});



Template.admin_campaign_approval.events({
	'click .approve_campaign': function() {
		Campaigns.update(this._id, {$set: {approved: !this.approved}});
	}
});