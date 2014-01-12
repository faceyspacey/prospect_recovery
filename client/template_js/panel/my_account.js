Template.my_account.events({
	'click #update_account_button': function() {
			var email = $('#my_email').val(),
				oldPassword = $('#old_password').val(),
				newPassword = $('#new_password').val();

			if(!isValidEmail(email)) return FlashMessages.sendError("You entered an invalid email address");
			
			Accounts.changePassword(oldPassword, newPassword, function(error) {
				console.log(error);
				if(error) return FlashMessages.sendError(error.reason);
				else {
					Meteor.users.update(Meteor.userId(), {
						$set: {
							emails: [{address: email}]  
						}
					});
					FlashMessages.sendSuccess('You Successfully updated your info.')
				}
			});
	}
});

