define(['knockout', 'lookupDirectory'], function (ko, LookupDirectory) {

    LoanAmountLimits = function (loanType, currency) {
        this.min = ko.observable();
        this.max = ko.observable();

        this.loadData = function () {
            var self = this;
            if (!loanType && !currency) return;
            $.get({
                url: "/api/loan/LoanLimits?loanTypeCode=" + loanType + "&currency=" + currency,
                context: this,
                success: function (data) {
                    if (data) {
                        this.min(data.FROM_AMOUNT);
                        this.max(data.TO_AMOUNT);
                    }
                },
                dataType: 'json'
            });
        };
    }

    ////LoanAmountLimits.prototype.getData = function (loanType, currency) {
    ////    var self = this;
    ////    $.get({
    ////        url: "/api/loan/LoanLimits?loanTypeCode=" + loanTypeCode + "&currency=" + currency,
    ////        context: this,
    ////        success: function (data) {
    ////            currencies[loanType] = data;
    ////        },
    ////        dataType: 'json'
    ////    });
    ////};

    return LoanAmountLimits;
});