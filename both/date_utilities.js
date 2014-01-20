getDateSelectors = function(endDay, timezone) {
	return _.map(_.range(0, endDay), function(day) {
		return {
			start: startOfDay(day, timezone).format("YYYY-MM-DD"),
			end: endOfDay(day, timezone).format("YYYY-MM-DD"),
			selector: {
				$gte: startOfDay(day, timezone).toDate(),
				$lt: endOfDay(day, timezone).toDate()
			}
		};
	});
}


getMonthSelector = function(timezone) {
	return {
		$gte: moment().zone(timezone).startOf('month').toDate(), //startOfDay(29, 5).toDate(),
		$lt: moment().zone(timezone).endOf('day').toDate() //endOfDay(0, 5).toDate()
	}
};

startOfDay = function(day, timezone) {
	return moment().zone(timezone).startOf('day').subtract(day, 'day');
};

endOfDay = function(day, timezone) {
	return moment().zone(timezone).endOf('day').subtract(day, 'day');
};




getHourSelectors = function(hours, timezone) {
	return _.map(_.range(0, hours), function(hour) {
		return {
			start: moment().zone(timezone).startOf('hour').subtract(hour, 'hour').format("YYYY-MM-DD HH:mm:ss"),
			end: moment().zone(timezone).endOf('hour').subtract(hour, 'hour').format("YYYY-MM-DD HH:mm:ss"),
			selector: {
				$gte: moment().zone(timezone).startOf('hour').subtract(hour, 'hour').toDate(),
				$lt: moment().zone(timezone).endOf('hour').subtract(hour, 'hour').toDate()
			}
		};
	});
}


