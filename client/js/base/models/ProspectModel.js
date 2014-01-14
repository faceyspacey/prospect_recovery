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
	statuses: ['discovered', 'delivered', 'returned', 'recovered'],
	statuseClasses: ['danger', 'warning', 'info', 'success'],
	getStatus: function() {
		return this.statuses[this.status];
	},
	getStatusClass: function() {
		return this.statuseClasses[this.status];
	}
};