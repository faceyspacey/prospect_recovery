Template.my_recoveries.created = function() {
	Session.set('prospects_page', 1);
	Session.set('my_recoveries_campaign_id', 'all')
};

Template.my_recoveries.helpers({
	selected: function(val) {
		return val == Session.get('my_recoveries_campaign_id') ? 'selected="selected"' : '';
	},
	canBeTested: function() {
		return this.campaign_id && this.status < 2;
	},
	my_recoveries_campaign_id: function() {
		return Session.get('my_recoveries_campaign_id');
	},
	displayLoadMoreProspects: function() {
		var prospectsCount = Meteor.user().prospectsCount(Session.get('my_recoveries_campaign_id')),
			page = Session.get('prospects_page'),
			limit = page * prospectsIncrementAmount;
			
		if(prospectsCount == limit) return true;
		return false;
	}
});

Template.my_recoveries.events({
	'change select': function(e) {
		var campaignId = $(e.currentTarget).val();
		Session.set('prospects_page', 1);
		Session.set('my_recoveries_campaign_id', campaignId);
	},
	'click #load_more_prospects': function() {
		Session.set('prospects_page', Session.get('prospects_page') + 1);
	},
	'click .undo': function() {
		this.status = 1;
		this.delivered_at = Date;
		this.returned_at = undefined;
		this.recovered_at = undefined;
		this.save();
	}
});