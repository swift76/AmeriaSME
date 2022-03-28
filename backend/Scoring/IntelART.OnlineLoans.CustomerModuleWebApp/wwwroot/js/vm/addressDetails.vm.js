define(['knockout', 'jquery', './stateList.vm', './cityList.vm', './addressCountryList.vm'],
    function (ko, $, StateList, CityList, AddressCountryList) {
        return function (country, state, city, street, building, apartment, isEditable) {
            var self = this;
            this.validationErrors = ko.observableArray();
            this.countryCode = ko.observable(country);
            this.stateCode = ko.observable(state);
            this.cityCode = ko.observable(city);
            this.streetName = ko.observable(street);
            this.buildingNumber = ko.observable(building);
            this.apartmentNumber = ko.observable(apartment);

            this.isEditable = isEditable;
            this.addressCountries = ko.observable(new AddressCountryList());

            this.states = ko.pureComputed(
                function () {
                    return new StateList(self.countryCode());
                });
            this.cities = ko.pureComputed(
                function () {
                    return new CityList(self.stateCode());
                });

            this.validate = function (isRequired) {
                var self = this;
                self.validationErrors([]);

                if (!(self.countryCode() || "").trim() && isRequired) {
                    self.validationErrors.push({ propertyName: 'countryCode', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
                }

                if (!(self.stateCode() || "").trim() && isRequired) {
                    self.validationErrors.push({ propertyName: 'stateCode', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
                }

                if (!(self.cityCode() || "").trim() && isRequired) {
                    self.validationErrors.push({ propertyName: 'cityCode', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
                }

                if (!(self.streetName() || "").trim() && isRequired) {
                    self.validationErrors.push({ propertyName: 'streetName', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
                }

                if (!(self.buildingNumber() || "").trim() && isRequired) {
                    self.validationErrors.push({ propertyName: 'buildingNumber', errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
                }


                return (self.validationErrors().length === 0);
            }
        }
});