vc = function(name, value, options) {
    if (typeof value != 'undefined') { 
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};





vortexProspectStep1 = function(prospect) {
	var $ = $ || jQuery,
		att;
		
	for(att in prospect) {
		console.log('.vortex_'+att, prospect[att]);
		$('.vortex_'+att).text(prospect[att]).val(prospect[att]);
	}
	
	vc('vp_id', prospect['_id'], {path: '/'});
	vc('vc_id', prospect['campaign_id'], {path: '/'});
};

vortexCampaignStep2 = function(campaign) {
	var $ = $ || jQuery,
		t = $('#vortex_script').val();
			
	vc('vp_id', null, {path: '/'});
	vc('vc_id', null, {path: '/'});
	
	$("<div />", {id: "pixel_holder"}).appendTo("body").append(campaign.tracking_pixel.replace("[TRANSACTION_ID]", t));
};


$(function() {
	try {
		var $ = $ || jQuery,
			isStep2 = vc('vp_id') || false,
			t = $('#vortex_script').attr('transaction_id'),
			p = isStep2 ? vc('vp_id') : window.location.search.substring(1).split('&')[0].split('=')[1],
			c = isStep2 ? vc('vc_id') : window.location.search.substring(1).split('&')[1].split('=')[1],
			d = window.location.protocol + '//' + window.location.host,
			url = isStep2 ? d+'/recovery/step-2?p='+p+'&c='+c+'&t='+t : d+'/recovery/step-1?p='+p+'&c='+c ,
			callback = isStep2 ? 'vortexCampaignStep2' : 'vortexProspectStep1';

		$.ajax({
			     url: url,
			     dataType: 'jsonp',
			 	 jsonpCallback: callback,
				 contentType: "application/json"	     
			 });
	}
	catch (e) {console.log(e);}
});

