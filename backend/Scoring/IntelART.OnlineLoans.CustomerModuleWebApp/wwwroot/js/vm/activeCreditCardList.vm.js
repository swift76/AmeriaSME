define(['knockout', 'jquery'], function (ko, $) {

    ActiveCreditCardList = function (id) {
        var self = this;
        this.items = ko.onDemandObservable(function () { self.getItems(id) }, this);
    }

    ActiveCreditCardList.prototype.getItems = function (id) {
        var self = this;
        $.get({
            url: "/api/loan/Applications/" + id + "/ClientActiveCards",
            context: self,
            success: function (data) {
                var cards = [];
                for (var i = 0; i < data.length; i++) {
                    cards[i] = { CODE: data[i].CARD_NUMBER, NAME: data[i].CARD_DESCRIPTION };
                }
                self.items(cards);
                self.items.loaded(true);
            },
            dataType: 'json'
        });
    };

    return ActiveCreditCardList;
});