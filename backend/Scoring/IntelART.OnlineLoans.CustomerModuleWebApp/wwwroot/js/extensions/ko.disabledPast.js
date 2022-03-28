define(['knockout', 'jquery'], function (ko, $) {
    ko.bindingHandlers['disablePast'] = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());

            if (val) {
                $(element).bind('paste', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
});