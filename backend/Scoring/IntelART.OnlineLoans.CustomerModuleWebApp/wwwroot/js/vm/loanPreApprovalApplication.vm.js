define(['knockout',
        'jquery',
        'helpers',
        './activitiesList.vm',
        './loanTypeList.vm',
        './factualIndustriesList.vm',
        './currenciesList.vm',
        './loanAmountLimits.vm',
        '../util/notificationDialog',
        './addressDetails.vm',
        '../models/companyInfo.m',
        '../models/loanSettings.m'
        ], function (ko, $, helpers, ActivitiesList, LoanTypeList, FactualIndustriesList, CurrenciesList, LoanAmountLimits, NotificationDialog, AddressDetails, CompanyInfoModel, LoanSettings) {

    LoanPreApprovalApplication = function (id, navigationHelper, isEditable) {
        var self = this;
        var autoScoringWaitingMinutes = 3;
        var autoScoringWaitTimeout = autoScoringWaitingMinutes * 60 * 1000;
        var scoringPollingInterval = 1000;

        self.id = id;
        self.isEditable = isEditable;
        self.userProfile = new UserProfile(self.isEditable);
        self.validationErrors = ko.observableArray();
        self.loanType = ko.observable();
        self.currency = ko.observable();
        self.taxId = ko.observable();
        self.annualTurnover = ko.observable();
        self.facebookUrl = ko.observable();
        self.websiteUrl = ko.observable();
        self.companyEmail = ko.observable();
        self.companyName = ko.observable();
        self.socialCardNumber = ko.observable();
        self.countryCode = ko.observable();
        self.amount = ko.observable();
        self.state = ko.observable();
        self.clientCode = "";
        self.isDataComplete = false;
        self.loanInfo = ko.observable({});
        self.loanSettings = ko.observable({});
        self.getLoanInfo = ko.computed(function () {
            if (!self.loanType()) return;
            (new LookupDirectory()).getLoanParameters(self.loanType(), function (parameters) {
                self.loanInfo(parameters);
            });
            return self.loanInfo();
        });
        self.amountLimits = ko.pureComputed(
            function () {
                var limits = new LoanAmountLimits(self.loanType(), self.currency());
                limits.loadData();
                return limits;
            }
        );
        self.loanTypes = ko.observable(new LoanTypeList());
        self.loanTypeHint = new helpers.computValueFromArray(self.loanTypes, self.loanType, 'DESCRIPTION');
        self.factualIndustries = ko.observable(new FactualIndustriesList());
        self.factualIndustry = ko.observable();
        self.activities = ko.observable(new ActivitiesList());
        self.activity = ko.observable();
        self.currencies = ko.pureComputed(
            function () {
                return new CurrenciesList(self.loanType());
            }
        );
        self.agreedToTerms = ko.observable(false);
        self.actualAddressesIsSame = ko.observable(false);
        self.actualAddresses = ko.observable(new AddressDetails(null, null, null, null, null, null, self.isEditable));
        self.personalAddressesIsSame = ko.observable(false);
        self.personalAddresses = ko.observable(new AddressDetails(null, null, null, null, null, null, self.isEditable));

        self.isActualAddressEditable = ko.observable(true);
        self.isPersonalAddressEditable = ko.observable(true);

        self.checkActualAddressEditable = ko.computed(function () {
            self.isActualAddressEditable(!self.actualAddressesIsSame() && self.isEditable());
            return self.isActualAddressEditable()
        });
        self.checkPersonalAddressEditable = ko.computed(function () {
            self.isPersonalAddressEditable(!self.personalAddressesIsSame() && self.isEditable());
            return self.isPersonalAddressEditable()
        });
        self.removeActualAddresses = ko.computed(function () {
            if (self.actualAddressesIsSame()) {
                self.actualAddresses().countryCode(null);
                self.actualAddresses().stateCode(null);
                self.actualAddresses().cityCode(null);
                self.actualAddresses().streetName(null);
                self.actualAddresses().buildingNumber(null);
                self.actualAddresses().apartmentNumber(null);
            }
            return self.actualAddresses();
        });
        self.removePersonalAddresses = ko.computed(function () {
            if (self.personalAddressesIsSame()) {
                self.personalAddresses().countryCode(null);
                self.personalAddresses().stateCode(null);
                self.personalAddresses().cityCode(null);
                self.personalAddresses().streetName(null);
                self.personalAddresses().buildingNumber(null);
                self.personalAddresses().apartmentNumber(null);
            }
            return self.personalAddresses();
        });

        var preprarePreapprovalApplicationObject = function () {
            var obj = {
                ACTIVITY_CODE: self.activity(),
                LOAN_TYPE_ID: self.loanType(),
                INITIAL_AMOUNT: self.amount(),
                CURRENCY_CODE: self.currency(),
                ANNUAL_TURNOVER: self.annualTurnover(),
                FACEBOOK: self.facebookUrl(),
                WEBSITE: self.websiteUrl(),
                COMPANY_EMAIL: self.companyEmail(),
                COMPANY_NAME: self.companyName(),
                FIRST_NAME_EN: self.userProfile.nameEn(),
                LAST_NAME_EN: self.userProfile.lastNameEn(),
                SOCIAL_CARD_NUMBER: self.socialCardNumber(),
                FACTUAL_INDUSTRY_CODE: self.factualIndustry(),
                IS_CURRENT_ADDRESS_SAME: self.actualAddressesIsSame(),
                CURRENT_COUNTRY_CODE: self.actualAddresses().countryCode(),
                CURRENT_STATE_CODE: self.actualAddresses().stateCode(),
                CURRENT_CITY_CODE: self.actualAddresses().cityCode(),
                CURRENT_STREET: self.actualAddresses().streetName(),
                CURRENT_BUILDNUM: self.actualAddresses().buildingNumber(),
                CURRENT_APARTMENT: self.actualAddresses().apartmentNumber(),
                IS_INDIVIDUAL_ADDRESS_SAME: self.personalAddressesIsSame(),
                INDIVIDUAL_COUNTRY_CODE: self.personalAddresses().countryCode(),
                INDIVIDUAL_STATE_CODE: self.personalAddresses().stateCode(),
                INDIVIDUAL_CITY_CODE: self.personalAddresses().cityCode(),
                INDIVIDUAL_STREET: self.personalAddresses().streetName(),
                INDIVIDUAL_BUILDNUM: self.personalAddresses().buildingNumber(),
                INDIVIDUAL_APARTMENT: self.personalAddresses().apartmentNumber(),
                AGREED_WITH_TERMS: self.agreedToTerms()
            };

            if (self.id) {
                obj.ID = self.id;
            }

            return obj;
        }

        var polledState = null;

        var waitNotificationConfirm = function () {
            if (polledState) {
                self.state(polledState);
            }
        }

        var checkApplicationStatusState = function (data) {
            var hasResult = false;
            var dialog = null;
            var timeout = 0;

            if(data.STATUS_STATE == "PENDING_PRE_APPROVAL") {
                dialog = new NotificationDialog({
                    message: localization.statusMessages[data.STATUS_STATE],
                    title: "Կատարվում է հարցում",
                    confirm: waitNotificationConfirm,
                    back: function () {
                        timeout = 2 * autoScoringWaitTimeout;
                        navigationHelper.navigateToApplicationList();
                    }
                });
                dialog.show();
            }

            var checkStatusState = function (data) {
                var statusState = data.STATUS_STATE;
                polledState = statusState;

                if (dialog) {
                    if (statusState == "PENDING_PRE_APPROVAL") {
                        timeout += scoringPollingInterval;
                        setTimeout(function () {
                            $.get({
                                url: "/api/loan/Applications/" + data.ID,
                                context: self,
                                success: function (data) {
                                    if (data) {
                                        if (timeout > autoScoringWaitTimeout) {
                                            dialog.setButtonVisible("false");
                                            dialog.setTitle(localization.statusMessages.TITLE);
                                            dialog.setMessage(localization.statusMessages.DELAY);
                                        } else if (!hasResult) {
                                            checkStatusState(data);
                                        }
                                    }
                                },
                                dataType: 'json'
                            })
                        }, scoringPollingInterval);
                    } else {
                        hasResult = true;

                        getModalMessages(statusState).then(function (data) {
                            dialog.setButtonVisible(data.visibleBtn);
                            dialog.setTitle(data.title);
                            dialog.setMessage(data.message);
                            dialog.setMessageClass('dialogNotify');
                            data.notifyComplete && dialog.notifyComplete();
                            data.setState && self.state(statusState);
                        });
                    }
                }
            }

            checkStatusState(data);
        }


        function getModalMessages (status) {
            var obj = {
                visibleBtn: "false",
                notifyComplete: false,
                setState: false,
                message: localization.statusMessages[status],
                title: localization.statusMessages.TITLE
            }
            switch(status) {
                case 'PRE_APPROVAL_SUCCESS':
                    obj.visibleBtn = "true";
                    obj.notifyComplete = true;
                    return CompanyInfoModel.getCompanyMultipleOwners(self.id).then(function (hasMultipleOwners) {
                        var text = hasMultipleOwners ? 'կանխահաստատվել' : 'հաստատվել';
                        obj.title = localization.statusMessages.APPROVAL_TITLE.replace('{X}', text);
                        obj.message = localization.statusMessages[status].replace('{X}', text);
                        return obj;
                    });
                case 'PRE_APPROVAL_REVIEW_ADDITIONAL_DATA':
                    obj.visibleBtn = "true";
                    obj.notifyComplete = true;
                    obj.title = localization.statusMessages.ADDITIONAL_TITLE;
                    return Promise.resolve(obj);
                case 'PRE_APPROVAL_FAIL':
                    obj.message = data.REFUSAL_REASON;
                    obj.title = localization.statusMessages.REFUSAL_TITLE;
                    obj.notifyComplete = true;
                    obj.setState = true;
                    return Promise.resolve(obj);
                case "PRE_APPROVAL_REVIEW_CORPORATE":
                    obj.message = localization.statusMessages[status].replace('{X}', self.loanSettings().CONTACT_DAY_COUNT)
                    obj.notifyComplete = true;
                    obj.setState = true;
                    obj.title = localization.statusMessages.CORPOEATE_TITLE;
                    return Promise.resolve(obj);
            }
           return Promise.resolve(obj);
        }

        this.loadData = function (callback) {
            var self = this;

            // get loan settings
            self.getLoanSettings();

            if (self.id) {
                $.get({
                    url: "/api/loan/Applications/" + self.id,
                    context: self,
                    success: function (data) {
                        if (data) {
                            self.activity(data.ACTIVITY_CODE);
                            self.loanType(data.LOAN_TYPE_ID);
                            self.amount(data.INITIAL_AMOUNT);
                            self.currency(data.CURRENCY_CODE);
                            self.taxId(data.TAX_ID_NUMBER);
                            self.state(data.STATUS_STATE);
                            self.annualTurnover(data.ANNUAL_TURNOVER);
                            self.facebookUrl(data.FACEBOOK);
                            self.websiteUrl(data.WEBSITE);
                            self.companyName(data.COMPANY_NAME);
                            self.userProfile.nameEn(data.FIRST_NAME_EN);
                            self.userProfile.lastNameEn(data.LAST_NAME_EN);
                            self.socialCardNumber(data.SOCIAL_CARD_NUMBER);
                            self.factualIndustry(data.FACTUAL_INDUSTRY_CODE);
                            self.agreedToTerms(data.AGREED_WITH_TERMS);
                            self.companyEmail(data.COMPANY_EMAIL);

                            self.actualAddressesIsSame(data.IS_CURRENT_ADDRESS_SAME);
                            self.personalAddressesIsSame(data.IS_INDIVIDUAL_ADDRESS_SAME);


                            self.actualAddresses(
                                new AddressDetails(
                                    data.CURRENT_COUNTRY_CODE,
                                    data.CURRENT_STATE_CODE,
                                    data.CURRENT_CITY_CODE,
                                    data.CURRENT_STREET,
                                    data.CURRENT_BUILDNUM,
                                    data.CURRENT_APARTMENT,
                                    self.isActualAddressEditable
                                )
                            );

                            self.personalAddresses(
                                new AddressDetails(
                                    data.INDIVIDUAL_COUNTRY_CODE,
                                    data.INDIVIDUAL_STATE_CODE,
                                    data.INDIVIDUAL_CITY_CODE,
                                    data.INDIVIDUAL_STREET,
                                    data.INDIVIDUAL_BUILDNUM,
                                    data.INDIVIDUAL_APARTMENT,
                                    self.isPersonalAddressEditable
                                )
                            );
                            checkApplicationStatusState(data);
                            self.clientCode = (data.CLIENT_CODE || '').trim();
                            self.isDataComplete = data.IS_DATA_COMPLETE;
                        }
                        if (callback) {
                            callback();
                        }
                    },
                    dataType: 'json'
                });
            } else {
                var self = this;
                var profile = self.userProfile;
                profile.loadData(function () {
                    if (callback) {
                        self.taxId(profile.taxId());
                        self.companyName(profile.companyName());
                        self.companyEmail(profile.email());
                        self.annualTurnover(profile.annualTurnover());
                        self.activity(profile.activity());
                        self.factualIndustry(profile.factualIndustry());
                        self.facebookUrl(profile.facebookUrl());
                        self.websiteUrl(profile.websiteUrl());
                        self.socialCardNumber(profile.ssn());
                        self.actualAddressesIsSame(profile.actualAddressIsSame());
                        self.personalAddressesIsSame(profile.individualAddressIsSame());

                        self.actualAddresses(
                            new AddressDetails(
                                profile.actualAddress().countryCode(),
                                profile.actualAddress().stateCode(),
                                profile.actualAddress().cityCode(),
                                profile.actualAddress().streetName(),
                                profile.actualAddress().buildingNumber(),
                                profile.actualAddress().apartmentNumber(),
                                self.isActualAddressEditable
                            )
                        );

                        self.personalAddresses(
                            new AddressDetails(
                                profile.individualAddress().countryCode(),
                                profile.individualAddress().stateCode(),
                                profile.individualAddress().cityCode(),
                                profile.individualAddress().streetName(),
                                profile.individualAddress().buildingNumber(),
                                profile.individualAddress().apartmentNumber(),
                                self.isPersonalAddressEditable
                            )
                        );
                        callback();
                    }
                });
            }
        }

        this.getLoanSettings = function () {
            LoanSettings.getLoanSettings()
                .then(function (data) {self.loanSettings(data)})
                .catch(function (err) {
                    console.error(err)
                });
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

        this.validate = function () {
            var self = this;
            self.validationErrors([]);
            var actualAddressesValid = self.actualAddresses().validate(!self.actualAddressesIsSame());
            var personalAddressesValid = self.personalAddresses().validate(!self.personalAddressesIsSame());

            if (!self.loanType()) {
                self.validationErrors.push({ propertyName: 'loanType', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.currency()) {
                self.validationErrors.push({ propertyName: 'currency', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.amount()) {
                self.validationErrors.push({ propertyName: 'amount', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            } else if (!helpers.isValidNumber(self.amount())) {
                self.validationErrors.push({ propertyName: 'amount', errorMessage: localization.errors["NUMBER_FORMAT_ERROR"] });
            } else if (parseInt(self.amount()) > parseInt(this.amountLimits().max())) {
                self.validationErrors.push({ propertyName: 'amount', errorMessage: localization.errors["NUMBER_MAX_EXCEEDS_ERROR"] + this.amountLimits().max().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")});
            } else if (parseInt(self.amount()) < parseInt(this.amountLimits().min())) {
                self.validationErrors.push({ propertyName: 'amount', errorMessage: localization.errors["NUMBER_MIN_EXCEEDS_ERROR"] + this.amountLimits().min().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")});
            }

            if (!self.annualTurnover() || Number(self.annualTurnover()) <= 0) {
                self.validationErrors.push({ propertyName: 'annualTurnover', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (self.websiteUrl() && !helpers.isValidUrlAddress(self.websiteUrl())) {
                self.validationErrors.push({ propertyName: 'websiteUrl', errorMessage: localization.errors["URL_FORMAT_ERROR"] });
            }

            if (self.companyEmail() && !helpers.isValidEmailAddress(self.companyEmail())) {
                self.validationErrors.push({ propertyName: 'companyEmail', errorMessage: localization.errors["EMAIL_FORMAT_ERROR"] });
            }

            if (!self.socialCardNumber()) {
                self.validationErrors.push({ propertyName: 'socialCardNumber', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            } else if (self.socialCardNumber().length < 10) {
                self.validationErrors.push({ propertyName: 'socialCardNumber', errorMessage: localization.errors["SOCIAL_CARD_NUMBER_FORMAT_ERROR"] });
            }

            if (!self.userProfile.nameEn()) {
                self.userProfile.validationErrors.push({ propertyName: 'nameEn', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.userProfile.lastNameEn()) {
                self.userProfile.validationErrors.push({ propertyName: 'lastNameEn', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.companyName()) {
                self.validationErrors.push({ propertyName: 'companyName', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.factualIndustry()) {
                self.validationErrors.push({ propertyName: 'factualIndustry', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.activity()) {
                self.validationErrors.push({ propertyName: 'activity', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            return (self.validationErrors().length === 0
                && actualAddressesValid
                && personalAddressesValid);
        }

        this.saveData = function (isSubmit, callback) {
            var self = this;
            obj = preprarePreapprovalApplicationObject();
            obj.IS_SUBMIT = isSubmit;
            $.post({
                url: "/api/loan/Applications",
                context: self,
                data: JSON.stringify(obj),
                success: function (id) {

                    if (id) {
                        self.id = id;
                    }

                    $.get({
                        url: "/api/loan/Applications/"+ id,
                        context: self,
                        success: function (data) {
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
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    if (callback) {
                        callback(err);
                    }
                    if (err.ErrorCode == "ERR-0200") {
                        dialog = new NotificationDialog({
                            message: "Նշված համակարգով 8 օրվա ընթացքում հնարավոր է դիմել վարկի միայն 1 անգամ։ Խնդրում ենք վարկային հայտը ուղարկել 8 օր անց։ Շնորհակալություն «Ամերիաբանկ» ՓԲԸ-ի ծառայություններից օգտվելու համար։",
                            title: localization.statusMessages.NOT_ACCEPTED_TITLE,
                            messageClass: 'dialogNotify',
                            visibleButton: "false",
                            back: function () { navigationHelper.navigateToApplicationList(); },
                            close: function () { navigationHelper.navigateToApplicationList(); }
                        });
                        dialog.show();
                    } else if (err.ErrorCode == "ERR-0201") {
                        dialog = new NotificationDialog({
                            message: "Բանկի աշխատակիցներին արգելվում է օգտվել առցանց վարկավորման համակարգերից:",
                            title: "Կատարվել է հարցում",
                            messageClass: 'dialogNotify',
                            visibleButton: "false",
                            back: function () { navigationHelper.navigateToApplicationList(); },
                            close: function () { navigationHelper.navigateToApplicationList(); }
                        });
                        dialog.show();
                    }
                },
                dataType: 'json'
            });
        }
    }

    return LoanPreApprovalApplication;
});
