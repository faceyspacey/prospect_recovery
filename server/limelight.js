Meteor.methods({
	getLimelightCookieToken: function(userId, domain, username, password) {
		var limelight = new Limelight(userId, domain, username, password)
			cookieToken = limelight.login();
			
			return cookieToken;			
	},
	createLimelightApiAccount: function() {
		var limelight = new Limelight;
		limelight.login();
		
		var limeApiCredentialsObj = limelight.createLimelightApiAccount();
		return limeApiCredentialsObj;
	},
	limelightCampaigns: function() {
		var limelight = new LimelightApi;
		return limelight.getCampaigns();
	}
});

Limelight = function(userId, domain, username, password) {
	this.user_id = userId || Meteor.userId();
	this.domain = domain || Meteor.user().limelight_domain;
	this.username = username || Meteor.user().limelight_username;
	this.password = password || Meteor.user().limelight_password;
};

Limelight.prototype = {
	login: function() {
		if(this._goToLoginPage()) {
			var cookieToken = this._submitLoginForm();
			if(cookieToken && this._testIfLoggedin(cookieToken)) this.cookieToken = cookieToken;
		}
	
		return this.cookieToken || (this.cookieToken = null);
	},
	_goToLoginPage: function() {
		try {
			var response = HTTP.get(this.domain+'/admin/login.php'),
				loginPageHtml = response.content,
				$ = cheerio.load(loginPageHtml);

			this.securityToken = $('input[name=securityToken]').val(),
			this.initialCookie = response.headers['set-cookie'][0].split('; path')[0],
			this.loginUrl = $('form').attr('action');

			console.log('Limelight._goToLoginPage() SUCCESS!', this.securityToken, this.initialCookie, this.loginUrl);
			return true;
		}
		catch (error) {
			console.log('Limelight._goToLoginPage() ERROR!', error);
			return false;
		}
	},
	_submitLoginForm: function() {
		try {
			var	content = this._getLoginFormContent(),
				result = HTTP.post(this.loginUrl, {
					content: content, 
					headers: this._getHeaders(content, this.initialCookie)
				}),
				cookieToken = result.headers['set-cookie'][0].split('; path')[0];

			console.log('Limelight._submitLoginForm() SUCCESS!!! - cookie token:', cookieToken);
			return cookieToken;		
		} 
		catch (error) {
			console.log('Limelight._submitLoginForm ERROR!', error);
			return undefined;
		}
	},
	_testIfLoggedin: function(cookieToken) {
		try {
			var result = HTTP.get(this.domain+'/admin/campaign/index.php', {headers: {cookie: cookieToken}}),
				$ = cheerio.load(result.content);

			if($('#list_campaign_jump_url').length > 0) {
				console.log('_testIfLoggedin() SUCCESS!') ;
				return true;
			} 
		} 
		catch (error) {
			console.log('Limelight._testIfLoggedin ERROR!', error);
			return false;
		}

		return false;
	},
	_getLoginFormContent: function() {
		return 'login_url=&admin_name='+this.username+'&admin_pass='+this.password+'&securityToken='+this.securityToken;
	},
	_getHeaders: function(content, cookie, referer) {
		return {
			'Content-Length': content.length,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Cache-Control': 'max-age=0',
			'Cookie': 'p_cookie=1; o_cookie=1; c_cookie=1; b_cookie=1; ' + cookie,
			'Host': this.domain.replace('http://', '').replace('https://', ''),
			'Origin': this.domain,
			'Referer': referer || this.domain+'/admin/login.php',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip,deflate,sdch',
			'Accept-Language': 'en-US,en;q=0.8',
			'Connection': 'keep-alive',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
		};
	},
	createLimelightApiAccount: function() {		
		try {
			this._visitApiPage();
			
			var content = 'input_name='+this._apiUsername(),
				headers = this._getHeaders(content, this.cookieToken, this.domain+'/admin/integration/index.php');
				
			headers['X-Requested-With'] = 'XMLHttpRequest';
			
			var result = HTTP.post(this.domain+'/admin/ajax_min.php?action=ll_ajax_save_integration', {
				content: content,
				headers: headers
			});

			console.log('POST RESULTS', result);
			
			return {
				limelight_api_username: this._apiUsername(),
				limelight_api_password: this._getLimelightApiPassword()
			};
		} 
		catch (error) {
			console.log('Limelight.createLimelightApiAccount() ERROR!', error);
			return false;
		}

		return false;
	},
	_visitApiPage: function() {
		this._$(this.domain+'/admin/integration/index.php'); //visit the page naturall so the referrer is accurate
	},
	_getLimelightApiPassword: function() {
		var $ = this._$(this.domain+'/admin/integration/index.php'),
			apiPassword = undefined,
			_this = this;
		
		$('#list_integration tr').each(function() { 
			var username = $(this).find('td:nth-child(2)').text(),
				password = $(this).find('td:nth-child(3)').text();
				
			if(username == _this._apiUsername()) apiPassword = password;
		});
		
		console.log('createLimelightApiAccount SUCCESS!!! -- apiUsername: '+this._apiUsername()+', apiPassword: '+apiPassword);
		
		return apiPassword;
	},
	_apiUsername: function() {
		return 'vortex_'+this.user_id;
	},
	_$: function(url) {
		var response = HTTP.get(url, {headers: {cookie: this.cookieToken}}),
			$ = cheerio.load(response.content);
			
		return $;
	}
};


LimelightApi = function() {
	this.username = Meteor.user().limelight_api_username;
	this.password = Meteor.user().limelight_api_password;
	this.domain = Meteor.user().limelight_domain;
};

LimelightApi.prototype = {
	_api: function(method, data) {
		data = _.isObject(data) ? data : {};	
			
		data.username = this.username;
		data.password = this.password;
		data.method = method;
		
		var response = HTTP.post(this.domain+'/admin/membership.php', {params: data});
		console.log(this.domain+'/admin/membership.php', data, method, response);
		return response;
	},
	_buildContent: function(data) {
		var content = '';
		for(var key in data) {
			content += key + '=' + data[key] + '&';
		}
		return content.substring(0, content.length -1);
	},
	getCampaigns: function() {
		return this._api('campaign_find_active');
	}
}


















