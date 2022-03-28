define(['jquery'], function($) {
	var activities = null;
	var countries = null;
	var cancellationReasons = null;
	var bankBranches = null;
	var identificationDocumentTypes = null;
	var loanTypes = null;
	var loanRepaymentForms = null;
	var loanPurposes = null;
	var affiliatedCompanySectors = null;
	var appraisalCompanies = null;
	var pledgeTypes = null;
	var industries = null;
	var factualIndustries = null;
	var currencies = [];
	var creditCardTypes = [];
	var states = [];
	var cities = [];
	var loanParameters = [];
	var maritalStatuses = null;
	var monthlyIncomeRanges = null;
	var workExperienceDurations = null;
	var addressCountries = null;

	LookupDirectory = function() {}

	LookupDirectory.prototype.getLoanParameters = function(loanTypeCode, callback) {
		if (loanParameters[loanTypeCode]) {
			callback(loanParameters[loanTypeCode]);
		} else {
			$.get({
				url: "/api/loan/Parameters?loanTypeCode=" + loanTypeCode,
				context: this,
				success: function(data) {
					loanParameters[loanTypeCode] = data;
					callback(loanParameters[loanTypeCode]);
				},
				dataType: 'json'
			});
		}
	};

    LookupDirectory.prototype.getBankBranches = function (callback) {
        if (bankBranches != null) {
            callback(bankBranches);
        }
        else {
            $.get({
                url: "/api/loan/Directory/BankBranches",
                context: this,
                success: function (data) {
                    bankBranches = data;
                    callback(bankBranches);
                },
                dataType: 'json'
            });
        }
    };

	LookupDirectory.prototype.getLoanTypes = function(callback) {
		if (loanTypes != null) {
			callback(loanTypes);
		} else {
			$.get({
				url: "/api/loan/Directory/LoanTypes",
				context: this,
				success: function(data) {
					loanTypes = data;
					callback(loanTypes);
				},
				dataType: 'json'
			});
		}
	};

	// NEW
	LookupDirectory.prototype.getLoanRepaymentForms = function(callback) {
		if (loanRepaymentForms != null) {
			callback(loanRepaymentForms);
		} else {
			$.get({
				url: "/api/loan/Directory/LoanRepaymentForms",
				context: this,
				success: function(data) {
					loanRepaymentForms = data;
					callback(loanRepaymentForms);
				},
				dataType: 'json'
			});
		}
	};

    LookupDirectory.prototype.getStates = function (country, callback) {
        //var countryCode = country;
        var countryCode = '';
        if (states[countryCode]) {
            callback(states[countryCode]);
        }
        else {
            $.get({
                url: "/api/loan/Directory/States",
                context: this,
                success: function (data) {
                    states[countryCode] = data;
                    callback(states[countryCode]);
                },
                dataType: 'json'
            });
        }
    };

	LookupDirectory.prototype.getCities = function(state, callback) {
		if (cities[state]) {
			callback(cities[state]);
		} else {
			$.get({
				url: "/api/loan/Directory/States/" + state + "/Cities",
				context: this,
				success: function(data) {
					cities[state] = data;
					callback(cities[state]);
				},
				dataType: 'json'
			});
		}
	};

    LookupDirectory.prototype.getFactualIndustries = function (callback) {
        if (factualIndustries) {
            callback(factualIndustries);
        }
        else {
            $.get({
                url: "/api/loan/Directory/FactualIndustries",
                context: this,
                success: function (data) {
                    factualIndustries = data;
                    callback(factualIndustries);
                },
                dataType: 'json'
            });
        }
    };

    LookupDirectory.prototype.getCancellationReasons = function (callback) {
        if (cancellationReasons) {
            callback(cancellationReasons);
        }
        else {
            $.get({
                url: "/api/loan/Directory/CancellationReasons",
                context: this,
                success: function (data) {
                    cancellationReasons = data;
                    callback(cancellationReasons);
                },
                dataType: 'json'
            });
        }
    };

    LookupDirectory.prototype.getCurrencies = function (loanType, callback) {
        if (loanType) {
            if (currencies[loanType]) {
                callback(currencies[loanType]);
            }
            else {
                $.get({
                    url: "/api/loan/Directory/Currencies/" + loanType,
                    context: this,
                    success: function (data) {
                        currencies[loanType] = data;
                        callback(currencies[loanType]);
                    },
                    dataType: 'json'
                });
            }
        }
        else {
            return null;
        }
    };

    LookupDirectory.prototype.getAddressCountries = function (callback) {
        if (addressCountries != null) {
            callback(addressCountries);
        }
        else {
            $.get({
                url: "/api/loan/Directory/AddressCountries",
                context: this,
                success: function (data) {
                    addressCountries = data;
                    callback(addressCountries);
                },
                dataType: 'json'
            });
        }
    };

	LookupDirectory.prototype.creditCardTypes = function(loanType, currency, callback) {
		if (loanType && currency) {
			if (creditCardTypes[loanType] && creditCardTypes[loanType][currency]) {
				callback(creditCardTypes[loanType][currency]);
			} else {
				$.get({
					url: "/api/loan/Directory/CreditCardTypes/" + loanType + '/' + currency,
					context: this,
					success: function(data) {
						creditCardTypes[loanType] = [];
						creditCardTypes[loanType][currency] = data;
						callback(creditCardTypes[loanType][currency]);
					},
					dataType: 'json'
				});
			}
		} else {
			return null;
		}
	};

	LookupDirectory.prototype.getActivities = function(callback) {
		if (activities != null) {
			callback(activities);
		} else {
			$.get({
				url: "/api/loan/Directory/Activities",
				context: this,
				success: function(data) {
					activities = data;
					callback(activities);
				},
				dataType: 'json'
			});
		}
	};

	LookupDirectory.prototype.getLoanPurposes = function(callback) {
		if (loanPurposes != null) {
			callback(loanPurposes);
		} else {
			$.get({
				url: "/api/loan/Directory/LoanPurposes",
				context: this,
				success: function(data) {
					loanPurposes = data;
					callback(loanPurposes);
				},
				dataType: 'json'
			});
		}
	};


	LookupDirectory.prototype.getPledgeTypes = function(callback) {
		if (pledgeTypes != null) {
			callback(pledgeTypes);
		} else {
			$.get({
				url: "/api/loan/Directory/PledgeTypes",
				context: this,
				success: function(data) {
					pledgeTypes = data;
					callback(pledgeTypes);
				},
				dataType: 'json'
			});
		}
	};

	LookupDirectory.prototype.getAppraisalCompanies = function(callback) {
		if (appraisalCompanies != null) {
			callback(appraisalCompanies);
		} else {
			$.get({
				url: "/api/loan/Directory/AppraisalCompanies",
				context: this,
				success: function(data) {
					appraisalCompanies = data;
					callback(appraisalCompanies);
				},
				dataType: 'json'
			});
		}
	};

	return LookupDirectory;
});
