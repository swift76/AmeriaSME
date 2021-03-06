define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    StateList = function (country) {
        var self = this;
        this.items = ko.onDemandObservable(function () { self.getItems(country) }, this);
    }

    StateList.prototype.getItems = function (country) {
        var self = this;
        if (!country) {
            self.items([]);
            self.items.loaded(true);
            return;
        }
        (new LookupDirectory()).getStates(country, function (states) {
            self.items(states);
            self.items.loaded(true);
        });
    };

    return StateList;
});