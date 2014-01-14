Meteor.methods({
	createMailgunDomain: function(campaignId, domain) {
		console.log('createMailgunDomain called', campaignId, domain);
		MailgunCreateDomain(campaignId, domain);
	}
});


MailgunCreateDomain = function(campaignId, domain) {
	try {
		HTTP.post(Meteor.settings.mailgun_api_url + '/domains', {
				auth:"api:" + Meteor.settings.mailgun_api_key,
	    		params: {
					'name': domain,
					'smtp_password': 'faceyspacey'
				}
	    	}, function(error, response) {
				if(error) console.log('MAILGUN DOMAIN CREATE ERROR!', error);
				else {
					var hostname = response.data.sending_dns_records[1].name,
						value = response.data.sending_dns_records[1].value;

					console.log('created new domain, ' + domain+' -- DKIM record:', hostname, value);

					Campaigns.update(campaignId, {$set:{mailgun_dkim_hostname: hostname, mailgun_dkim_value: value}});
				}
			});
	}
	catch (error) {console.log(error);}
};