define(['knockout', 'jquery', 'numeric'], function (ko, $) {
    ko.bindingHandlers['numericInput'] = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor();

            var defaultParams = {
                allowThouSep: false,
                allowDecSep: false,
                allowMinus: false
            };

            var params = $.extend(value, defaultParams);

            $(element).numeric(params);
            $(element).number(value.isNumber);
            $(element).on('change blur', function () {
                var val = $(this).val();
                value.value(val);
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor());
            if (val.value()) {
                $(element).val(val.value());
            }
        },
    };
});