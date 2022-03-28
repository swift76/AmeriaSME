define(['knockout', 'jquery', './collectionWrapperList.vm', 'helpers'],
	function (ko, $, CollectionWrapperList, helpers) {
		LoanTermInterest = function (params, isEditable) {
			var self = this;
            this.id = params.id;
            this.restrictValues = params.restrictValues;//Show values in combo instead of numeric textbox
			this.validationErrors = ko.observableArray();
			this.isEditable = isEditable;
			this.loanPaymentPeriods = ko.observable(new CollectionWrapperList([]));
			this.loanTerm = ko.observable();
			this.interest = ko.observable();
			this.scoringResult = null;
			this.generalScoringResults = ko.observable();
			this.interestDisabled = params.interestDisabled;
			this.termsDisabled = params.termsDisabled;

            if (self.restrictValues)
            {
                var subscription = this.interest.subscribe(function (newValue) {
                    if (self.generalScoringResults()) {
                        var scoringResults = self.generalScoringResults();

                        for (var i = 0; i < scoringResults.length; i++) {
                            if (scoringResults[i]["INTEREST"] === newValue) {
                                self.scoringResult = scoringResults[i];
                            }
                        }
                        if (self.scoringResult) {
                            self.loanPaymentPeriods(new CollectionWrapperList(getLoanPaymentPeriods(self.scoringResult)));
                        }
                    }
                });
            }

            this.getConditionByInterest = function (interest) {
                var interests = self.generalScoringResults();
                for (var i = 0; i < interests.length; i++) {
                    if (interests[i].INTEREST == interest) {
                        return interests[i];
                    }
                }
                return null;
            }

            this.interests = ko.computed({
                read: function () {
                    if (!self.generalScoringResults()) {
                        return new CollectionWrapperList([{}]);
                    }
                    var entities = self.generalScoringResults().map(function (item) {
                        return {
                            CODE: item.INTEREST,
                            NAME: item.INTEREST
                        };
                    });
                    return new CollectionWrapperList(entities);
                },
                deferEvaluation: true
            }, this);

            var getLoanPaymentPeriods = function (interest) {
                // var self = this;
                var options = [];
                if (!interest) {
                    options.push({ CODE: '', NAME: '' });
                } else {
                    var start = interest.TERM_FROM;
                    while (start <= interest.TERM_TO) {
                        options.push({ CODE: start, NAME: start + " ամիս" });
                        start += 6;
                    }
                }

                return options;
            }

			this.loadData = function (callback) {
				var self = this;
				if (self.id) {
					$.get({
						url: "/api/loan/Applications/" + self.id + "/ScoringResults",
						context: self,
						success: function (data) {
							if (data) {
								self.generalScoringResults(data);
							}
							if (callback) {
								callback(data);
							}
						},
						error: function (err) {
						    if (callback) {
						        helpers.errorHandler(err);
						        callback(err);
						    }
						},
						dataType: 'json'
					});
				}
			}

			this.validate = function (isRequired) {
				var self = this;
				self.validationErrors([]);

				if (isRequired && !self.interest()) {
					self.validationErrors.push({ propertyName: 'selectedInterest', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (isRequired && !self.loanTerm() && self.loanTerm() != 0) {
					self.validationErrors.push({ propertyName: 'selectedPaymentPeriod', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				return self.validationErrors().length === 0
			}
		}

		return LoanTermInterest;
	});