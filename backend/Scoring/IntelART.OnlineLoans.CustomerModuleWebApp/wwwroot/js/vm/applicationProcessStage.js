define(['knockout'], function (ko) {
    ApplicationStage = function (code, factory) {
        var c = factory;
        var self = this;
        this.view = ko.onDemandObservable(function () {
            var obj = c();
            obj.loadData(function () {
                self.view(obj);
            })
        }, this);

        this.code = code;
        this.isAccessible = ko.observable();
        this.isEditable = ko.observable(true);

        this.isBusy = ko.observable(false);

        this.action = function (name) {
            if (self.view
                && self.view.loaded()
                && self.view().action) {
                self.isBusy(true);
                try {
                    self.view().action(name, function () {
                        self.isBusy(false);
                    });
                }
                catch (e) {
                    self.isBusy(false);
                }
            }
        }
    }

    return ApplicationStage;
});