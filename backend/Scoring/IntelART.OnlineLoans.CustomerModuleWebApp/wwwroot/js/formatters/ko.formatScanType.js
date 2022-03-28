define(['knockout', '../constants/scanTypes'], function (ko, ScanTypes) {
    ko.bindingHandlers.formatScanType = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            var value = val.value
            var key = val.key;
            if (ScanTypes && value && key) {
                val = ScanTypes[val.value][key]
            };
            ko.bindingHandlers.text.update(element, function () { return val; });
        }
    };
});