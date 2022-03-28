define(['knockout',
	'jquery',
	'./appraisalCompaniesList.vm',
	'./bankBranchList.vm',
	'./loanTermInterest.vm',
	'./loanRepaymentFormList.vm',
	'./loanPurposesList.vm',
	'./pledgeTypeList.vm',
	'./uploadDocuments.vm',
	'../models/messages.m',
	'helpers',
	'lookupDirectory',
	'../util/notificationDialog'],
	function (ko, $, AppraisalCompaniesList, BankBranchList, LoanTermInterest, LoanRepaymentFormsList, LoanPurposesList, PledgeTypes, UploadDocuments, MessagesModel, helpers, LookupDirectory, NotificationDialog) {

		AdditionalInfoDetails = function (id, preApprovalStage, navigationHelper, isEditable) {
			var self = this;

			this.id = id || preApprovalStage().id;
			this.isEditable = isEditable;
			this.validationErrors = ko.observableArray();
			this.state = ko.observable(preApprovalStage().state());
			this.isMessagesVisible = ko.observable(this.state() === 'ADDITIONAL_ATTACHMENTS_NEEDED');
			this.messages = ko.observableArray([]);
			this.editableScanTypes = ko.observableArray([]);


			// set currency AMD for this vm
			this.currencyName = 'ՀՀ դրամ';

			this.repaymentDayFrom = ko.computed(function () {
			    return preApprovalStage().loanInfo().REPAYMENT_DAY_FROM;
			});
			this.repaymentDayTo = ko.computed(function () {
			    return preApprovalStage().loanInfo().REPAYMENT_DAY_TO;
			});
			this.isOverdraft = ko.computed(function () {
			    return preApprovalStage().loanInfo().IS_OVERDRAFT;
			});

			this.isSecured = ko.computed(function () {
			    return preApprovalStage().loanInfo().IS_SECURED;
			});

			this.loanTermInterest = ko.observable(new LoanTermInterest({
                id: self.id,
                restrictValues: false,
			}, this.isEditable));

            this.uploadDocuments = ko.computed(function () {
                return new UploadDocuments({
                    id: self.id,
                    clientCode: preApprovalStage().clientCode,
                    isSecured: self.isSecured(),
                    editableScanTypes: self.editableScanTypes
                }, self.isEditable);
            });


			this.loanPaymentDay = ko.observable();
			this.monthlyEarning = ko.observable();
			this.monthlyCost = ko.observable();
			this.monthlyNetIncome = ko.observable();

			this.appraisalCompanies = ko.observable(new AppraisalCompaniesList());
			this.appraisalCompany = ko.observable();
			this.bankBranches = ko.observable(new BankBranchList());
			this.bankBranch = ko.observable();
			this.loanRepaymentForms = ko.observable(new LoanRepaymentFormsList());
			this.loanRepaymentForm = ko.observable();
			this.loanPurposes = ko.observable(new LoanPurposesList());
			this.loanPurpose = ko.observable();
			this.loanGracePeriod = ko.observable();
			this.inventory = ko.observable();
			this.debetors = ko.observable();
			this.creditors = ko.observable();
			this.pledgeTypes = ko.observable(new PledgeTypes());
			this.pledgeType = ko.observable();


			this.localInterest = ko.observable();
			this.localLoanTerm = ko.observable();


			var mapDataToServer = function () {
				var obj = {
					LOAN_TYPE_ID: preApprovalStage().loanType(),
					LOAN_TERM: self.loanTermInterest().loanTerm(),
					INTEREST: self.loanTermInterest().interest(),
					LOAN_REPAYMENT_FORM_CODE: self.loanRepaymentForm(),
					LOAN_PURPOSE_CODE: self.loanPurpose(),
					GRACE_PERIOD: self.loanGracePeriod(),
					REPAYMENT_DAY: self.loanPaymentDay(),
					INVENTORY_BALANCE: self.inventory(),
					DEBTORS_BALANCE: self.debetors(),
					CREDITORS_BALANCE: self.creditors(),
					MONTHLY_EARNING: self.monthlyEarning(),
					MONTHLY_COST: self.monthlyCost(),
					MONTHLY_NET_INCOME: self.monthlyNetIncome(),
					PLEDGE_TYPE_CODE: self.pledgeType(),
					APPRAISAL_COMPANY_CODE: self.appraisalCompany(),
					BANK_BRANCH_CODE: self.bankBranch()
				};

				if (self.id) {
					obj.ID = self.id;
				}

				return obj;
			}

			function getAllowedScanTypes (arr) {
				var allowedScan = [];
				for (var i = 0; i < arr.length; i++) {
					var scan = arr[i].SCAN_TYPE;
					if (!arr[i].IS_APPROVED && !allowedScan.includes(scan)) {
						allowedScan.push(scan);
					};
				};

				return allowedScan;
			}

			this.loadData = function (callback) {
				var self = this;
				// get manual data
				if (self.id) {

					self.loanTermInterest().loadData(function () {
						ko.computed(function () {
							self.loanTermInterest().interest(self.localInterest());
							self.loanTermInterest().loanTerm(self.localLoanTerm());
						});
					});

					self.uploadDocuments().loadData(self.id);

					$.get({
						url: "/api/loan/Applications/" + self.id + "/Manual",
						context: self,
						success: function (data) {
							if (data) {
								self.setData(data);
							}

							if (callback) {
								callback();
							}
						},
						error: function (err) {
							 helpers.errorHandler(err);
						},
						dataType: 'json'
					});

					if (this.isMessagesVisible()) {
						MessagesModel.getBankMessage(self.id)
						.then(function (data) {
							self.messages(data);
							self.editableScanTypes(getAllowedScanTypes(data));
						})
						.catch(function (error) {
							helpers.errorHandler(error)
						})
					};
				}
			}

			this.setData = function (data) {
				self.appraisalCompany(data.APPRAISAL_COMPANY_CODE);
				self.bankBranch(data.BANK_BRANCH_CODE);
				self.creditors(data.CREDITORS_BALANCE);
				self.debetors(data.DEBTORS_BALANCE);

				self.inventory(data.INVENTORY_BALANCE);
				self.loanGracePeriod(data.GRACE_PERIOD);

				self.monthlyEarning(data.MONTHLY_EARNING);
				self.monthlyCost(data.MONTHLY_COST);
				self.monthlyNetIncome(data.MONTHLY_NET_INCOME);

				self.loanRepaymentForm(data.LOAN_REPAYMENT_FORM_CODE);
				self.loanPurpose(data.LOAN_PURPOSE_CODE);
				self.loanPaymentDay(data.REPAYMENT_DAY);
				self.pledgeType(data.PLEDGE_TYPE_CODE);

				if (data.INTEREST) {
					self.localInterest(data.INTEREST);
					self.localLoanTerm(data.LOAN_TERM);
				}
			}

			this.validate = function () {
				var self = this;
				self.validationErrors([]);

				var loanTermInterestValid = self.loanTermInterest().validate(true);

				if (!self.loanRepaymentForm()) {
					self.validationErrors.push({ propertyName: 'loanRepaymentForm', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (!self.loanPurpose()) {
					self.validationErrors.push({ propertyName: 'loanPurpose', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (!self.loanPaymentDay()) {
					self.validationErrors.push({ propertyName: 'paymentDayMissing', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				} else if (self.repaymentDayFrom() && self.repaymentDayTo() &&
					((parseInt(self.loanPaymentDay()) > parseInt(self.repaymentDayTo())) || (parseInt(self.loanPaymentDay()) < parseInt(self.repaymentDayFrom())))) {
					self.validationErrors.push({ propertyName: 'paymentDayMissing', errorMessage: localization.errors["INCORRECT_REPAY_DAY"].replace('{minDay}', self.repaymentDayFrom()).replace('{maxDay}', self.repaymentDayTo()) });
				}

				if (!self.inventory()) {
					self.validationErrors.push({ propertyName: 'inventory', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (self.debetors() === null || self.debetors() === undefined) {
					self.validationErrors.push({ propertyName: 'debetors', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (self.creditors() === null || self.creditors() === undefined) {
					self.validationErrors.push({ propertyName: 'creditors', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (!self.monthlyEarning()) {
					self.validationErrors.push({ propertyName: 'monthlyEarning', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (!self.monthlyCost()) {
					self.validationErrors.push({ propertyName: 'monthlyCost', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (!self.monthlyNetIncome()) {
					self.validationErrors.push({ propertyName: 'monthlyNetIncome', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (self.isSecured() && !self.pledgeType()) {
					self.validationErrors.push({ propertyName: 'pledgeType', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (self.isSecured() && !self.appraisalCompany()) {
					self.validationErrors.push({ propertyName: 'appraisalCompany', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				if (!self.bankBranch()) {
					self.validationErrors.push({ propertyName: 'bankBranch', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
				}

				return (self.validationErrors().length === 0 && loanTermInterestValid);
			}

			this.action = function (name, callback) {
				var self = this;
				if (name == 'save') {
					self.saveData(false, callback);
				}
				else if (name == 'submit') {
					if (self.validate()) {
						self.saveData(true, callback);
					} else {
						callback();
					}
				}
			}

			this.saveData = function (isSubmit, callback) {
				var self = this;
				var obj = mapDataToServer();
				obj.IS_SUBMIT = isSubmit;
				$.post({
					url: "/api/loan/Applications/" + self.id + "/Manual",
					context: self,
					data: JSON.stringify(obj),
					success: function (id) {
						$.get({
							url: "/api/loan/Applications/" + self.id + "/Manual",
							context: self,
							success: function (data) {
								self.state(data.STATUS_STATE);
								preApprovalStage().state(data.STATUS_STATE);

								if (self.state() === 'APPROVAL_REVIEW') {
									var dialog = new NotificationDialog({
										message: localization.strings["MESSAGE.VISIT_BANK_BRANCH"],
										title: "Մոտեցեք մասնաճյուղ",
										messageClass: "visit-bank",
										visibleButton: "false",
										back: function () { navigationHelper.navigateToApplicationList(); }
									});
									dialog.show();
								} else if (self.state() === 'PRE_APPROVAL_SUBMITTED'){
									self.isMessagesVisible(false);
									self.messages([]);
									self.editableScanTypes([]);

									var dialog = new NotificationDialog({
										message: localization.strings["MESSAGE.ACCEPTED.LOAN"],
										title: "Հայտն ընդունված է",
										messageClass: "dialogNotify",
										visibleButton: "false",
										back: function () { navigationHelper.navigateToApplicationList(); }
									});
									dialog.show();
								}
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
                    },
				});

				if (this.isMessagesVisible()) {
					MessagesModel.addMessage(self.id, JSON.stringify({}))
					.then(function () {})
					.catch(function (error) {
						helpers.errorHandler(error)
					});
				};
			}

			this.scrollToScanType = function (view, event) {
				event.preventDefault()
				var scanSection = $('#scanType' + view.SCAN_TYPE);
				if (scanSection.length) {
					$("html, body").animate({
					    scrollTop: scanSection.offset().top - 68
					}, 100);
				};
			}
		}

		return AdditionalInfoDetails;
	}
);
