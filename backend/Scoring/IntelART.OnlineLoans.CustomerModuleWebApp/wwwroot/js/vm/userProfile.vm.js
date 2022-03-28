define(['knockout', 'jquery', './addressDetails.vm', 'helpers'],
    function (ko, $, AddressDetails, helpers) {
    UserProfile = function (isEditable) {
        this.validationErrors = ko.observableArray();
        this.annualTurnover = ko.observable();
        this.nameEn = ko.observable();
        this.lastNameEn = ko.observable();
        this.taxId = ko.observable();
        this.companyName = ko.observable();
        this.facebookUrl = ko.observable();
        this.websiteUrl = ko.observable();
        this.cellphone = ko.observable();
        this.phone = ko.observable();
        this.email = ko.observable();
        this.activity = ko.observable();
        this.factualIndustry = ko.observable();
        this.ssn = ko.observable();
        this.individualAddressIsSame = ko.observable(false);
        this.individualAddress = ko.observable();
        this.actualAddressIsSame = ko.observable(false);
        this.actualAddress = ko.observable();
        this.showMobilePhone = ko.observable(true);
        this.showEmail = ko.observable(true);

        if (isEditable) {
            this.isEditable = isEditable;
        }
        else {
            this.isEditable = ko.observable(true);
        }

        this.validate = function () {
            var self = this;
            self.validationErrors([]);

            if (!self.nameEn() || self.nameEn().trim() == "") {
                self.validationErrors.push({ propertyName: 'nameEn', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.lastNameEn() || self.lastNameEn().trim() == "") {
                self.validationErrors.push({ propertyName: 'lastNameEn', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            if (!self.email() || self.email().trim() == "") {
                self.validationErrors.push({ propertyName: 'email', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            } else if (!helpers.isValidEmailAddress(self.email())) {
                self.validationErrors.push({ propertyName: 'email', errorMessage: localization.errors["EMAIL_FORMAT_ERROR"] });
            }

            return (self.validationErrors().length === 0);
        }
    }

    UserProfile.prototype.loadData = function (callback) {
        var self = this;
        $.ajax({
            type: 'GET',
            url: "/api/customer/Profile",
            context: self,
            success: function (data) {
                self.annualTurnover(data.ANNUAL_TURNOVER);
                self.nameEn(data.FIRST_NAME_EN);
                self.lastNameEn(data.LAST_NAME_EN);
                self.cellphone(data.MOBILE_PHONE);
                self.email(data.EMAIL);
                self.activity(data.ACTIVITY_CODE);
                self.factualIndustry(data.FACTUAL_INDUSTRY_CODE);
                self.taxId(data.TAX_ID_NUMBER);
                self.companyName(data.COMPANY_NAME);
                self.facebookUrl(data.FACEBOOK);
                self.websiteUrl(data.WEBSITE);
                self.ssn(data.SOCIAL_CARD_NUMBER);
                self.individualAddressIsSame(data.IS_INDIVIDUAL_ADDRESS_SAME);
                self.actualAddressIsSame(data.IS_CURRENT_ADDRESS_SAME);

                self.individualAddress(
                    new AddressDetails(
                        data.INDIVIDUAL_COUNTRY_CODE,
                        data.INDIVIDUAL_STATE_CODE,
                        data.INDIVIDUAL_CITY_CODE,
                        data.INDIVIDUAL_STREET,
                        data.INDIVIDUAL_BUILDNUM,
                        data.INDIVIDUAL_APARTMENT,
                        self.isEditable
                    ));
                self.actualAddress(
                    new AddressDetails(
                        data.CURRENT_COUNTRY_CODE,
                        data.CURRENT_STATE_CODE,
                        data.CURRENT_CITY_CODE,
                        data.CURRENT_STREET,
                        data.CURRENT_BUILDNUM,
                        data.CURRENT_APARTMENT,
                        self.isEditable
                    ));

                if (callback) {
                    callback();
                }
            },
            dataType: 'json'
        });
    };

    return UserProfile;
});
