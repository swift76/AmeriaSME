define(['knockout',
	'jquery',
	'./multipleFileUpload.vm',
	'../models/uploadDocuments.m',
	'../constants/scanTypes'
	],
	function (ko, $, MultipleFileUpload, UploadDocumentsModel, ScanTypes) {

		UploadDocuments = function (params, isEditable) {
			var self = this;
			self.id = params.id,
			self.isEditable = isEditable;
			self.clientCode = ko.observable(params.clientCode);
			self.validationErrors = ko.observableArray();
			self.scanMaxCount = ko.observableArray();
			self.documents = ko.observableArray();
			self.taxReportingUploader = ko.observable();
			self.documentSections = ko.observableArray([]);
			self.isSecured = params.isSecured;
			self.itemsLoaded = ko.observable(false);
			self.editableScanTypes = params.editableScanTypes;

			self.loadData = function (id, callback) {
				$.when(UploadDocumentsModel.getDocuments(id),
						UploadDocumentsModel.getDocumentsMaxCount(),
						UploadDocumentsModel.getDocumentMaxSize())
				.then(function (documents, scanMaxCount, documentMaxSize) {
					scanMaxCount = moveItemToEndOfArray(scanMaxCount, 'O');
					self.documents(documents);
					self.scanMaxCount(scanMaxCount);
					var maxCountArr = self.scanMaxCount();

					for (var i = 0; i < maxCountArr.length; i++) {
						var documentTypeCode = maxCountArr[i].CODE;
						if (!self.isSecured &&
							  (documentTypeCode === 'C'
							|| documentTypeCode === 'A'
							|| documentTypeCode === 'P'
							|| documentTypeCode === 'M'
							|| documentTypeCode === 'R')) {
							continue;
						}

						self.documentSections.push(
							new MultipleFileUpload({
								id: self.id,
								clientCode: self.clientCode(),
								documentList: getDocumentsByType(documentTypeCode),
								documentMaxCount: maxCountArr[i],
								documentMaxSize: documentMaxSize,
								documentBlockInfo: ScanTypes[documentTypeCode],
								editableScanTypes: self.editableScanTypes
							}, self.isEditable)
						)
					}

					self.itemsLoaded(true);

					if (callback) {
						callback(true);
					}
				});
			}

			function getDocumentsByType (type) {
				var arr = self.documents();
				return arr.filter(function (item) {
					return item.APPLICATION_SCAN_TYPE_CODE.indexOf(type) > -1
				});
			}

			function getItemIndexByCode (arr, code) {
				var index;
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].CODE === code) {
						index = i;
						break;
					}
				}
				return index;
			};

			function moveItemToEndOfArray (array, code) {
				var index = getItemIndexByCode(array, code);
				array.push(array.splice(index, 1)[0]);

				return array;
			};

			self.validate = function () {
				var self = this;
				self.validationErrors([]);
				return self.validationErrors().length === 0
			}
		}

		return UploadDocuments;
	}
);