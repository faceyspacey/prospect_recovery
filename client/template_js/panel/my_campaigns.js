Template.my_campaigns.events({
	'click #pause_play': function() {
		var status = this.status == 'play' ? 'pause' : 'play';
		Campaigns.update(this._id, {$set: {status: status}});
	},
	'click #remove_campaign': function() {
		var yes = prompt('Are you sure you want to delete campaign, ' + this.name + '?');
		if(yes) Campaigns.remove(this._id);
	}
});