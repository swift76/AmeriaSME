define(['knockout', 'jquery', './yearMonthList.vm', '../models/ekengAuth.m', 'helpers'],

    function (ko, $, YearMonthList, EkengAuth, helpers) {

		CardIdentification = function(id, preApprovalStage, reloadApplicationMetadata, isEditable) {
			var self = this;
			this.isEditable = isEditable;

			this.id = id || preApprovalStage().id;
			this.validationErrors = ko.observableArray();
			this.state = ko.observable();
			//this.isAuthorized = ko.observable(false);

            this.loadData = function (callback) {

                if (!helpers.browserIsChrome()) {
                    var errorMessage = localization.errors["ID_CARD_SUPPORTED_ONLY_IN_CHROME"];
                    self.validationErrors.push({ propertyName: 'cardGroup', errorMessage: errorMessage });
                    // self.isEditable(false);
                }

				if (callback) {
					callback();
				}
			}

            this.action = function (name, callback) {
				var self = this;
				self.getUserEkengToken(callback);
			}

			this.validate = function() {
				var self = this;
				self.validationErrors([]);

				return (self.validationErrors().length === 0);
            }

            this.submitUserData = function (userData, callback) {
                $.post({
                    url: "/api/loan/Applications/" + self.id + "/IdCard",
                    context: self,
                    data: JSON.stringify({ 'EncryptedData': userData }),
                    success: function (data) {
                        $.get({
                            url: "/api/loan/Applications/" + self.id,
                            context: self,
                            success: function (data) {
                                preApprovalStage().state(data.STATUS_STATE);
                            },
                            error: function (err) {
                                helpers.errorHandler(err);
                                if (callback) {
                                    callback(err);
                                }
                            },
                            dataType: 'json'
                        });

                        if (callback) {
                            callback();
                        }
                    },
                    error: function (err) {
                        self.handleEkengError(err);
                        if (callback) {
                            callback(err);
                        }
                    },
                });
            }

            this.getUserEkengToken = function (callback) {
                var self = this;
                if (!self.validate()) {
                    if (callback) {
                        callback();
                    }
                    return;
                }

                EkengAuth.authorizeUser()
                    .then(function (result) {
                        if (result.status == 'OK') {
                            self.submitUserData(result.data, callback);
                        } else {
                            self.handleEkengError();
                            if (callback) {
                                callback();
                            }
                        }
                    })
                    .catch(function (error) {
                        self.handleEkengError();
                        if (callback) {
                            callback();
                        }
                    });
            }

			this.handleEkengError = function (error) {
                var errorMessage = localization.errors["CARD_NUMBER_FORMAT_ERROR"];
                if (error && error.responseJSON.Message) {
                    errorMessage = error.responseJSON.Message;
                }
				self.validationErrors.push({ propertyName: 'cardGroup', errorMessage: errorMessage });
            }
		}

		return CardIdentification;
	});