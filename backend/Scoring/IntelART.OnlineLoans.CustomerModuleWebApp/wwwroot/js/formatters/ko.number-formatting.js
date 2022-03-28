define(['knockout'], function (ko) {
    ko.bindingHandlers.formatedNumber = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            $(element).number(val);
        }
    };
});

