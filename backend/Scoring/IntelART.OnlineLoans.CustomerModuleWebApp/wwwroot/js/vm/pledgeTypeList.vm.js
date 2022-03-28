define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    PledgeTypes = function () {
        var self = this;
        this.items = ko.onDemandObservable(self.getItems, this);
    }

    PledgeTypes.prototype.getItems = function () {
        var self = this;
        (new LookupDirectory()).getPledgeTypes(function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return PledgeTypes;
});