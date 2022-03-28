define(['jquery'], function($) {
	return {
		checkCompanyLLC: function(id) {
			return $.get({
				url: "/api/loan/Company/" + id + "/IsCompanyLLC",
				dataType: 'json'
			}).then(function(data) {
				return data
			});
		},

		getCompanyMultipleOwners: function(id) {
			return $.get({
				url: "/api/loan/Company/" + id + "/HasCompanyMultipleOwners",
				dataType: 'json'
			}).then(function(data) {
				return data
			});
		}
	};
});