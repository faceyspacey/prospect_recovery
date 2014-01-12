/** CampaignModel attributes:
 *
 *  collectionName              		'Campaigns'
 *  _id                         		Str
 *  name                        		Str
 *  url                        			Str
 *  name                        		Str
 *  reply_email                  		Bool
 *  one_off_quantity_available  		deliveries
 *  one_off_quantity_available  		returns
 *  one_off_quantity_available  		recoveries
 *  created_at                  		Date
 *  updated_at                  		Date
 *
 */

CampaignModel = function(doc){
	this.collectionName = 'Campaigns';
    this.defaultValues = {
        status: 'pause'
    };

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

CampaignModel.prototype = {
	statusClass: function() {
		if(this.status == 'pause') return 'warning';
		if(this.status == 'play') return 'success';
	},
	statusName: function() {
		if(this.status == 'pause') return 'paused';
		if(this.status == 'play') return 'playing';
	},
	statusIcon: function() {
		if(this.status == 'pause') return 'play';
		if(this.status == 'play') return 'pause';
	},
	deliveries: function() {
		return Stats.findOne().campaigns[this._id].deliveries;
	},
	returns: function() {
		return Stats.findOne().campaigns[this._id].returns;
	},
	recoveries: function() {
		return Stats.findOne().campaigns[this._id].recoveries;
	}
};

CampaignModel.current = function() {
	return Campaigns.findOne(Session.get('current_campaign_id'));
};
