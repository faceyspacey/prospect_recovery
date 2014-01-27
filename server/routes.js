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
				campaign = Campaigns.findOne(this.params.c, {fields: {affiliate_link: 1}}) || {};
			
			campaign.affiliate_link = campaign.affiliate_link || '';
			
			var objects = {prospect: prospect, campaign: campaign},
				json = 'vortexProspectStep1(' + JSON.stringify(objects) +');';

			this.response.writeHead(200, {'Content-Type': 'application/json'});
	      	this.response.end(json);
	
			//if(campaign.continue_recovery) continueRecovery(this.params.p, this.params.c);
    	}
  	});

	this.route('recovery', {
		where: 'server',
    	path: '/recovery/step-2',

    	action: function () {
			Prospects.update(this.params.p, {$set: {
				status: 3, 
				transaction_id: this.params.t, 
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
	var self = this;
	setTimeout(function() {
		var prospect = Prospects.findOne(p);
		if(prospect.status < 3) {
			var mailgun = new Mailgun(prospect, Campaigns.findOne(c));
			mailgun.sendTest(); //mailgun.send();
		}
	}, campaign.minutes_delay * 60 * 1000);
};