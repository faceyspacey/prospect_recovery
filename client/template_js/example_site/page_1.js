Template.page_1.rendered = function() {
	Deps.afterFlush(function() {		
		var directions = Template.directions();
		$('#html_holder').html(directions);
		
		$('input').each(function() {
			$(this).attr('placeholder', '<input class="'+$(this).attr('class')+'" />');
		});
		
		$('body').append(Template.embed_code());
	});
};


