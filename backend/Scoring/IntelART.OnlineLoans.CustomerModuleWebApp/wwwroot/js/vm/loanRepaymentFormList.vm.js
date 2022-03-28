define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    LoanRepaymentFormsList = function () {
        var self = this;
        this.items = ko.onDemandObservable(self.getItems, this);
    }

    LoanRepaymentFormsList.prototype.getItems = function () {
        var self = this;
        (new LookupDirectory()).getLoanRepaymentForms(function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return LoanRepaymentFormsList;
});