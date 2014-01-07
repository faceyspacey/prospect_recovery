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

	/**
    this.usage = function(){
        return Venues.find({usedFlavors: {$in: [this._id]}}).count();
    };
	
	this.oneOffQuantityAvailable = function() {
		return this.one_off_quantity_available || 0;
	};
	**/

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

