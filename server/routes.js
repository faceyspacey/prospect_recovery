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

			var prospect = Prospects.findOne(this.params.p),
				json = 'vortexProspectStep1(' + JSON.stringify(prospect) +');';

			this.response.writeHead(200, {'Content-Type': 'application/json'});
	      	this.response.end(json);
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

			var campaign = Campaigns.findOne(this.params.c, {fields: {tracking_pixel: 1}});
				campaign.tracking_pixel = campaign.tracking_pixel || '';
				
			var json = 'vortexCampaignStep2(' + JSON.stringify(campaign) + ');';

				console.log(campaign, this.params);
				
			this.response.writeHead(200, {'Content-Type': 'application/json'});
	      	this.response.end(json);
    	}
  	});
});