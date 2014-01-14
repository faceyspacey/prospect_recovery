getParameterByName = function(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

getCurrentHost = function() {
	return window.location.protocol + '//' + window.location.host;
};

getCurrentUrl = function() {
	return getCurrentHost()  + window.location.pathname;
};