Router.map(function () {
	this.route('recovery', {
		where: 'server',
    	path: '/recovery/step-1',

    	action: function () {
			Prospects.update(this.params.p, {$set: {
				status: 2, 
				returned_at: moment().toDate(),
				updated_at: moment().toDate()
			}}, function() {});

			var prospect = Prospects.findOne(this.params.p) || {},
				campaign = Campaigns.findOne(this.params.c, {fields: {affiliate_link: 1, continue_recovery: 1}}) || {};
			
			campaign.affiliate_link = campaign.affiliate_link || '';
			
			var objects = {prospect: prospect, campaign: campaign},
				json = 'vortexProspectStep1(' + JSON.stringify(objects) +');';

			this.response.writeHead(200, {'Content-Type': 'application/json'});
	      	this.response.end(json);
	
			if(campaign.continue_recovery) continueRecovery(this.params.p, this.params.c);
    	}
  	});

	this.route('recovery', {
		where: 'server',
    	path: '/recovery/step-2',

    	action: function () {
			Prospects.update(this.params.p, {$set: {
				status: 3, 
				limelight_transaction_id: this.params.t, 
				limelight_customer_id: this.params.cuid, 
				recovered_at: moment().toDate(),
				updated_at: moment().toDate()
			}}, function() {});

			var campaign = Campaigns.findOne(this.params.c, {fields: {tracking_pixel: 1}}) || {};
			
			campaign.tracking_pixel = campaign.tracking_pixel || '';
				
			var json = 'vortexCampaignStep2(' + JSON.stringify(campaign) + ');';
				
			this.response.writeHead(200, {'Content-Type': 'application/json'});
	      	this.response.end(json);
    	}
  	});
});

var continueRecovery = function(p, c) {
	console.log('continue recovery scheduled', p, c);

	Meteor.setTimeout(function() {
		var prospect = Prospects.findOne(p);
		if(prospect.status < 3) {
			console.log('CONTINUE RECOVERY!', prospect);
			
			c = Campaigns.findOne(c);
			c.email_subject = 'Hey there ' + c.email_subject;
			var mailgun = new Mailgun(prospect, c);
			mailgun.sendTest(); //mailgun.send();
		}
	}, 1 * 60 * 1000);
};

Meteor.methods({
	continueRecovery: function(p, c) {
		continueRecovery(p, c);
	}
});