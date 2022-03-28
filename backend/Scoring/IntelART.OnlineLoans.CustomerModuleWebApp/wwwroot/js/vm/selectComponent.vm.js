define(['knockout', 'jquery'], function (ko, $) {
	function SelectViewModel (params) {
		var self = this;
		self.isDisabled = ko.observable(false);
		self.list = params.list;
		self.validationErrors = params.validationErrors;
		self.name = params.name;
		self.value = params.value;
		self.isRequired = params.required || false;

		self.updateDisabled = ko.computed(function () {
			if (params.isEditable && !params.isEditable()) {
				self.isDisabled(true);
			} else if (params.disabled) {
				self.isDisabled = params.disabled;
			} else {
				self.isDisabled(false);
			}
			return self.isDisabled()
		});

		ko.computed(function () {
			var list = self.list();
			if (list && list.items() && list.items.loaded()) {
				if (self.isRequired && list.items().length === 1) {
					// TODO: remove timeout (check loan interest)
					setTimeout(function () {
						self.value(list.items()[0].CODE);
					}, 5);
				}
			}
		});

		self.optionsAfterRender = function (option, item) {
			ko.applyBindingsToNode(option, { disable: !item }, item);
		}
	}
	return SelectViewModel;
});