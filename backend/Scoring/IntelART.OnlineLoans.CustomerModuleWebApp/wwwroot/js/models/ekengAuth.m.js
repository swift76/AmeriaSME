define(['jquery', '../constants/ekeng'], function($, ekengConstants) {
	return {
		authorizeUser: function() {
			return new Promise(function(resolve, reject) {
				$.ajax({
					type: "POST",
					url: "https://eid.ekeng.am/authorize",
					data: {
						token: ekengConstants.token,
						opaque: ekengConstants.opaque
					},
					async: false,
					timeout: 10000,
					dataType: 'json'
				}).then(function(data) {
					resolve(data);
				}, function(err) {
					reject(err);
				});
			});
		}
	};
});