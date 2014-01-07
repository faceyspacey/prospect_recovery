Meteor.methods({
	applyLimelightInfo: function(domain, username, password) {

		var response = HTTP.get(domain+'/admin/login.php'),
			loginPageHtml = response.content,
			$ = cheerio.load(loginPageHtml),
			securityToken = $('input[name=securityToken]').val(),
			initialCookie = response.headers['set-cookie'][0].split('; path')[0],
			loginUrl = $('form').attr('action');
		
		//console.log('SECURITY TOKEN & INITIAL COOKIE', loginUrl, securityToken, username, password, initialCookie);
		//return;
		
		try {
			var result = HTTP.post(loginUrl, { //domain+'/admin/login.php'
					content: 'login_url=&admin_name='+username+'&admin_pass='+password+'&securityToken='+securityToken,
					headers: {
						'Content-Length': 105,
						'Content-Type': 'application/x-www-form-urlencoded',
						'Cache-Control': 'max-age=0',
						'Cookie': 'p_cookie=1; o_cookie=1; c_cookie=1; b_cookie=1; ' + initialCookie,
						//'Host': 'www.productssecure.com',
						'Origin': domain,
						'Referer': domain+'/admin/login.php',
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						'Accept-Encoding': 'gzip,deflate,sdch',
						'Accept-Language': 'en-US,en;q=0.8',
						'Connection': 'keep-alive',
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36'
					}
				});
		} catch (error) {
			console.log('LOGIN ERROR!', error);
			return;
		}
		
		console.log("RESULT", result);
		
		var cookieToken = result.headers['set-cookie'][0].split('; path')[0];
		console.log('cookie token', cookieToken, result.headers['set-cookie'], result);
		
		//return; 
		
		if(testRequest(domain, cookieToken)) {
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
			
	},
	test: function(cookieToken) {
		try {
			var result = HTTP.get('https://www.productssecure.com/admin/campaign/index.php', {
					headers: {
						'Cookie': cookieToken
					}
				});
		} catch (error) {
			console.log('TEST REQUEST ERROR!', error);
		}
		console.log('SUCESS RESULT', result);
	}
});

testRequest = function(domain, cookieToken) {
	console.log('the cokie token is', cookieToken);
	try {
		var result = HTTP.get('https://www.productssecure.com/admin/campaign/index.php', {
				headers: {
					cookie: cookieToken
				}
			});
	} catch (error) {
		console.log('TEST REQUEST ERROR!', error);
		return false;
	}
	
	console.log(result);
	
	if(!result.content) return false;
	
	$ = cheerio.load(result.content)
	if($('#list_campaign_jump_url').length > 0) return true;
	else return false;
}

