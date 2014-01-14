Meteor.settings.mailgun_api_url = 'https://api.mailgun.net/v2'
Meteor.settings.mailgun_api_key = 'key-1bsxare32g4839ng8tuawetue4eh4wb1';

Mailgun = function(prospect, campaign) {
	this.prospect = prospect;
	this.campaign = campaign;
	
	this.html = campaign.email_html;
	this.plain = campaign.email_plain;
	this.subject = campaign.email_subject;
};



Mailgun.prototype = {
	send: function() {
		if(!isValidEmailBasic(this.prospect.email)) {
			console.log('invalid email address', this.prospect.email);
			return false;
		}
		
		var self = this;

		HTTP.post(Meteor.settings.mailgun_api_url, + '/' + this.campaign.domain + '/messages', {
				auth:"api:" + Meteor.settings.mailgun_api_key ,
	    		params: {
					'from': this.campaign.from_name + ' <' + this.campaign.from_email + '>',
	            	'to': this.prospect.email,
	            	'subject': this.getSubject(),
	            	'html': this.getHtml(),
					'text': this.getPlain()
				}
	    	}, function() {
				if(error) console.log('MAILGUN SEND ERROR!', error);
				else {
					Prospects.update(self.prospect._id, {
							$set: {
								status: 1, delivered_at: Date.now(), 
								campaign_id: self.campaign._id
							}
						}, function() {});
				}
			});
	},
	getHtml: function() {
		this.html = this.html.replace('[FIRST_NAME]', this.prospect.first_name);
		this.html = this.html.replace('[LAST_NAME]', this.prospect.last_name);
		this.html = this.html.replace('[EMAIL]', this.prospect.email);
		this.html = this.html.replace('[PHONE]', this.prospect.phone);
		this.html = this.html.replace('[ADDRESS]', this.prospect.address);
		this.html = this.html.replace('[ADDRESS_2]', this.prospect.address_2);
		this.html = this.html.replace('[CITY]', this.prospect.city);
		this.html = this.html.replace('[STATE]', this.prospect.state);
		this.html = this.html.replace('[COUNTRY]', this.prospect.country);
		this.html = this.html.replace('[ZIP]', this.prospect.zip);
		this.html = this.html.replace('[IP_ADDRESS]', this.prospect.ip_address);
	},
	getPlain: function() {
		this.plain = this.plain.replace('[FIRST_NAME]', this.prospect.first_name);
		this.plain = this.plain.replace('[LAST_NAME]', this.prospect.last_name);
		this.plain = this.plain.replace('[EMAIL]', this.prospect.email);
		this.plain = this.plain.replace('[PHONE]', this.prospect.phone);
		this.plain = this.plain.replace('[ADDRESS]', this.prospect.address);
		this.plain = this.plain.replace('[ADDRESS_2]', this.prospect.address_2);
		this.plain = this.plain.replace('[CITY]', this.prospect.city);
		this.plain = this.plain.replace('[STATE]', this.prospect.state);
		this.plain = this.plain.replace('[COUNTRY]', this.prospect.country);
		this.plain = this.plain.replace('[ZIP]', this.prospect.zip);
		this.plain = this.plain.replace('[IP_ADDRESS]', this.prospect.ip_address);		
	},
	getSubject: function() {
		this.subject = this.subject.replace('[FIRST_NAME]', this.prospect.first_name);
		this.subject = this.subject.replace('[LAST_NAME]', this.prospect.last_name);
		this.subject = this.subject.replace('[EMAIL]', this.prospect.email);
		this.subject = this.subject.replace('[PHONE]', this.prospect.phone);
		this.subject = this.subject.replace('[ADDRESS]', this.prospect.address);
		this.subject = this.subject.replace('[ADDRESS_2]', this.prospect.address_2);
		this.subject = this.subject.replace('[CITY]', this.prospect.city);
		this.subject = this.subject.replace('[STATE]', this.prospect.state);
		this.subject = this.subject.replace('[COUNTRY]', this.prospect.country);
		this.subject = this.subject.replace('[ZIP]', this.prospect.zip);
		this.subject = this.subject.replace('[IP_ADDRESS]', this.prospect.ip_address);		
	}
};

