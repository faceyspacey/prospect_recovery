Template.dashboard.created = function() {
	displayChart();
	
	Deps.afterFlush(function() {
		$('html,body').animate({scrollTop: 0}, 300, 'easeOutExpo');
	});
};

displayChart = function() {
	Deps.afterFlush(function() {
		var stats = Stats.findOne();

		if(!stats) return setTimeout(displayChart, 50);

		$('#chart_holder').html('').append('<div id="areachart" style="height: 250px; position: relative;"></div>');

		var morris_area_options = {
		    element: "areachart",
		    behaveLikeLine: true,
		    data: stats.days,
		    xkey: 'date', 
		    ykeys: ['discoveries', 'deliveries', 'returns', 'recoveries'],
		    labels: ['Discoveries', 'Deliveries', 'Returns', 'Recoveries'],
		    lineColors: ["#f9c1c1", '#FFDB75', "#c1daf9", "#16a085", "#2c3e50", "#1abc9c", "#34495e", "#9b59b6", "#e74c3c"]
		  };

		if($('#areachart').length !== 0) Morris.Area(morris_area_options);
	});
};



Template.widget_area_graph.created = function() {
	Session.set('chart_days', 12);
	Session.set('chart_campaign_id', 'all');
};

Template.widget_area_graph.helpers({
	'active_pill': function(days) {
		return Session.get('chart_days') == days ? 'active' : ''; 
	},
	selected: function(val) {
		return val == Session.get('chart_campaign_id') ? 'selected="selected"' : '';
	},
	averageDeliveriesPerDay: function() {	
		if(!Stats.findOne()) return 0;
		
		var average = _.reduce(Stats.findOne().days, function(memo, day) {
			return memo + day.deliveries;
		}, 0) / Stats.findOne().days.length;
		
		return Math.round(average);
	},
	totalDeliveries: function() {
		if(!Stats.findOne()) return 0;
		
		return _.reduce(Stats.findOne().days, function(memo, day) {
			return memo + day.deliveries;
		}, 0);
	},
	totalReturns: function() {
		if(!Stats.findOne()) return 0;
		
		return _.reduce(Stats.findOne().days, function(memo, day) {
			return memo + day.returns;
		}, 0);
	},
	totalRecoveries: function() {
		if(!Stats.findOne()) return 0;
		
		return _.reduce(Stats.findOne().days, function(memo, day) {
			return memo + day.recoveries;
		}, 0);
	},
	upDown: function() {
		if(!Stats.findOne()) return 0;
		
		var up = Stats.findOne().days[1].deliveries >= Stats.findOne().days[2].deliveries;
		return up ? 'up' : 'down';
	},
	upDownColor: function() {
		if(!Stats.findOne()) return 0;
		
		var up = Stats.findOne().days[1].deliveries >= Stats.findOne().days[2].deliveries;
		return up ? '' : 'background-color: rgb(235, 132, 132)';
	},
	upDownValue: function() {
		if(!Stats.findOne()) return 0;

		var today = Stats.findOne().days[1].deliveries,
			yesterday = Stats.findOne().days[2].deliveries,
			percent = (today/yesterday * 100);

		if(yesterday === 0) return '+100';
		
		if(today >= yesterday) percent = percent - 100;
		else percent = 100 - percent;

		return (today >= yesterday ? '+' : '-') + Math.round(percent);
	}
});


Template.widget_area_graph.events({
	'click #chart_half_day': function() {
		Session.set('chart_days', 12); //yes, it's a temporary hack we should eventually fix; i.e. set cycle type + count
	},
	'click #chart_day': function() {
		Session.set('chart_days', 24); //yes, it's a temporary hack we should eventually fix; i.e. set cycle type + count
	},
	'click #chart_week': function() {
		Session.set('chart_days', 7);
	},
	'click #chart_2_weeks': function() {
		Session.set('chart_days', 14);
	},
	'click #chart_month': function() {
		Session.set('chart_days', 30);
	},
	'change select': function(e) {
		var campaignId = $(e.currentTarget).val();
		Session.set('chart_campaign_id', campaignId);
	},
});






