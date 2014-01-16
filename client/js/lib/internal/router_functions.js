RT = {
	redirectIf: function(flag, route) {
		if(!Router.current() || !flag) return;
		
		if(route != Router.current().route.name) Router.go(route);
	}
}