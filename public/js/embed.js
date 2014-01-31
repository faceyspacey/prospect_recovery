var vortex$;
prepJquery = function() {
	try {
		vortex$ = ll;
	}
	catch(error) {
		console.log('ll error');
		try {
			vortex$ = jQuery;
		}
		catch(error) {
			console.log('jQuery error');
			try {
				vortex$ = $;
			}
			catch(error) {
				console.log('$ error');
				
				var script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';	
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		}
	}
};
prepJquery();


getJquery = function(callback) {
	try {
		vortex$ = $;
		callback();
		console.log('getJquery success');
	}
	catch(error) {
		console.log('getJquery error');
		setTimeout(function() {
			getJquery(callback);
		}, 250);
	}
};


getParameterByName = function(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

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





vortexProspectStep1 = function(objects) {
	if(!vortex$) {
		getJquery(function() {
			vortexProspectStep1(objects);
		});
		return;
	}
	
	var $ = vortex$,
		prospect = objects.prospect,
		campaign = objects.campaign,
		att;
		
	for(att in prospect) {
		try {
			console.log('.vortex_'+att, prospect[att]);
			if(att == 'state') {
				$('.vortex_'+att + ' option').each(function() {
					if($(this).attr('value') == prospect[att]) $(this).attr('selected', 'selected');
				});
			}
			else $('.vortex_'+att).text(prospect[att]).val(prospect[att]);
		}
		catch(error) {
			console.log('attribute caught error', error);
		}
	}
	
	
	if(campaign.affiliate_link) {
		$("<iframe />", {
			id: "affiliate_link_pixel",
			src: campaign.affiliate_link,
			height: '1',
			width: '1',
			frameborder: '0'	
		}).appendTo("body");
	}
	
	vc('vp_id', prospect['_id'], {path: '/'});
	vc('vc_id', prospect['campaign_id'], {path: '/'});
};

vortexCampaignStep2 = function(campaign) {
	if(!vortex$) {
		getJquery(function() {
			vortexCampaignStep2(campaign);
		});
		return;
	}
	
	console.log('vortex step 2', campaign);
	
	var $ = vortex$,
		winLo = window.location,
		t = getParameterByName(winLo.search, 'order_id') || (winLo.pathname.indexOf('/TEST_ORDER') > -1 ? 'TEST_ORDER' : ''),
		pixel = campaign.tracking_pixel.replace("[TRANSACTION_ID]", 'TRANSACTION_ID').replace("TRANSACTION_ID", t);

	$("<div />", {id: "pixel_holder"}).appendTo("body").append(pixel);
	
	vc('vp_id', null, {path: '/'});
	vc('vc_id', null, {path: '/'});
};

pingVortex = function() {
	try {
		var $ = vortex$,
			winLo = window.location,
			t = getParameterByName(winLo.search, 'order_id') || (winLo.pathname.indexOf('/TEST_ORDER') > -1 ? 'TEST_ORDER' : ''),
			cuid = getParameterByName(window.location.search, 'Customer_Id') || 'TEST_CUSTOMER',
			isStep2 = (getParameterByName(winLo.search, 'order_id') || winLo.pathname.indexOf('/TEST_ORDER') > -1) ? true : false,
			p = isStep2 ? vc('vp_id') : winLo.search.substring(1).split('&')[0].split('=')[1],
			c = isStep2 ? vc('vc_id') : winLo.search.substring(1).split('&')[1].split('=')[1],
			sc = $('script[src$="/js/embed.js"]'),
			d = sc.length > 0 ? sc.attr('src').replace('/js/embed.js', '') || window.location.protocol+'//www.vortexconvert.com',
			url = isStep2 ? d+'/recovery/step-2?p='+p+'&c='+c+'&t='+t +'&cuid='+cuid : d+'/recovery/step-1?p='+p+'&c='+c ,
			callback = isStep2 ? 'vortexCampaignStep2' : 'vortexProspectStep1';

		$.ajax({
			     url: url,
			     dataType: 'jsonp',
			 	 jsonpCallback: callback,
				 contentType: "application/json"	     
			 });
	}
	catch (e) {console.log(e);}
};

if(!vortex$) getJquery(pingVortex);
else pingVortex();

