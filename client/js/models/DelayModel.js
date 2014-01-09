/** DelayModel attributes:
 *
 *  name                        		Str
 *  minutes                        		Int
 *
 */

DelayModel = function(doc){
	this.collectionName = 'Delays';
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};


