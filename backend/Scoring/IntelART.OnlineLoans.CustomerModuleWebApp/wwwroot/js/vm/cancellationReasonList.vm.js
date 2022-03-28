define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    CancellationReasons = function () {
        var self = this;
        this.items = ko.onDemandObservable(self.getItems, this);
    }

    CancellationReasons.prototype.getItems = function () {
        var self = this;
        (new LookupDirectory()).getCancellationReasons(function (data) {
            self.items(data);
            self.items.loaded(true);
        });
    };

    return CancellationReasons;
});

