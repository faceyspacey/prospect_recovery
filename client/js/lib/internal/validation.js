isValidPhone = function(phone) {
	var digits = phone.replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/ /g, "");

	if(!(digits.length == 10 || digits.length == 11)) return false;
	return digits;
};

isValidEmail = function(email) {
  	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	if(!regex.test(email)) return false;
	
	var otherUser = Meteor.users.findOne({emails: {$elemMatch: {address: email}}});
	
	if(otherUser && otherUser._id != Meteor.userId()) return false;
	
	return true;
};