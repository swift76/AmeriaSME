define(['knockout', 'jquery'], function (ko, $) {

    CreditCardTypeList = function (loanType, currency) {
        var self = this;
        this.items = ko.onDemandObservable(function () { self.getItems(loanType, currency) }, this);
    }

    CreditCardTypeList.prototype.getItems = function (loanType, currency) {
        var self = this;
        (new LookupDirectory()).creditCardTypes(loanType, currency, function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return CreditCardTypeList;
});