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
	fullName: function() {
		return this.first_name + ' ' + this.last_name;
	},
	user: function() {
		return Meteor.users.findOne(this.user_id);
	},
	orderUrl: function() {
		return this.user().limelight_domain +'/admin/orders.php?show_details=show_details&show_folder=view_all&fromPost=1&act=&page=0&show_by_id='+this.limelight_transaction_id;
	},
	
	statusNames: function() {
		return ['discovered', 'delivered', 'returned', 'recovered'];
	},
	statusClassNames: function() {
		return ['danger', 'warning', 'info', 'success'];
	},
	icons: function() {
		return ['power-off', 'envelope', 'user', 'share-sign'];
	},
	getStatus: function() {
		return this.statusNames()[this.status];
	},
	getStatusClass: function() {
		return this.statusClassNames()[this.status];
	},
	iconClass: function() {
		return this.icons()[this.status];
	},
	
	displayNotification: function() {
		if(Session.equals('notifications_on_off', 'off')) return;
		
		Deps.afterFlush(function() {
			document.body.appendChild(Meteor.render(Template.notification_box(this)));
		}.bind(this));
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
		return Campaigns.findOne({_id: this.campaign_id});
	},
	getDeliveryMinutesLapsed: function() {
		if(this.delivered_at) return ((this.delivered_at - this.discovered_at)/(1000 * 60) + '').substring(0, 3) + ' min';
	}
};