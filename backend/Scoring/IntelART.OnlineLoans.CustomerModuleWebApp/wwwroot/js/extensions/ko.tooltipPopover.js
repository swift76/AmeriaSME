define(['knockout', 'jquery'], function (ko, $) {
    ko.bindingHandlers['tooltip'] = {
       init: function(element, valueAccessor) {
           var local = ko.utils.unwrapObservable(valueAccessor());
           var options = {};

           ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
           ko.utils.extend(options, local);

           $(element).tooltip(options);

           ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
               $(element).tooltip("destroy");
           });
       },
       options: {
           placement: "top",
           trigger: "hover"
       }
    };

    ko.bindingHandlers['popover'] = {
       init: function(element, valueAccessor) {
           var local = ko.utils.unwrapObservable(valueAccessor());
           var options = {};

           ko.utils.extend(options, ko.bindingHandlers.popover.options);
           ko.utils.extend(options, local);

           $(element).popover(options);

           ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
               $(element).popover("destroy");
           });
       },
       options: {
           placement: "top",
           trigger: "hover"
       }
    };
});