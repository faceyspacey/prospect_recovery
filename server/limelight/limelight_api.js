Meteor.methods({
	testLimelightApi: function(method, params) {
		var limelightApi = new LimelightApi;
		return limelightApi._api(method, params);
	}
});

LimelightApi = function(username, password, domain) {
	this.username = username || Meteor.user().limelight_api_username;
	this.password = password || Meteor.user().limelight_api_password;
	this.domain = domain || Meteor.user().limelight_domain;
};

LimelightApi.prototype = {
	api: function(method, data, callback) {
		data = _.isObject(data) ? data : {};	
			
		data.username = this.username;
		data.password = this.password;
		data.method = method;
		
		if(callback) HTTP.post(this.domain+'/admin/membership.php', {params: data}, callback);
		else return HTTP.post(this.domain+'/admin/membership.php', {params: data});
	}
};




