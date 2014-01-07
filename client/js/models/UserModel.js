UserModel = function(doc) { 
    this.collectionName = 'Users';

	this.getEmail = function() {
		return this.emails[0].address;
	};

	this.loginToLimelight = function(domain, username, password) {
		
	};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};


/**
createNewUser = function() {
	Accounts.createUser({
		email: $('input[type=email]').val(),
		password: $('input[type=password]').val(),
		profile: {
			limelight_user: $('#limelight_user').val(),
			limelight_password: isValidPhone($('#limelight_password').val()) //returns cleaned phone #
		}
	}, function(error) {
		if(error) {
			alert('Oops! Something went wrong. Please try again.');
		}
	});
};
**/