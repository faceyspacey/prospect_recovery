Delays = new Meteor.Collection('delays');

Meteor.publish('delays', function () {
    return Delays.find();
});


Delays.allow({
    insert: function(userId, doc) {
        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fields, modifier) {
        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: []
});

