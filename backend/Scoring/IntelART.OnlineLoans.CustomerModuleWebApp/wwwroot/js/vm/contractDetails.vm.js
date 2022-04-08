define([
  "knockout",
  "jquery",
  "./activeCreditCardList.vm",
  "./creditCardTypeList.vm",
  "./bankBranchList.vm",
  "../models/loanDocuments.m",
  "../models/companyInfo.m",
  "../lib/diff",
  "helpers",
  "lookupDirectory",
  "../util/notificationDialog",
], function (
  ko,
  $,
  ActiveCreditCardList,
  CreditCardTypeList,
  BankBranchList,
  LoanDocsModel,
  CompanyInfoModel,
  Diff,
  helpers,
  LookupDirectory,
  NotificationDialog
) {
  ContractDetails = function (
    id,
    preApprovalStage,
    navigationHelper,
    isEditable
  ) {
    var self = this;
    this.isEditable = isEditable;

    this.id = id || preApprovalStage().id;
    this.validationErrors = ko.observableArray();
    this.loanType = ko.observable(preApprovalStage().loanType());
    self.currency = ko.observable(preApprovalStage().currency());
    this.state = ko.observable(preApprovalStage().state());
    this.activeCreditCard = ko.observable();
    this.creditCardType = ko.observable();
    this.bankBranch = ko.observable();
    this.isCardAccount = ko.observable(false);
    this.isCompanyLLC = ko.observable(false);
    this.guaranteeSignatureText = ko.observable("");
    this.guaranteeAgreementText = ko.observable();
    this.internetBankChecked = ko.observable(false);
    this.diffHtml = ko.observable();
    this.clientCode = ko.observable(preApprovalStage().clientCode);

    // ====================================

    this.LOAD_INTEREST_2 = ko.observable(0);
    this.actualInterestConfirmText = ko.observable("");
    this.confirmActualInterest = ko.computed(function () {
      var result =
        helpers.cleanConfirmText(self.actualInterestConfirmText()) ===
        helpers.cleanConfirmText(
          helpers.actualInterestUserText.replace("{X}", self.LOAD_INTEREST_2())
        );
      return result;
    });
    // ========================================

    this.isMainFormVisible = ko.computed(function () {
      self.isCardAccount(preApprovalStage().loanInfo().IS_CARD_ACCOUNT);
      return self.isCardAccount();
    });

    this.activeCreditCards = ko.computed(function () {
      if (self.isMainFormVisible() && self.id) {
        return new ActiveCreditCardList(self.id);
      }
    });

    this.activeCardListVisible = ko.computed(function () {
      return (
        self.activeCreditCards() &&
        self.activeCreditCards().items() &&
        self.activeCreditCards().items().length > 0
      );
    });

    this.creditCardTypes = ko.computed(function () {
      if (self.isMainFormVisible()) {
        return new CreditCardTypeList(self.loanType(), self.currency());
      }
      return false;
    });

    this.bankBranches = ko.computed(function () {
      return new BankBranchList();
    });

    this.newCardCheckbox = ko.observable(false);

    this.orderNewCardFormDisable = ko.computed(function () {
      if (self.newCardCheckbox() && self.isCardAccount()) {
        self.activeCreditCard("");
      }
      return self.newCardCheckbox() === false;
    });

    this.disableExistingCardList = ko.computed(function () {
      return self.newCardCheckbox() && self.isCardAccount();
    });

    this.isCardDelivered = ko.observable("true");
    this.isCardDeliveryAddressVisible = ko.pureComputed(function () {
      return self.isCardDelivered() === "true";
    });

    this.cardDeliveryAddress = ko.observable();

    this.contractTermsCheckbox = ko.observable(false);
    this.pledgeTermsCheckbox = ko.observable(false);
    this.guaranteeTermsCheckbox = ko.observable(false);
    this.arbitrageTermsCheckbox = ko.observable(false);

    this.isSubmitButtonDisabled = ko.pureComputed(function () {
      return (
        !self.isEditable() ||
        !self.confirmActualInterest() ||
        self.contractTermsCheckbox() === false ||
        self.pledgeTermsCheckbox() === false ||
        (self.guaranteeAgreementLinkVisible() &&
          (self.guaranteeTermsCheckbox() === false ||
            !self.guaranteeAgreementText()))
      );
    });

    this.isApplicationEditable = ko.computed(function () {
      return (
        self.state() !== "COMPLETED" &&
        self.state() !== "PRINT_READY" &&
        self.state() !== "AGREED"
      );
    });

    this.loanContractLink = LoanDocsModel.getContractUrl(self.id);
    this.pledgeAgreementLink = LoanDocsModel.getPledgeAgreementUrl(self.id);
    this.guaranteeAgreementLink = null;
    this.arbitrageAgreementLink = LoanDocsModel.getArbitrageAgreementUrl(
      self.id
    );

    this.guaranteeAgreementLinkVisible = ko.computed(function () {
      CompanyInfoModel.checkCompanyLLC(self.id).then(function (isLLC) {
        if (isLLC) {
          self.isCompanyLLC(isLLC);
          self.guaranteeAgreementLink = LoanDocsModel.getGuaranteeAgreementUrl(
            self.id
          );
          return isLLC;
        }
      });
      return self.isCompanyLLC();
    });

    this.loadData = function (callback) {
      var self = this;
      if (self.id) {
        $.get({
          url: "/api/loan/Applications/" + self.id + "/Agreed",
          context: self,
          success: function (data) {
            if (data) {
              self.LOAD_INTEREST_2(data.LOAD_INTEREST_2);
              self.clientCode((data.CLIENT_CODE || "").trim());
              self.guaranteeSignatureText(
                data.GUARANTEE_SIGNATURE_TEXT_TO_BE_ENTERED
              );
              self.state(data.STATUS_STATE);

              if (
                self.state() === "COMPLETED" ||
                self.state() === "PRINT_READY" ||
                self.state() === "AGREED"
              ) {
                self.contractTermsCheckbox(true);
                self.pledgeTermsCheckbox(true);
                self.guaranteeTermsCheckbox(true);
              }
              if (data.IS_NEW_CARD) {
                self.newCardCheckbox(true);
              }
              self.isCardDelivered(data.IS_CARD_DELIVERY.toString());

              if (data.CARD_DELIVERY_ADDRESS) {
                self.cardDeliveryAddress = ko.observable(
                  data.CARD_DELIVERY_ADDRESS
                );
              }
              if (data.IS_ARBITRAGE_CHECKED) {
                self.arbitrageTermsCheckbox(true);
              }
              if (data.EXISTING_CARD_CODE) {
                self.activeCreditCard = ko.observable(data.EXISTING_CARD_CODE);
              }
              if (data.CREDIT_CARD_TYPE_CODE) {
                self.creditCardType = ko.observable(data.CREDIT_CARD_TYPE_CODE);
              }
              if (data.BANK_BRANCH_CODE) {
                self.bankBranch = ko.observable(data.BANK_BRANCH_CODE);
              }

              if (data.GUARANTEE_SIGNATURE_TEXT) {
                self.guaranteeAgreementText(data.GUARANTEE_SIGNATURE_TEXT);
              }

              if (data.IS_INTERNET_BANK_CHECKED) {
                self.internetBankChecked(data.IS_INTERNET_BANK_CHECKED);
              }
            }
            if (callback) {
              callback();
            }
          },
          dataType: "json",
        });
      }
    };

    this.action = function (name, callback) {
      var self = this;
      if (
        name == "loanContractLink" ||
        name == "pledgeAgreementLink" ||
        name == "guaranteeAgreementLink"
      ) {
        if (!self.isApplicationEditable() && callback) {
          callback();
        } else {
          self.saveConsumerLoanContract(name, callback);
        }
      } else if (name == "submitContract") {
        self.submitContractDetails(callback);
      }
    };

    this.saveConsumerLoanContract = function (link, callback) {
      var self = this;
      // maybe not needed
      if (!this.id) {
        return false;
      }
      var url = self[link];
      var obj = {
        LOAN_TYPE_ID: self.loanType(),
        AGREED_WITH_TERMS: true,
        IS_SUBMIT: false,
        GUARANTEE_SIGNATURE_TEXT: self.guaranteeAgreementText(),
        IS_INTERNET_BANK_CHECKED: self.internetBankChecked(),
      };

      if (self.isCardAccount()) {
        obj.CREDIT_CARD_TYPE_CODE = self.creditCardType();
        obj.EXISTING_CARD_CODE = self.activeCreditCard();
        obj.IS_NEW_CARD = self.orderNewCardFormDisable();
        obj.IS_CARD_DELIVERY = self.isCardDeliveryAddressVisible();
        obj.CARD_DELIVERY_ADDRESS = self.cardDeliveryAddress();
        obj.BANK_BRANCH_CODE = self.bankBranch();
      }
      $.post({
        url: "/api/loan/Applications/" + this.id + "/Agreed",
        context: self,
        data: JSON.stringify(obj),
        success: function (data) {
          helpers.openInNewTab(url);
          if (callback) {
            callback();
          }
        },
        error: function (err) {
          if (callback) {
            helpers.errorHandler(err);
            callback(err);
          }
        },
      });

      return false;
    };

    this.validate = function () {
      var self = this;
      self.validationErrors([]);

      if (self.isCardAccount()) {
        if (!self.newCardCheckbox() && !self.activeCreditCard()) {
          self.validationErrors.push({
            propertyName: "activeCreditCard",
            errorMessage: localization.errors["CARD_REQUIRED_ERROR"],
          });
        }

        if (self.newCardCheckbox()) {
          if (!self.creditCardType()) {
            self.validationErrors.push({
              propertyName: "creditCardType",
              errorMessage: localization.errors["CARD_TYPE_REQUIRED_ERROR"],
            });
          }

          if (
            self.isCardDeliveryAddressVisible() &&
            (!self.cardDeliveryAddress() ||
              self.cardDeliveryAddress().trim() == "")
          ) {
            self.validationErrors.push({
              propertyName: "cardDeliveryAddress",
              errorMessage: localization.errors["REQUIRED_FIELD_ERROR"],
            });
          }

          if (!self.isCardDeliveryAddressVisible() && !self.bankBranch()) {
            self.validationErrors.push({
              propertyName: "bankBranch",
              errorMessage: localization.errors["BRANCH_REQUIRED_ERROR"],
            });
          }
        }
      }

      if (self.guaranteeAgreementLinkVisible()) {
        if (!self.guaranteeAgreementText()) {
          self.validationErrors.push({
            propertyName: "guaranteeAgreementText",
            errorMessage: localization.errors["REQUIRED_FIELD_ERROR"],
          });
        } else if (
          !self.checkguaranteeAgreementText(self.guaranteeAgreementText())
        ) {
          var diffContent = self.diffGuaranteeAgreementText(
            self.guaranteeAgreementText()
          );
          self.diffHtml(diffContent);
          self.validationErrors.push({
            propertyName: "guaranteeAgreementText",
            errorMessage: localization.errors["GUARANTEEAGREEMENTTEXTERROR"],
          });
        } else {
          self.diffHtml("");
        }
      }

      return self.validationErrors().length === 0;
    };

    this.submitContractDetails = function (callback) {
      var self = this;
      if (!self.validate()) {
        callback();
        return;
      }

      var obj = {
        EXISTING_CARD_CODE: "",
        IS_NEW_CARD: false,
        CREDIT_CARD_TYPE_CODE: "",
        IS_CARD_DELIVERY: false,
        CARD_DELIVERY_ADDRESS: "",
        BANK_BRANCH_CODE: "",
        IS_INTERNET_BANK_CHECKED: self.internetBankChecked(),
      };

      if (self.guaranteeAgreementLinkVisible()) {
        obj.GUARANTEE_SIGNATURE_TEXT = self.guaranteeAgreementText();
      }

      if (self.isCardAccount()) {
        if (!self.newCardCheckbox() && self.activeCreditCard()) {
          obj.EXISTING_CARD_CODE = self.activeCreditCard();
        }

        if (self.newCardCheckbox()) {
          obj.IS_NEW_CARD = true;

          if (self.creditCardType()) {
            obj.CREDIT_CARD_TYPE_CODE = self.creditCardType();
          }

          obj.IS_CARD_DELIVERY = self.isCardDeliveryAddressVisible();

          if (obj.IS_CARD_DELIVERY) {
            obj.CARD_DELIVERY_ADDRESS = self.cardDeliveryAddress();
          } else {
            obj.BANK_BRANCH_CODE = self.bankBranch();
          }
        }
      }

      obj.AGREED_WITH_TERMS = true;
      obj.LOAN_TYPE_ID = self.loanType();
      obj.IS_ARBITRAGE_CHECKED = self.arbitrageTermsCheckbox();
      obj.IS_SUBMIT = true;
      var dialog = new NotificationDialog({
        message:
          "Կատարվում են բանկային ձևակերպումները, խնդրում ենք սպասել, դա կարող է տևել մի քանի րոպե:",
        title: "Կատարվում է հարցում",
        visibleButton: "false",
        messageClass: "dialogLoader",
        confirmButtonText: "Ավարտել",
        back: function () {
          navigationHelper.navigateToApplicationList();
        },
        confirm: function () {
          navigationHelper.navigateToApplicationList();
        },
      });
      dialog.show();

      $.post({
        url: "/api/loan/Applications/" + this.id + "/Agreed",
        context: self,
        data: JSON.stringify(obj),
        success: function (data) {
          var noResponseTimeout = 0;
          var newApplicationRequest = setInterval(function () {
            $.get({
              url: "/api/loan/Applications/" + self.id,
              context: self,
              success: function (data) {
                var hasResult = false;
                preApprovalStage().state(data.STATUS_STATE);

                if (data && data.STATUS_STATE === "COMPLETED") {
                  hasResult = true;
                  dialog.setMessageClass("dialogNotify");
                  dialog.setTitle(localization.statusMessages.COMPLETED_TITLE);
                  dialog.setMessage(localization.statusMessages.COMPLETED);
                  dialog.setFirstButtonVisible("false");
                  dialog.setButtonVisible("true");
                  dialog.notifyComplete();
                }
                noResponseTimeout += 10000;
                if (!hasResult && noResponseTimeout >= 3 * 1000 * 60) {
                  dialog.setMessage(localization.statusMessages.DELAY);
                }
                if (callback) {
                  callback();
                }
              },
              dataType: "json",
            });
          }, 10000);
        },
        error: function (err) {
          dialog.hide();
          helpers.errorHandler(err);
          if (callback) {
            callback(err);
          }
        },
      });
    };

    this.checkguaranteeAgreementText = function (text) {
      var regexp = /[^Ա-Ֆա-և0-9]/g;
      return (
        text.replace(regexp, "") ===
        self.guaranteeSignatureText().replace(regexp, "")
      );
    };

    this.diffGuaranteeAgreementText = function (text) {
      var regexp = /[^Ա-Ֆա-և 0-9 ]/g;
      text = text.replace(regexp, "");
      var originalText = self.guaranteeSignatureText().replace(regexp, "");
      var diffArr = Diff.diffWords(text, originalText);
      var color = "",
        weigth = "400",
        span = null,
        content = $("<div></div>");
      diffArr.forEach(function (part) {
        color = part.added ? "#3da08b" : part.removed ? "#c40000" : "#999";
        span = $(
          '<span style="color: ' + color + '";>' + part.value + "</span>"
        );
        content.append(span);
      });

      return content.html();
    };
  };

  return ContractDetails;
});
