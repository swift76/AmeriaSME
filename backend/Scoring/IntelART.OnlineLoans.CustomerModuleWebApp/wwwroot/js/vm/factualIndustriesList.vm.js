define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    FactualIndustriesList = function () {
        var self = this;
        this.items = ko.onDemandObservable(self.getItems, this);
    }

    FactualIndustriesList.prototype.getItems = function () {
        var self = this;
        (new LookupDirectory()).getFactualIndustries(function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return FactualIndustriesList;
});