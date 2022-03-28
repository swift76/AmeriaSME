define(['knockout', 'jquery'], function (ko, $) {
    ko.bindingHandlers['validationError'] = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());

            if (val && val.value && val.propertyName) {
                var result = val.value().filter(function (obj) { return obj.propertyName == val.propertyName; })[0];

                $(element).next('.validationError').remove();
                if (result) { // add error message
                    $('<span class="validationError">' + result.errorMessage + '</span>').insertAfter($(element));
                    $(element).focus();
                }
            }
        }
    };
});