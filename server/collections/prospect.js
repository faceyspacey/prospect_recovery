Prospects = new Meteor.Collection('prospects');

Meteor.publish("prospects", function (limit, campaignId) {
	if(campaignId == 'all') {
		if(Roles.userIsInRole(this.userId, ['admin'])) return Prospects.find({}, {limit: limit, sort: {updated_at: -1}});
	    else return Prospects.find({user_id: this.userId}, {limit: limit, sort: {updated_at: -1}});
	}
    else {
		if(Roles.userIsInRole(this.userId, ['admin'])) return Prospects.find({campaign_id: campaignId}, {limit: limit, sort: {updated_at: -1}});
	    else return Prospects.find({user_id: this.userId, campaign_id: campaignId}, {limit: limit, sort: {updated_at: -1}});
	}
});


Prospects.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = new Date;
        doc.updated_at = new Date;
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return doc.user_id == userId || Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return doc.user_id == userId || Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id', 'created_at', 'updated_at']
});
