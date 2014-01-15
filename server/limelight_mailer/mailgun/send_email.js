Meteor.methods({
	sendProspectEmail: function(prospect, campaign, testEmail) {
		console.log(arguments);
		var mailgun = new Mailgun(prospect, campaign);
		mailgun.send(testEmail);
	}
});


Meteor.settings.mailgun_api_url = 'https://api.mailgun.net/v2';
Meteor.settings.mailgun_api_key = 'key-1bsxare32g4839ng8tuawetue4eh4wb1';

Mailgun = function(prospect, campaign) {
	this.prospect = prospect;
	this.campaign = campaign;
	
	this.tokenReplacer = new TokenReplacer(prospect, campaign);
};



Mailgun.prototype = {
	send: function(testEmail) {
		var email = testEmail || this.prospect.email;
		
		if(!isValidEmailBasic(email)) {
			console.log('invalid email address', email);
			return false;
		}
		
		var self = this;

		HTTP.post(Meteor.settings.mailgun_api_url + '/' + this.campaign.domain + '/messages', {
				auth:"api:" + Meteor.settings.mailgun_api_key,
	    		params: {
					'from': this.campaign.from_name + ' <' + this.campaign.from_email + '>',
	            	'to': email,
	            	'subject': this.tokenReplacer.getSubject(),
	            	'html': this.tokenReplacer.getHtml(),
					'text': this.tokenReplacer.getPlain()
				}
	    	}, function(error) {
				if(error) console.log('MAILGUN SEND ERROR!', error);
				else {
					Prospects.update(self.prospect._id, {
							$set: {
								status: 1, 
								delivered_at: moment().toDate(), 
								campaign_id: self.campaign._id
							}
						}, function() {});
				}
			});
	}
};

