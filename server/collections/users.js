Meteor.publish("users", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Meteor.users.find(); // everything
    else return Meteor.users.find({_id: this.userId});
});

Meteor.users.allow({
    insert: function(userId, doc) {
            return true;
    },
    update: function(userId, doc, fields, modifier) {
        return (doc._id == userId || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function() {
        return (doc._id == userId || Roles.userIsInRole(userId, ['admin']));
    },
	fetch: ['_id']
});