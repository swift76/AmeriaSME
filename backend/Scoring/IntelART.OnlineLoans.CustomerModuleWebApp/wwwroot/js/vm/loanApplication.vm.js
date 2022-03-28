define([
  'knockout',
  'jquery',
  './applicationProcessStage',
  './loanPreApprovalApplication.vm',
  './loanMainApplication.vm',
  './idCardIdentification.vm',
  './contractDetails.vm',
  './additionalInfoDetails.vm',
  'lookupDirectory',
], function(
  ko,
  $,
  ApplicationStage,
  LoanPreApprovalApplication,
  LoanMainApplication,
  IdCardIdentification,
  ContractDetails,
  AdditionalInfoDetails,
  LookupDirectory
) {
  LoanApplication = function(id, navigationHelper) {
    this.id = id;
    var self = this;

    this.selectedStage = ko.observable(null);

    var preApprovalStage = new ApplicationStage('VIEW.APPSTAGE.PRE_APPROVAL', function() {
      return new LoanPreApprovalApplication(id, navigationHelper, preApprovalStage.isEditable);
    });
    var mainApplicationStage = new ApplicationStage('VIEW.APPSTAGE.MAIN', function() {
      return new LoanMainApplication(
        id,
        function() {
          return preApprovalStage.view();
        },
        navigationHelper,
        mainApplicationStage.isEditable
      );
    });
    var idCardIdentificationStage = new ApplicationStage(
      'VIEW.APPSTAGE.CARD_IDENTIFICATION',
      function() {
        return new IdCardIdentification(
          id,
          function() {
            return preApprovalStage.view();
          },
          function() {
            preApprovalStage.view.refresh();
          },
          idCardIdentificationStage.isEditable
        );
      }
    );
    var finalizationStage = new ApplicationStage('VIEW.APPSTAGE.CONTRACT_DETAILS', function() {
      return new ContractDetails(
        id,
        function() {
          return preApprovalStage.view();
        },
        navigationHelper,
        finalizationStage.isEditable
      );
    });
    var additionalInfoStage = new ApplicationStage(
      'VIEW.APPSTAGE.PRE_APPROVAL_REVIEW_ADDITIONAL_DATA',
      function() {
        return new AdditionalInfoDetails(
          id,
          function() {
            return preApprovalStage.view();
          },
          navigationHelper,
          additionalInfoStage.isEditable
        );
      }
    );

    preApprovalStage.isAccessible(true);

    var self = this;

    this.children = ko.pureComputed(function() {
      var result = [preApprovalStage];
      if (preApprovalStage.view.loaded()) {
        var view = preApprovalStage.view();
        if (view) {
          result = [
            preApprovalStage,
            mainApplicationStage,
            idCardIdentificationStage,
            finalizationStage,
          ];

          if (
            view.state() === 'PRE_APPROVAL_REVIEW_ADDITIONAL_DATA' ||
            view.state() === 'ADDITIONAL_ATTACHMENTS_NEEDED' ||
            view.state() === 'PRE_APPROVAL_SUBMITTED' ||
            view.state() === 'APPROVAL_REVIEW'
          ) {
            result.push(additionalInfoStage);
          }
          applyApplicationState(view);
        }
      }

      return result;
    });

    function applyApplicationState(preApprovalApplicationView) {
      var applicationState = preApprovalApplicationView.state();
      if (applicationState) {
        switch (applicationState) {
          case 'PENDING_PRE_APPROVAL':
            preApprovalStage.isEditable(false);
            break;
          case 'PRE_APPROVAL_SUCCESS':
            mainApplicationStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            self.setCurrentView(mainApplicationStage);
            break;
          case 'PRE_APPROVAL_REVIEW_CORPORATE':
            preApprovalStage.isEditable(false);
            self.setCurrentView(preApprovalStage);
            break;
          case 'PRE_APPROVAL_REVIEW_ADDITIONAL_DATA':
            additionalInfoStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            self.setCurrentView(additionalInfoStage);
            break;
          case 'ADDITIONAL_ATTACHMENTS_NEEDED':
            additionalInfoStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            additionalInfoStage.isEditable(false);
            self.setCurrentView(additionalInfoStage);
            break;
          case 'PRE_APPROVAL_SUBMITTED':
            additionalInfoStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            additionalInfoStage.isEditable(false);
            self.setCurrentView(additionalInfoStage);
            break;
          case 'PENDING_APPROVAL':
            idCardIdentificationStage.isAccessible(true);
            mainApplicationStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            mainApplicationStage.isEditable(false);
            self.setCurrentView(idCardIdentificationStage);
            break;
          case 'APPROVAL_SUCCESS':
            // load 4th page of the application in editable mode
            finalizationStage.isAccessible(true);
            idCardIdentificationStage.isAccessible(true);
            mainApplicationStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            mainApplicationStage.isEditable(false);
            idCardIdentificationStage.isEditable(false);
            self.setCurrentView(finalizationStage);
            break;
          case 'AGREED':
          case 'COMPLETED':
          case 'PRINT_READY':
            // load 4th page. It is submitted and not editable
            finalizationStage.isAccessible(true);
            idCardIdentificationStage.isAccessible(true);
            mainApplicationStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            mainApplicationStage.isEditable(false);
            idCardIdentificationStage.isEditable(false);
            finalizationStage.isEditable(false);
            self.setCurrentView(finalizationStage);
            break;
          case 'APPROVAL_REVIEW':
            mainApplicationStage.isAccessible(true);
            additionalInfoStage.isAccessible(true);
            preApprovalStage.isEditable(false);
            mainApplicationStage.isEditable(false);
            additionalInfoStage.isEditable(false);
            self.setCurrentView(preApprovalStage);
            break;
          case 'LOAN_SPECIALIST_ELIGIBLE':
          case 'LOAN_SPECIALIST_PENDING_PREAPPROVAL':
          case 'LOAN_SPECIALIST_PREAPPOVED':
          case 'BANK_REVIEW':
          case 'BANK_REVIEW_SUPERVISOR':
            preApprovalStage.isEditable(false);
            break;
          case 'CANCELLED':
          case 'PRE_APPROVAL_FAIL':
          //case "PRE_APPROVAL_REVIEW":
          case 'EXPIRED':
            // load 1st page of the application, the rest pages should be disabled
            preApprovalStage.isEditable(false);
            mainApplicationStage.isAccessible(false);
            self.setCurrentView(preApprovalStage);
            break;
        }
      }
    }

    this.viewTemplate = function(vm) {
      if (vm instanceof LoanPreApprovalApplication) {
        return 'preApprovalApplication';
      } else if (vm instanceof LoanMainApplication) {
        return 'mainApplication';
      } else if (vm instanceof CardIdentification) {
        return 'cardIdentification';
      } else if (vm instanceof ContractDetails) {
        return 'contractDetails';
      } else if (vm instanceof AdditionalInfoDetails) {
        return 'additionalInfoDetails';
      }
      return '__empty__';
    };

    this.setCurrentView = function(vmDescriptor) {
      if (vmDescriptor && vmDescriptor.isAccessible && vmDescriptor.isAccessible()) {
        this.selectedStage(vmDescriptor);
      }
    };

    this.setCurrentView(this.children()[0]);

    this.isCurrentView = function(vm) {
      return vm && vm === this.selectedStage();
    };

    this.getInitialCountries = function() {
      new LookupDirectory().getAddressCountries(function(data) {});
      new LookupDirectory().getStates('', function(data) {});
    };

    this.getInitialCountries();
  };

  return LoanApplication;
});
