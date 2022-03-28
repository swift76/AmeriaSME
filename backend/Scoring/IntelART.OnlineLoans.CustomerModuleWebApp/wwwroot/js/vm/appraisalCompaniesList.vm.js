define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    AppraisalCompaniesList = function () {
        var self = this;
        this.items = ko.onDemandObservable(self.getItems, this);
    }

    AppraisalCompaniesList.prototype.getItems = function () {
        var self = this;
        (new LookupDirectory()).getAppraisalCompanies(function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return AppraisalCompaniesList;
});