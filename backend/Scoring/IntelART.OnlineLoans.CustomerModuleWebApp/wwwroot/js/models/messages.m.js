define(['jquery'], function($) {
	return {
		getBankMessage: function(id) {
			return new Promise(function(resolve, reject) {
				$.get({
					url: "/api/loan/Message/" + id,
					dataType: 'json'
				}).then(function(data) {
					resolve(data);
				}, function(err) {
					reject(err);
				});
			});
		},
		addMessage: function(id, data) {
			return new Promise(function(resolve, reject) {
				$.ajax({
					type: "POST",
					data: data,
					url: "/api/loan/Message/" + id,
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