Meteor.startup(function () {
	if(Meteor.roles.find().count() === 0) {
		Roles.createRole('admin');
		Roles.createRole('user');
	}
	
	if(Delays.find().count() === 0) {
		var emailDelays = [
            {minutes: 15, name: '15 Minutes'},
			{minutes: 30, name: '30 Minutes'},
			{minutes: 45, name: '45 Minutes'},
			{minutes: 60, name: '1 Hour'},
			{minutes: 90, name: '90 Minutes'},
			{minutes: 120, name: '2 Hours'},
			{minutes: 1440, name: '24 Hours'}
        ];

		_.each(emailDelays, function(delay) {
			Delays.insert(delay);
		});
	}
});



