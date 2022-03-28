define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    LoanPurposesList = function () {
        var self = this;
        this.items = ko.onDemandObservable(self.getItems, this);
    }

    LoanPurposesList.prototype.getItems = function () {
        var self = this;
        (new LookupDirectory()).getLoanPurposes(function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return LoanPurposesList;
});