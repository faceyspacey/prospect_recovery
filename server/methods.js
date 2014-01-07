Meteor.methods({
	applyLimelightInfo: function(domain, username, password) {
		var limelight = new Limelight(domain, username, password)
			cookieToken = limelight.login();
		
		if(cookieToken) {
			console.log('TEST REQUEST WORKED!');
			Meteor.users.update(Meteor.userId(), {$set: {
				cookie_token: cookieToken, 
				domain: domain,
				limelight_username: username,
				limelight_password: password,
				limelight_login_configured: true
			}});
		}
		else {
			console.log('TEST REQUEST FAILED!');
			Meteor.users.update(Meteor.userId(), {$set: {
				limelight_login_configured: false
			}});
		}
			
	}
});

Limelight = function(domain, username, password) {
	this.domain = domain;
	this.username = username;
	this.password = password;
};

Limelight.prototype.login = function(domain, username, password) {
	this._goToLoginPage();	
	var cookieToken = this._submitLoginForm();
	
	if(this._testIfLoggedin(cookieToken)) this.cookieToken = cookieToken;
	else this.cookieToken = null;
	
	return this.cookieToken;
};


Limelight.prototype._goToLoginPage = function(domain, username, password) {
	var response = HTTP.get(domain+'/admin/login.php'),
		loginPageHtml = response.content,
		$ = cheerio.load(loginPageHtml);
		
	this.securityToken = $('input[name=securityToken]').val(),
	this.initialCookie = response.headers['set-cookie'][0].split('; path')[0],
	this.loginUrl = $('form').attr('action');
};


Limelight.prototype._submitLoginForm = function() {
	try {
		var content = 'login_url=&admin_name='+this.username+'&admin_pass='+this.password+'&securityToken='+this.securityToken,
			result = HTTP.post(this.loginUrl, { 
				content: content,
				headers: {
					'Content-Length': content.length,
					'Content-Type': 'application/x-www-form-urlencoded',
					'Cache-Control': 'max-age=0',
					'Cookie': 'p_cookie=1; o_cookie=1; c_cookie=1; b_cookie=1; ' + this.initialCookie,
					'Host': this.domain.replace('http://', '').replace('https://', ''),
					'Origin': this.domain,
					'Referer': this.domain+'/admin/login.php',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Accept-Encoding': 'gzip,deflate,sdch',
					'Accept-Language': 'en-US,en;q=0.8',
					'Connection': 'keep-alive',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
				}
			});
			
		var cookieToken = result.headers['set-cookie'][0].split('; path')[0];
		
		console.log('cookie token', cookieToken);
		return cookieToken;
		
	} catch (error) {
		console.log('LOGIN ERROR!', error);
		return undefined;
	}
};


Limelight.prototype._testIfLoggedin = function(cookieToken) {
	try {
		var result = HTTP.get(this.domain+'/admin/campaign/index.php', {
				headers: {
					cookie: cookieToken
				}
			});
	} catch (error) {
		return false;
	}
	
	console.log(result);
	
	if(!result.content) return false;
	
	$ = cheerio.load(result.content)
	if($('#list_campaign_jump_url').length > 0) return true;
	else return false;
};

