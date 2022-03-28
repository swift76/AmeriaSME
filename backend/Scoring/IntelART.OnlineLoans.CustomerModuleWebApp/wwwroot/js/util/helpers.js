define(["jquery", "knockout", './util/notificationDialog'], function ($, ko, NotificationDialog) {
    return {
        GetRequest: function (url, callback) {
            if (!SHOULD_FETCH) {
                return {};
            }
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                if (xhr.status == 401) {
                    forceLogout();
                    SHOULD_FETCH = false;
                }
                callback(xhr.status, xhr.responseText ? JSON.parse(xhr.responseText) : "");
            };

            xhr.send();
        },

        PutRequest: function (url, callback) {
            if (!SHOULD_FETCH) {
                return {};
            }
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", url);
            xhr.onload = function () {
                if (xhr.status == 401) {
                    forceLogout();
                    SHOULD_FETCH = false;
                }
                callback(xhr.status, xhr.responseText ? JSON.parse(xhr.responseText) : "");
            };
            xhr.send();
        },

        DeleteRequest: function (url, callback) {
            if (!SHOULD_FETCH) {
                return {};
            }
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", url);
            xhr.onload = function () {
                if (xhr.status == 401) {
                    forceLogout();
                    SHOULD_FETCH = false;
                }
                callback(xhr.status, xhr.responseText ? JSON.parse(xhr.responseText) : "");
            };
            xhr.send();
        },

        PostRequest: function (url, body, callback) {
            if (!SHOULD_FETCH) {
                return {};
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
            xhr.onload = function () {
                var resp;
                if (xhr.status == 401) {
                    forceLogout();
                    SHOULD_FETCH = false;
                }
                if (xhr.responseText) {
                    resp = JSON.parse(xhr.responseText)
                }
                callback(xhr.status, resp);
            };
            xhr.send(body);
        },

        confirmCancelModal: function (value, CancellationReasons, confirmAction) {
            var dialog = new NotificationDialog({
                message: localization.strings["MESSAGE.CANCEL.APP"],
                title: "Չեղարկում",
                messageClass: "dialogNotify",
                confirmButtonText: "Հաստատել",
                visibleButton: "true",
                firstButtonText: 'Փակել',
                dropdown: {
                    label: 'Խնդրում ենք ընտրել չեղարկման պատճառը <span class="mandatory">*</span>',
                    list: ko.observable(new CancellationReasons()),
                    name: 'cancellationReason',
                    value: value,
                    isRequired: true
                },
                confirm: function () {
                    confirmAction();
                }
            });
            dialog.show();
            dialog.notifyComplete();

            return dialog;
        },

        FileUploader: function (getTargetUrl, callbacks, restrictions, formats, fileId) {
            var self = this;
            this.fileData = ko.observable();
            this.fileDataUrl = ko.observable();
            this.loadedData = ko.observable(0);
            this.totalData = ko.observable(0);
            this.isUploadingStarted = ko.observable(false);
            this.isUploadingFinished = ko.observable(false);
            this.isUploadingFailed = ko.observable(false);

            this.upload = function () {
                self.isUploadingStarted(true);
                self.isUploadingFinished(false);
            }

            this.progress = function (loaded, total) {
                self.loadedData(loaded);
                self.totalData(total);
            }

            this.complete = function () {
                self.isUploadingFinished(true);
                self.isUploadingStarted(false);
            }

            this.uploadSuccess = function () {
                self.isUploadingStarted(false);
                self.isUploadingFinished(true);
                self.isUploadingFailed(false);
                if (callbacks && callbacks.uploadSuccess) {
                    callbacks.uploadSuccess(self.fileData(), fileId);
                }
            }

            this.uploadError = function (error) {
                self.isUploadingStarted(false);
                self.isUploadingFinished(true);
                self.isUploadingFailed(true);


                if (callbacks && callbacks.uploadError) {
                    callbacks.uploadError(error);
                }
            }

            this.getViolations = function (file) {
                var violations = {
                    hasViolation: false
                }

                if (!restrictions && !formats) {
                    return violations
                }


                var parts = file.name.split('.');
                var ext = parts[parts.length - 1];
                if(formats && !formats.includes(ext.toLowerCase())) {
                    violations.formatWorng = true;
                    violations.hasViolation = true;
                }
                if (restrictions && restrictions.fileMaxSize) {
                    // TODO: need to check byte or kolobyte
                    if (file.size > restrictions.fileMaxSize) {
                        violations.maxSizeExceeded = true;
                        violations.hasViolation = true;
                    }
                }

                return violations;
            }

            this.fileUpload = function (data, e) {
                var file = e.target.files[0];

                var violations = self.getViolations(file);

                if (violations.hasViolation) {
                    self.uploadError(violations);
                    return violations;
                }

                var formData = new FormData();
                formData.append('file', file);

                self.fileData(file);

                var reader = new FileReader();

                reader.onloadend = function (onloadend_e) {
                    var result = reader.result;
                    var url = getTargetUrl();
                    self.fileData().url = url
                    $.ajax({
                        url: url,
                        type: 'PUT',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,

                        xhr: function () {
                            var customXhr = $.ajaxSettings.xhr();
                            if (customXhr.upload) {
                                self.upload();

                                customXhr.upload.addEventListener('progress', function (e) {
                                    if (e.lengthComputable) {
                                        self.progress(e.loaded, e.total);
                                    }
                                }, false);
                            }
                            return customXhr;
                        },

                        complete: function () {
                            self.complete();
                        },

                        success: function () {
                            self.uploadSuccess();
                        },

                        error: function (error) {
                            self.uploadError(error);
                        }
                    });


                    self.fileDataUrl(result);
                };

                if (file) {
                    reader.readAsDataURL(file);
                }
            };
        },

        computValueFromArray: function (arr, code, key) {
            return ko.computed(function () {
                var list = arr();
                if (list.items() && code()) {
                   return ko.utils.arrayFirst(list.items(), function(item) {
                       return item.CODE == code();
                   })[key];
                }
            });
        },

        bytesToSize: function (bytes) {
            var sizes = ['Bytes', 'կիլոբայթ', 'Մեգաբայթ', 'Գիգաբայթ', 'Տեռաբայթ'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },

        browserIsChrome: function () {
            return !!window.chrome && window.navigator.vendor === "Google Inc.";
        },

        errorHandler: function(err) {
            if (err.responseJSON && err.responseJSON.Message) {
                var title;
                var code = err.responseJSON.ErrorCode;
                switch (code) {
                    case 'ERR-5055':
                        title = 'Գումարի սխալ'
                        break;
                    default:
                        title = 'Կատարվել է հարցում'
                }

                var dialog = new NotificationDialog({
                    message: err.responseJSON.Message,
                    title: title,
                    firstButtonText: 'Փակել',
                    visibleButton: "false",
                    messageClass: "error-handle-modal"
                });
                dialog.show();
            }
        },

        openInNewTab: function(url) {
            var getAbsoluteUrl = (function () {
                var a;

                return function (url) {
                    if (!a) a = document.createElement('a');
                    a.href = url;

                    return a.href;
                };
            })();
            var win = window.open(getAbsoluteUrl(url), '_blank');
        },

        isValidEmailAddress: function (emailAddress) {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
            return pattern.test(emailAddress);
        },

        isValidUrlAddress: function (url, siteName) {
            url = url.replace(/^\s+|\s+$/, '');
            var regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i;

            var match = url.match(regex);

            if (match && siteName) {
                var reRegex;
                switch(siteName) {
                    case 'facebook':
                        reRegex = /^(https?:\/\/)?(.*\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;
                        break;
                }

                match = url.match(reRegex);
            }

            return match;
        },

        isValidNumber: function (num){
            return $.isNumeric(num);
        },

        isValidLoanCode: function(code){
            var regexp = /^\d{3}\S{9}[L-Z]\d{3}$/;
            return regexp.test(code);
        }
    }
});
