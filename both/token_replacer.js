TokenReplacer = function(prospect, campaign) {
	this.prospect = prospect;
	this.campaign = campaign;
	
	this.html = campaign.email_html;
	this.plain = campaign.email_plain;
	this.subject = campaign.email_subject;
	
	var self = this;
	
	_.each(this.getTokens(), function(token) {
		self.html = self.html.replace(token.name, token.key);
		self.plain = self.plain.replace(token.name, token.key);
		self.subject = self.subject.replace(token.name, token.key);
	});
};

TokenReplacer.prototype = {
	getHtml: function() {
		return this.html;
	},
	getPlain: function() {
		return this.plain;	
	},
	getSubject: function() {
		return this.subject;		
	},
	getLink: function() { 
		return this.campaign.url + '?p='+this.prospect._id+'&c='+this.campaign._id;
	},
	getLinkTestingPurposes: function() { 
		return this.campaign.url + '?p='+this.prospect._id+'&c='+this.campaign._id + " <br /> <br />-------- <br /> TEMP TEST URL: " + Meteor.absoluteUrl('example/page-1') + '?p='+this.prospect._id+'&c='+this.campaign._id + ' <br />--------';
	},
	getTokens: function() {
		return this._tokens || (this._tokens = [
			{name: /\[FIRST_NAME\]/g, key: this.prospect.first_name},
			{name: /\[LAST_NAME\]/g, key: this.prospect.last_name},
			{name: /\[EMAIL\]/g, key: this.prospect.email},
			{name: /\[PHONE\]/g, key: this.prospect.phone},
			{name: /\[ADDRESS\]/g, key: this.prospect.address},
			{name: /\[ADDRESS_2\]/g, key: this.prospect.address_2},
			{name: /\[CITY\]/g, key: this.prospect.city},
			{name: /\[STATE\]/g, key: this.prospect.state},
			{name: /\[COUNTRY\]/g, key: this.prospect.country},
			{name: /\[ZIP\]/g, key: this.prospect.zip},
			{name: /\[IP_ADDRESS\]/g, key: this.prospect.ip_address},
			{name: /\[DESTINATION_URL\]/g, key: this.getLink()},
		]);
	}
}