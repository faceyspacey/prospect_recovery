Template.page_1.created = function() {
	Deps.afterFlush(function() {
		embedScript();
	});
}

Template.page_2.created = function() {
	Deps.afterFlush(function() {
		embedCookies(); //this applies the step 1 cookies, which may have been cleared if doing multiple tests at once from my recoveries
		embedScript(); 
		setTimeout(function() {
			var iframe = $('#pixel_holder').html();
			if(iframe) {
				var message = 'Here is the Vortex conversion pixel that was injected into the page: '+iframe;

				alert(message);
			}
		}, 3000);

	});
};



embedScript = function() {
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = getCurrentHost()+"/js/embed.js";
	document.getElementsByTagName('head')[0].appendChild(script);
};

embedCookies = function() {
	//set cookies with prospect and campaign IDs even though step 1 is supposed to do that
	//the reason is because when testing via the TEST/UNDO button you can open up multiple
	//test landing pages at a time and replace the cookie, making it so only one
	//prospect can reach the 'recovered' status at a time		
	COOKIE('vp_id', Session.get('p'), {path: '/'});
	COOKIE('vc_id', Session.get('c'), {path: '/'});
};