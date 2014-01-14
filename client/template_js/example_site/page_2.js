Template.page_2.created = function() {
	Deps.afterFlush(function() {
		$('#example_site_container').css('height', '860px');
		
		$('body').append(Template.embed_code_step_2());
		

		setTimeout(function() {
			var iframe = $('#pixel_holder').html();

			message = 'Your conversion tracked. Check your "recovery" stats on your Dashboard and on the My Campaigns page to confirm. You can also find the fake prospect you made at the top of the My Prospects page.'
			if(iframe) message += ' In addition, Vortex also added a tracking pixel of their own for your campaign (which has your TRANSACTION_ID injected into it). Here is what it looks like: '+iframe;
			
			alert(message);
		}, 3000);
		
		
	});
};