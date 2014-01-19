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
		    data: getPeriods(),
		    xkey: 'date', 
		    ykeys: ['discoveries', 'deliveries', 'returns', 'recoveries'],
		    labels: ['Discoveries', 'Deliveries', 'Returns', 'Recoveries'],
			xLabelFormat: function(date) {
				return isHours() ? moment(date).format('ha') : moment(date).format('M/D');
			},
		    lineColors: ["#f9c1c1", '#FFDB75', "#5E9AE4", "#16a085", "#2c3e50", "#1abc9c", "#34495e", "#9b59b6", "#e74c3c"]
		  };

		if($('#areachart').length !== 0) Morris.Area(morris_area_options);
	});
};



Template.widget_area_graph.created = function() {
	Session.set('chart_days', 24);
	Session.set('chart_campaign_id', 'all');
};

Template.widget_area_graph.helpers({
	'active_pill': function(days) {
		return Session.get('chart_days') == days ? 'active' : ''; 
	},
	selected: function(val) {
		return val == Session.get('chart_campaign_id') ? 'selected="selected"' : '';
	},
	averageDeliveries: function() {	
		if(!Stats.findOne()) return 0;
		
		var average = _.reduce(getPeriods(), function(memo, period) {
			return memo + period.deliveries;
		}, 0) / getPeriods().length;
		
		return Math.round(average);
	},
	totalDeliveries: function() {
		if(!Stats.findOne()) return 0;
		
		if(Session.equals('chart_days', 24)) return Stats.findOne().days[0].deliveries;
		
		return _.reduce(getPeriods(), function(memo, period) {
			return memo + period.deliveries;
		}, 0);
	},
	totalReturns: function() {
		if(!Stats.findOne()) return 0;
		
		return _.reduce(getPeriods(), function(memo, period) {
			return memo + period.returns;
		}, 0);
	},
	totalReturnsPercentage: function() {
		var returns = _.reduce(getPeriods(), function(memo, period) {
				return memo + period.returns;
				}, 0),
			deliveries = _.reduce(getPeriods(), function(memo, period) {
					return memo + period.deliveries;
				}, 0);

			if(deliveries === 0 || returns === 0) return 0;
			return percentage(returns, deliveries);
	},
	totalRecoveries: function() {
		if(!Stats.findOne()) return 0;
		
		return _.reduce(getPeriods(), function(memo, period) {
			return memo + period.recoveries;
		}, 0);
	},
	totalRecoveryPercentage: function() {
		var recoveries = _.reduce(getPeriods(), function(memo, period) {
				return memo + period.recoveries;
				}, 0),
			deliveries = _.reduce(getPeriods(), function(memo, period) {
					return memo + period.deliveries;
				}, 0);
			
			if(deliveries === 0 || recoveries === 0) return 0;
			return percentage(recoveries, deliveries);
	},
	upDown: function() {
		if(!Stats.findOne()) return 0;
		
		var up = this.deliveryCount(1) >= this.deliveryCount(2);
		return up ? 'up' : 'down';
	},
	upDownColor: function() {
		if(!Stats.findOne()) return 0;
		
		var up = this.deliveryCount(1) >= this.deliveryCount(2);
		return up ? '' : 'background-color: rgb(235, 132, 132)';
	},
	upDownValue: function() {
		if(!Stats.findOne()) return 0;

		var current = this.deliveryCount(1),
			last = this.deliveryCount(2),
			percent = (current/last * 100);

		if(last === 0 && current === 0) return '----';
		if(last === 0) return '+100%';
		if(last === current) return '+0%';
		
		if(current > last) percent = percent - 100;
		else percent = 100 - percent;

		return (current > last ? '+' : '-') + Math.round(percent) + '%';
	},
	periodName: function() {
		return isHours() ? 'hour' : 'day';
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


getPeriods = function() {
	if(!Stats.findOne()) return false;
	
	return isHours() ? Stats.findOne().hours : Stats.findOne().days;
};

isHours = function() {
	return Session.equals('chart_days', 24) || Session.equals('chart_days', 12);
};





