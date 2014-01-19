/** UserModel attributes:
 *
 *
**/


StatsModel = function(doc) { 
    this.collectionName = 'Stats';
	this.defaultValues = {};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};





StatsModel.prototype = {
	deliveryCount: function(index) {
		return this.getPeriods()[index].deliveries;
	},
	getPeriods: function() {
		return this.isHours() ? this.hours : this.days;
	},
	isHours: function() {
		return Session.equals('chart_days', 24) || Session.equals('chart_days', 12);
	}
};