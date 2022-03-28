define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    ActivitiesList = function (country) {
        var self = this;
        this.items = ko.onDemandObservable(function () { self.getItems(country) }, this);
    }

    ActivitiesList.prototype.getItems = function () {
       var self = this;
       (new LookupDirectory()).getActivities(function (data) {
           self.items(data);
           self.items.loaded(true);
       });
    };

    return ActivitiesList;
});