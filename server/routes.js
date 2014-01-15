Router.map(function () {
  	this.route('recovery', {
		where: 'server',
    	path: '/recovery',

    	action: function () {
			var res;
			
			if(!this.params.c) res = ServerPages.renderCookieScript();
			else if(this.params.t && this.params.t != 'TRANSACTION_ID') res = ServerPages.renderCompletionPage(this.params);
			else res = ServerPages.renderPaymentPage(this.params);
				
      		this.response.writeHead(200, {'Content-Type': 'application/javascript'});
      		this.response.end('$(function() {'+res+'});');
    	}
  	});
});

ServerPages = {
	renderPaymentPage: function(params) {
		Prospects.update(params.p, {$set: {status: 2, returned_at: Date}}, function() {});
		
		//inject prospect values into page
		var prospect = Prospects.findOne(params.p),
			js = 'var p = ' + JSON.stringify(prospect) +';';
		
		js += 'var att;';
		js += 'for(att in p) $(".vortex_"+att).text(p[att]).val(p[att]);';
		js += Template.cookie_code({p: this.params.p, c: this.params.c});
		
		return js;
		
	},
	renderCompletionPage: function(params) {
		Prospects.update(params.p, {$set: {status: 3, transaction_id: params.t, recovered_at: Date}}, function() {});
		
		//inject vortex-provided tracking pixel into page
		var pixel = Campaigns.findOne(params.c, {fields: {tracking_pixel: 1}})
			campaign = JSON.stringify(pixel)
			js = 'var c = ' + campaign + ';';		
		
		js += '$("<div />", {id: "pixel_holder"}).appendTo("body").append(c.tracking_pixel.replace("[TRANSACTION_ID]", "'+params.t+'"));';
		
		return js;
	},
	renderCookieScript: function() {
		return Template.cookie_code_2();
	}
};
