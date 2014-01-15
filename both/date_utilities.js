getDateSelectors = function(endDay, timezone) {
	return _.map(_.range(0, endDay), function(day) {
		return {
			name: startOfDay(day, timezone).format("YYYY-MM-DD"),
			selector: {
				$gte: startOfDay(day, timezone).toDate(),
				$lt: endOfDay(day, timezone).toDate()
			}
		};
	});
}


getMonthSelector = function() {
	return {
		$gte: startOfDay(29, 5).toDate(),
		$lt: endOfDay(0, 5).toDate()
	}
};

startOfDay = function(day, timezone) {
	return moment().zone(timezone).startOf('day').subtract(day, 'day');
};

endOfDay = function(day, timezone) {
	return moment().zone(timezone).endOf('day').subtract(day, 'day');
};

