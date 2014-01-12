getDateSelectors = function(endDay) {
	return _.map(_.range(0, endDay), function(day) {
		return {
			name: startOfDay(day).format("YYYY-MM-DD"),
			selector: {
				$gte: startOfDay(day).toDate(),
				$lt: endOfDay(day).toDate()
			}
		};
	});
}


getMonthSelector = function() {
	return {
		$gte: startOfDay(29).toDate(),
		$lt: endOfDay(0).toDate()
	}
};

startOfDay = function(day) {
	return moment().startOf('day').subtract(day, 'day');
};

endOfDay = function(day) {
	return moment().endOf('day').subtract(day, 'day');
};

