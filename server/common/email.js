Emailer = function(campaign, prospect) {
	this.campaign = campaign;
	this.prospect = prospect;
	
	this.html = campaign.email_html;
	this.plain = campaign.email_plain;
};

Emailer.prototype = {
	applyTokens: function() {
		this.html = this.html.replace('[FIRST_NAME]', this.prospect.first_name);
		this.html = this.html.replace('[LAST_NAME]', this.prospect.last_name);
		this.html = this.html.replace('[EMAIL]', this.prospect.email);
		this.html = this.html.replace('[CITY]', this.prospect.city);
		this.html = this.html.replace('[STATE]', this.prospect.state);
		
		this.plain = this.plain.replace('[FIRST_NAME]', this.prospect.first_name);
		this.plain = this.plain.replace('[LAST_NAME]', this.prospect.last_name);
		this.plain = this.plain.replace('[EMAIL]', this.prospect.email);
		this.plain = this.plain.replace('[CITY]', this.prospect.city);
		this.plain = this.plain.replace('[STATE]', this.prospect.state);
	}
};

