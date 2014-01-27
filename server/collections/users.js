Meteor.publish("users", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Meteor.users.find(); // everything
    else return Meteor.users.find({_id: this.userId});
});

Meteor.users.allow({
    insert: function(userId, doc) {
		doc.created_at = moment().toDate();
        doc.updated_at = moment().toDate();
        return true;
    },
    update: function(userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
        return (doc._id == userId || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function() {
        return (doc._id == userId || Roles.userIsInRole(userId, ['admin']));
    },
	fetch: ['_id']
});


Meteor.methods({
	domainInUse: function(domain) {
		return Meteor.users.findOne({limelight_domain: domain, _id: {$ne: Meteor.userId()}}) ? true : false;
	}
});