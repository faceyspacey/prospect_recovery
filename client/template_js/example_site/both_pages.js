Template.page_1.created = function() {
	Deps.afterFlush(function() {
		appendEmbedScriptToHead();
	});
}

Template.page_2.created = function() {
	Deps.afterFlush(function() {
		appendEmbedScriptToHead();

		setTimeout(function() {
			var iframe = $('#pixel_holder').html();
			if(iframe) {
				var message = 'Here is the Vortex tracking pixel that was injected into the page: '+iframe;

				alert(message);
			}
		}, 3000);

	});
};



appendEmbedScriptToHead = function() {
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = getCurrentHost()+"/js/embed.js";
	script.id = 'vortex_script';
	script.transaction_id = 'TRANSACTION_ID';
	
	document.getElementsByTagName('head')[0].appendChild(script);
}