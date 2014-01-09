Template.step_2.created = function() {
	Deps.afterFlush(function() {
		$('#campaign_step_2').animate({left: '0%'}, 800, 'easeOutBack');
	});
};

Template.step_2.helpers({
	limelightCampaigns: function() {
		return _.range(1,10);
	}
});
Template.step_2.events({
	
});