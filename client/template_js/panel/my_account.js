Template.my_account.created = function() {
	Deps.afterFlush(function() {
		$('html,body').animate({scrollTop: 0}, 300, 'easeOutExpo');
	});
};


Template.my_account.events({
	'click #update_account_button': function() {
			var email = $('#my_email').val(),
				oldPassword = $('#old_password').val(),
				newPassword = $('#new_password').val(),
				timezone = $('#timezone').val();

			if(!isValidEmail(email)) return FlashMessages.sendError("You entered an invalid email address");
			
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				console.log(error);
				if(error) return FlashMessages.sendError(error.reason);
				else {
					Meteor.users.update(Meteor.userId(), {
						$set: {
							emails: [{address: email}],
							timezone: parseInt(timezone)
						}
					});
					FlashMessages.sendSuccess('You Successfully updated your info.')
				}
			});
	}
});

