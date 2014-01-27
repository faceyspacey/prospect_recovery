/** CampaignModel attributes:
 *
 *  _id                         			Str
 *  name                        			Str
 *  url                        				Str
 *  from_email                  			Str
 *  from_name                  				Str
 *  email_plain                  			Str
 *  email_html                  			Str
 *	limelight_destination_campaign_id		Str
 *  minutes_delay                  			Int
 *  continue_recovery                  		Bool
 *  complete		                  		Bool
 *  approved		                  		Bool
 *  play			                  		Bool
 *	affiliate_link							Str
 *	tracking_pixel							Str
 *  user_id									Str
 *
 **/

CampaignModel = function(doc){
	this.collectionName = 'Campaigns';
    this.defaultValues = {};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

CampaignModel.prototype = {
	user: function() {
		return Meteor.users.findOne({_id: this.user_id});
	},
	getDomain: function() {
		return this.from_email.split('@')[1];
	},
	statusClass: function() {
		if(!this.approved) return 'danger';
		
		if(!this.play) return 'warning';
		if(this.play) return 'success';
	},
	statusName: function() {
		if(!this.approved) return 'pending approval';
		
		if(!this.play) return 'paused';
		if(this.play) return 'playing';
	},
	statusText: function() {
		if(!this.play) return 'play';
		if(this.play) return 'pause';
	},
	approvalClass: function() {
		return this.approved ? 'success' : 'danger';
	},
	approvalName: function() {
		return this.approved ? 'approved' : 'pending';
	},
	approvalText: function() {
		return this.approved ? 'disapprove' : 'approve';
	},
	deliveries: function() {
		if(!Stats.findOne()) return;
		if(!Stats.findOne().campaigns[this._id]) return;
		
		return Stats.findOne().campaigns[this._id].deliveries;
	},
	returns: function() {
		if(!Stats.findOne()) return;
		if(!Stats.findOne().campaigns[this._id]) return;
		
		return Stats.findOne().campaigns[this._id].returns;
	},
	recoveries: function() {
		if(!Stats.findOne()) return;
		if(!Stats.findOne().campaigns[this._id]) return;
		
		return Stats.findOne().campaigns[this._id].recoveries;
	}
};

CampaignModel.current = function() {
	return Campaigns.findOne(Session.get('current_campaign_id'));
};
