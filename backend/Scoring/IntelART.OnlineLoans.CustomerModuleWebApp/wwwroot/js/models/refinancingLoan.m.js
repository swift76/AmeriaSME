define(['jquery'], function ($) {
    return {
        getRefinancingLoan: function (id) {
            return $.get({
                url: "/api/loan/RefinancingLoan/" + id,
                dataType: 'json'
            }).then(function (data) {
                return data
            });
        },

        updateRefinancingLoan: function (id) {
            return $.ajax({
                type: 'POST',
                url: "/api/loan/RefinancingLoan/"+ id,
                dataType: 'json'
            });
        }
    };
});