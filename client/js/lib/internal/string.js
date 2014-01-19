percentage = function(num, den) {
	var percentString = Math.round(num/den * 10000) + '';
	return percentString.slice(0, -2) + '.' + percentString.slice(-2);
};