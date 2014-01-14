Template.page_1.rendered = function() {
	Deps.afterFlush(function() {		
		var directions = Template.directions();
		$('#html_holder').html(directions);
	});
};