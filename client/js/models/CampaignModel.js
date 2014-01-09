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
        status: 'paused'
    };

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

CampaignModel.current = function() {
	return Campaigns.findOne(Session.get('current_campaign_id'));
};
