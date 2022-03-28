define(['knockout', '../constants/currencies'], function (ko, currencies) {
    ko.bindingHandlers.formatedCurrency = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            var currency = currencies.filter(function (item) {return item.CODE === val })[0]
            if (currency) {
            	ko.bindingHandlers.text.update(element, function () { return currency.NAME; });
            };
        }
    };
});