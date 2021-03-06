Campaigns = new Meteor.Collection('campaigns');

Meteor.publish("campaigns", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Campaigns.find();
    else return Campaigns.find({user_id: this.userId});
});


Campaigns.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = moment().toDate();
        doc.updated_at = moment().toDate();
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = moment().toDate();
        return doc.user_id == userId || Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return doc.user_id == userId || Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id', 'created_at', 'updated_at']
});


