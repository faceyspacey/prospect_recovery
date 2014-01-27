Template.admin_campaign_pixel.created = function() {
	Deps.afterFlush(function() {
		$('#tracking_pixel').attr('placeholder', 'EXAMPLE: <iframe src="http://cookiedomain.com/p.ashx?o=OFFER_ID&k=KEY54321&t=[TRANSACTION_ID]" height="1" width="1" frameborder="0"></iframe>');
	});
};

Template.admin_campaign_pixel.events({
	'click #submit_pixel': function() {
		this.affiliate_link = $('#affiliate_link').val();
		this.tracking_pixel = $('#tracking_pixel').val();
		this.save();
		Router.go('admin_campaign_approval');
	}
});