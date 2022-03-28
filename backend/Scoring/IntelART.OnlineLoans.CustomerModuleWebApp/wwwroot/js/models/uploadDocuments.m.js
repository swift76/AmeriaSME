define(['jquery'], function ($) {
    return {
        getDocuments: function (id) {
            return $.get({
                url: "/api/loan/Applications/" + id + "/Documents",
                dataType: 'json'
            }).then(function (data) {
                return data
            });
        },

        getDocumentsMaxCount: function () {
            return $.get({
                url: "/api/loan/Settings/ScanMaxCount",
                dataType: 'json'
            }).then(function (data) {
                return data
            });
        },

        getDocumentMaxSize: function () {
            return $.get({
                url: "/api/loan/Settings/FileMaxSize",
                dataType: 'json'
            }).then(function (data) {
                return data
            });
        },

        deleteDocumentByType: function (id, docId) {
            return $.ajax({
                type: 'DELETE',
                url: "/api/loan/Applications/"+ id +"/Documents/" + docId,
                dataType: 'json'
            });
        },

        getDocumentUrl: function (id, documentTypeCode) {
            return "/api/loan/Applications/" + id + "/Documents/" + documentTypeCode;
        }
    };
});