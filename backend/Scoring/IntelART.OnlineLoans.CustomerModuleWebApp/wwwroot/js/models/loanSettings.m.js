define(['jquery'], function($) {
	var settings = null;
	return {
		getLoanSettings: function() {
			return new Promise(function(resolve, reject) {
				if (settings) {
					resolve(settings);
				} else {
					$.get({
						url: "/api/loan/Settings/LoanSettings",
						dataType: 'json'
					}).then(function(data) {
						settings = data
						resolve(data);
					}, function(err) {
						reject(err);
					});
				}
			});
		}
	};
});