define(['knockout',
        'jquery',
        './loanTermInterest.vm',
        './cancellationReasonList.vm',
        '../models/refinancingLoan.m',
        '../models/companyInfo.m',
        'helpers',
        'lookupDirectory',
         '../util/notificationDialog'],
    function (ko, $, LoanTermInterest, CancellationReasons, RefinancingLoanModel, CompanyModel, helpers, LookupDirectory, NotificationDialog) {
    LoanMainApplication = function (id, preApprovalStage, navigationHelper, isEditable) {
        var self = this;
        this.id = id || preApprovalStage().id;
        this.validationErrors = ko.observableArray();
        this.isEditable = isEditable;
        this.state = ko.observable();

        this.loanType = ko.observable(preApprovalStage().loanType());
        this.clientCode = ko.observable(preApprovalStage().clientCode);
        this.isDataComplete = ko.observable(preApprovalStage().isDataComplete);
        this.currency = ko.observable();
        this.currencies = ko.observable(preApprovalStage().currencies());

        this.cancellationReason = ko.observable();
        this.disableCurrency = ko.observable(true);


        this.agreedToTerms = ko.observable(false);
        this.loanPaymentDay = ko.observable();
        this.repaymentDayFrom = ko.computed(function () {
            return preApprovalStage().loanInfo().REPAYMENT_DAY_FROM;
        });
        this.repaymentDayTo = ko.computed(function () {
            return preApprovalStage().loanInfo().REPAYMENT_DAY_TO;
        });
        this.isOverdraft = ko.computed(function () {
            return preApprovalStage().loanInfo().IS_OVERDRAFT;
        });

        this.setTermDisabled = ko.observable(false);

        this.loanTermInterest = ko.observable(new LoanTermInterest({
            id: self.id,
            restrictValues: true,
            interestDisabled: ko.observable(true),
            termsDisabled: self.setTermDisabled
        }, self.isEditable));


        this.oneLoanPaymentPeriod = ko.computed(function () {
            var paymentsPeriod = self.loanTermInterest().loanPaymentPeriods();
            if (paymentsPeriod  && paymentsPeriod.entities) {
                self.setTermDisabled(paymentsPeriod.entities.length === 1);
            };
            return self.setTermDisabled()
        });

        this.loansInOtherBanks = ko.observableArray([]);
        this.approvedAmount1 = ko.observable();
        this.approvedAmount2 = ko.observable();
        this.refinancingAmount = ko.observable();
        this.suggestedLoanRadio = ko.observable();
        this.IsRefinancing = ko.computed(function () {
            return self.suggestedLoanRadio() === 'B';
        });

        this.IsRefinancingTableVisible = ko.computed(function () {
            if (!self.IsRefinancing()) return false;
            RefinancingLoanModel.getRefinancingLoan(self.id).then(function (data) {
               self.loansInOtherBanks(data);
            });
            return self.IsRefinancing();
        });

        this.finalAmount = ko.computed (function () {
            if (!self.suggestedLoanRadio()) return;
            if (self.suggestedLoanRadio() === 'B') {
                return self.approvedAmount2();
            }
            return self.approvedAmount1()
        });

        this.localInterest = ko.observable();
        this.localLoanTerm = ko.observable();

        var buildLoanMainApplication = function (data) {
            if (data) {
                self.state(data.STATUS_STATE);
                if (data.INTEREST) {
                    self.localInterest(data.INTEREST)
                    self.localLoanTerm(data.LOAN_TERM)
                }
                self.loanPaymentDay(data.REPAYMENT_DAY);
                self.currency(data.CURRENCY_CODE);
            }
        }

        var checkApplicationStatusState = function (data) {
            var dialog;
            if (data.STATUS_STATE === 'APPROVAL_REVIEW') {
                $.get({
                    url: "/api/loan/Applications/" + self.id,
                    context: self,
                    success: function (data) {
                        if (data) {
                            var dialog = new NotificationDialog({
                                // message: localization.strings['MESSAGE.VISIT_BANK_BRANCH'],
                                message: data.IDENTIFICATION_REASON,
                                title: "Մոտեցեք մասնաճյուղ",
                                messageClass: 'dialogNotify',
                                visibleButton: "false",
                                back: function () { navigationHelper.navigateToApplicationList(); }
                            });
                            dialog.show();
                        }
                    },
                    error: function (err) {
                        helpers.errorHandler(err);
                    },
                    dataType: 'json'
                })
            }
        }

        this.loadData = function (callback) {
            var self = this;

            if (self.id) {
                $.get({
                    url: "/api/loan/Applications/" + self.id + "/Main",
                    context: self,
                    success: function (data) {
                        buildLoanMainApplication(data);
                        if (callback) {
                            callback(false);
                        }
                    },
                    error: function (err) {
                        helpers.errorHandler(err);
                    },
                    dataType: 'json'
                });

                self.loanTermInterest().loadData(function (data) {
                    var termInterests = self.loanTermInterest();
                    ko.computed(function () {
                        termInterests.interest(self.localInterest());
                        termInterests.loanTerm(self.localLoanTerm());
                    });

                    if (data && data.length) {
                        self.approvedAmount1(data[0].APPROVED_AMOUNT_1);
                        self.approvedAmount2(data[0].APPROVED_AMOUNT_2);
                        self.refinancingAmount(data[0].REFINANCING_AMOUNT);

                        if (!self.approvedAmount2()) {
                            self.suggestedLoanRadio('A')
                        }

                        if (!self.approvedAmount1()) {
                            self.suggestedLoanRadio('B');
                        }
                    }
                });
            }
        }

        var prepareMainApplicationObject = function () {
            var termInterests = self.loanTermInterest();
            var interest = termInterests.getConditionByInterest(termInterests.interest());
            var obj = {
                FINAL_AMOUNT: self.finalAmount(),
                INTEREST: termInterests.interest(),
                LOAN_TERM: termInterests.loanTerm(),
                REPAYMENT_DAY: self.loanPaymentDay(),
                LOAN_TYPE_ID: self.loanType(),
                IS_REFINANCING: self.IsRefinancing()
            };

            if (self.isOverdraft()) {
                obj.OVERDRAFT_TEMPLATE_CODE = interest.TEMPLATE_CODE;
            } else {
                obj.LOAN_TEMPLATE_CODE = interest.TEMPLATE_CODE;
            }

            if (self.id) {
                obj.ID = self.id;
            }

            return obj;
        }

        this.action = function (name, callback) {
            var self = this;
            if (name == 'continue') {
                if (self.validate()) {
                    self.saveData(true, callback);
                } else {
                    callback();
                }
            } else if (name == 'cancel') {
                self.cancelApplication(callback)
            }
        }

        this.saveData = function (isSubmiting, callback) {
            var self = this;

            obj = prepareMainApplicationObject();
            obj.IS_SUBMIT = isSubmiting;

            $.post({
                url: "/api/loan/Applications/" + self.id + "/Main",
                context: self,
                data: JSON.stringify(obj),
                success: function (data) {
                    $.get({
                        url: "/api/loan/Applications/" + self.id + "/Main",
                        context: self,
                        success: function (data) {
                            preApprovalStage().state(data.STATUS_STATE);
                            checkApplicationStatusState(data);
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
                    helpers.errorHandler(err);
                    if (callback) {
                        callback(err);
                    }
                }
            });

            if (self.IsRefinancing()) {
                $.post({
                    url: "/api/loan/RefinancingLoan/" + self.id,
                    context: self,
                    data: JSON.stringify(self.loansInOtherBanks()),
                    error: function (err) {
                        helpers.errorHandler(err);
                    }
                });
            }
        }

        this.cancelApplication = function (callback) {
            var cancelReasonId = {
                CANCELLATION_REASON_CODE: self.cancellationReason()
            }
            $.ajax({
                type: 'PUT',
                url: "/api/loan/Applications/Cancelled/" + self.id,
                context: self,
                data: JSON.stringify(cancelReasonId),
                dataType: 'json',
                error: function (err) {
                    helpers.errorHandler(err);
                    if (callback) {
                        callback(err);
                    }
                },
                complete: function (data) {
                    if (data.status === 200) {
                        navigationHelper.navigateToApplicationList();
                    }
                }
            });
        }

        this.validate = function () {
            var self = this;
            self.validationErrors([]);
            var loanTermInterestValid = self.loanTermInterest().validate(true);

            if (!self.currency()) {
                self.validationErrors.push({ propertyName: 'currency', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.loanPaymentDay()) {
                self.validationErrors.push({ propertyName: 'paymentDayMissing', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            } else if (self.repaymentDayFrom() && self.repaymentDayTo() &&
                ((parseInt(self.loanPaymentDay()) > parseInt(self.repaymentDayTo())) || (parseInt(self.loanPaymentDay()) < parseInt(self.repaymentDayFrom())))) {
                self.validationErrors.push({ propertyName: 'paymentDayMissing', errorMessage: localization.errors["INCORRECT_REPAY_DAY"].replace('{minDay}', self.repaymentDayFrom()).replace('{maxDay}', self.repaymentDayTo()) });
            }

            if (self.IsRefinancing()) {
                for (var i = 0; i < self.loansInOtherBanks().length; i++) {
                    var loans = self.loansInOtherBanks()[i];
                    if (!loans.LOAN_CODE) {
                        self.validationErrors.push({ propertyName: loans.ROW_ID + '_loanCode', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
                    } else if (loans.LOAN_CODE.length != 16) {
                        self.validationErrors.push({ propertyName: loans.ROW_ID + '_loanCode', errorMessage: localization.errors["LOAN_CODE_LENGTH_ERROR"] });
                    } else if (!helpers.isValidLoanCode(loans.LOAN_CODE)) {
                        self.validationErrors.push({ propertyName: loans.ROW_ID + '_loanCode', errorMessage: localization.errors["LOAN_CODE_FORMAT_ERROR"] });
                    }
                }
            }

            return (self.validationErrors().length === 0 && loanTermInterestValid)
        }

        this.showCancelModal = function () {
            helpers.confirmCancelModal(self.cancellationReason, CancellationReasons, function () {
                self.action('cancel')
            });
        }
    }

    return LoanMainApplication;
});

