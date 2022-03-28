define(['knockout',
        'jquery',
        'helpers',
        '../util/notificationDialog',
        '../models/uploadDocuments.m'
        ], function (ko, $, helpers, NotificationDialog, docModel) {
    MultipleFileUpload = function (params, isEditable) {
        var self = this;

        self.id = params.id,
        self.isEditable = ko.observable();
        self.clientCode = ko.observable(params.clientCode);
        self.validationErrors = ko.observableArray();
        self.documentMaxSize = params.documentMaxSize;
        self.documentMaxCount = Number(params.documentMaxCount.VALUE);
        self.documentType = params.documentMaxCount.CODE;
        self.documentBlockInfo = params.documentBlockInfo;
        self.documentList = ko.observableArray(modifyDocuments(params.documentList));
        self.getDocumentUrl = docModel.getDocumentUrl;
        self.editableScanTypes = params.editableScanTypes

        self.updateEditable = ko.computed(function () {
            if (self.editableScanTypes().length) {
                var editable = self.editableScanTypes().indexOf(self.documentType) > -1
                self.isEditable(editable);
            } else {
                self.isEditable(isEditable());
            }
            return self.isEditable();
        });

        function modifyDocuments (docs) {
            for (var i = 0; i < docs.length; i++) {
                var uniqId = generateRandomID();
                var doc = docs[i];
                doc.id = uniqId;
                doc.isUploaded = true;
                doc.uploader = createUploader(uniqId, doc.APPLICATION_SCAN_TYPE_CODE);
            }

            return docs;
        }


        function uploadError (error) {
            var options;
            var defaultoptions = {
                messageClass: "dialogNotify",
                firstButtonText: 'Փակել',
                visibleButton: "false"
            }
            if (!error) return;

            if (error.formatWorng && error.maxSizeExceeded) {
                options = {
                    message: "Ֆայլի ֆորմատը սխալ է և չափը գերազանցում է " + helpers.bytesToSize(self.documentMaxSize) + "ը։ Կցվող ֆայլը պետք է լինի PDF կամ JPEG ֆորմատով: Խնդրում ենք կցել ավելի փոքր չափի ֆայլ։",
                    title: "Ֆայլի ֆորմատի սխալ և Ֆայլի չափի գերազանցում",
                }
            } else if (error.formatWorng) {
                options = {
                    message: "Ֆայլի ֆորմատը սխալ է: Կցվող ֆայլը պետք է լինի PDF կամ JPEG ֆորմատով:",
                    title: "Ֆայլի ֆորմատի սխալ"
                }
            } else if (error.maxSizeExceeded) {
                options = {
                    message: "Կցվող ֆայլի չափը գերազանցում է " + helpers.bytesToSize(self.documentMaxSize) + "ը։ Խնդրում ենք կցել ավելի փոքր չափի ֆայլ։",
                    title: "Ֆայլի չափի գերազանցում"
                }
            } else {
                helpers.errorHandler(error)
            }

            if (options) {
                var dialog = new NotificationDialog($.extend(true, defaultoptions, options));
                dialog.show();
                dialog.notifyComplete();
            }
        }

        function uploadSuccess (fileData, id) {
            // get document id from document url
            var url = fileData.url;
            var regex = /.{3}$/gm;
            var scantype = regex.exec(url)[0];

            var oldItem = ko.utils.arrayFirst(self.documentList(), function (item) {
                return item.id === id;
            });

            self.documentList.replace(oldItem, {
                id: id,
                APPLICATION_SCAN_TYPE_CODE: scantype,
                FILE_NAME: fileData.name,
                isUploaded: true,
                uploader: createUploader(id, scantype)
            });
        }

        function pad2(number) {
            return (number < 10 ? '0' : '') + number
        }

        function getIndexById (id, docs) {
            var index;
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].id === id) {
                    index = i;
                    break;
                }
            }
            return index;
        }


        function removeDocFromLocalArray (id) {
            var docIndex = getIndexById(id, self.documentList());
            if (typeof docIndex != undefined) {
                self.documentList.splice(docIndex, 1);
            }
        }

        function createUploader (id, scantype) {
            return new helpers.FileUploader(
                function () {
                    return createDocumentUrl(scantype)
                },
                {uploadSuccess: uploadSuccess,uploadError: uploadError},
                {fileMaxSize: self.documentMaxSize},
                ["jpeg","jpg","pdf"],
                id
            )
        }

        function createDocumentUrl (scantype) {
            if (!scantype) {
                scantype = getNewScanType(self.documentList());
            }
            var url = docModel.getDocumentUrl(self.id, scantype);
            return url;
        }

        function getNewScanType (arr) {
            var numbers = [];
            for (var i = 0; i < arr.length; i++) {
                var scanType = arr[i].APPLICATION_SCAN_TYPE_CODE;
                if (scanType) {
                    numbers.push(Number(scanType.replace( /^\D+/g, '')))
                }
            };

            return self.documentType + pad2(getNextId(numbers, self.documentMaxCount));
        }


        function getNextId(arr, max){
            for (var i = 1; i <= max; i++) {
                if (!arr.includes(i)) return i;
            }
        }

        function generateRandomID () {
            var id = ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-5);
            return id;
        };

        self.addNewRow = function (view, event) {
            var arr = self.documentList()
            var id = generateRandomID();
            arr.push({
                id: id,
                APPLICATION_SCAN_TYPE_CODE: '',
                FILE_NAME: '',
                isUploaded: false,
                uploader: createUploader(id)
            });
            self.documentList.valueHasMutated();
        }

        self.removeRow = function (view, event) {
            var arr = self.documentList();
            // check if document uploaded
            if (view.isUploaded) {
                docModel.deleteDocumentByType(self.id, view.APPLICATION_SCAN_TYPE_CODE).complete(function (data) {
                    if (data.status === 200) {
                        removeDocFromLocalArray(view.id);
                    } else {
                        helpers.errorHandler(data)
                    }
                });
            } else {
                removeDocFromLocalArray(view.id);
            }
        }

        self.validate = function () {
            var self = this;
            self.validationErrors([]);
            var wereDocumentsUploaded = false;

            if (!self.clientCode() || self.clientCode().length == 0)
            {
                wereDocumentsUploaded = self.isPassportUploaded() && self.isSocCardUploaded();

                if (!self.isPassportUploaded()) {
                    self.validationErrors.push({ propertyName: 'passportUploadedData', errorMessage: localization.errors["REQUIRED_DOCUMENT"] });
                }
                if (!self.isSocCardUploaded()) {
                    self.validationErrors.push({ propertyName: 'socCardUploadedData', errorMessage: localization.errors["REQUIRED_DOCUMENT"] });
                }
            }

            return (self.validationErrors().length === 0) && wereDocumentsUploaded;
        }
    }

    return MultipleFileUpload;
});