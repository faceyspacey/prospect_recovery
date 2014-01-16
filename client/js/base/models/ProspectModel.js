/** ProspectModel attributes:
 *
 *  first_name                        	Str
 *  last_name							Str
 *  email								Str
 *  phone								Str
 *  address								Str
 *  address_2							Str
 *  city								Str
 *  state								Str
 *  zip									Str
 *  country								Str
 *  ip_address							Str
 *  limelight_campaign_id               Int
 *  campaign_id                  		Str
 *  campaign_name						Str
 *  user_id	  							Str
 *  status								Int (0 = discovered, 1 = email delivered, 2 = returned, 3 = recovered)
 *  signedup_at                  		Date 
 *  delivered_at                  		Date
 *  returned_at                  		Date
 *  recovered_at                  		Date
 *  not_via_link						Bool
 *
 **/

ProspectModel = function(doc) {
	this.collectionName = 'Prospects';
	this.defaultValues = {};
	
	
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};



ProspectModel.prototype = {
	statusNames: function() {
		return ['discovered', 'delivered', 'returned', 'recovered'];
	},
	statusClassNames: function() {
		return ['danger', 'warning', 'info', 'success'];
	},
	getStatus: function() {
		return this.statusNames()[this.status];
	},
	getStatusClass: function() {
		return this.statusClassNames()[this.status];
	},
	
	
	displayNotification: function() {
		document.body.appendChild(Meteor.render(Template.notification_box(this)));
	},
	getSubject: function() {
		return this._tokenReplacer().getSubject();
	},
	getPlain: function() {
		return this._tokenReplacer().getPlain();
	},
	getHtml: function() {
		return this._tokenReplacer().getHtml();
	},
	getLink: function() {
		return this._tokenReplacer().getLink();
	},
	_tokenReplacer: function(campaign) {
		return this.__tokenReplacer || (this.__tokenReplacer = new TokenReplacer(this, this.getCampaign()));
	},
	getCampaign: function() {
		return this._campaign || (this._campaign = Campaigns.findOne({_id: this.campaign_id}));
	}
};