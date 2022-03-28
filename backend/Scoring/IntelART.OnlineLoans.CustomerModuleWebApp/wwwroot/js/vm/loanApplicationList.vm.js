define([
  'knockout',
  'jquery',
  'helpers',
  '../util/notificationDialog',
  './cancellationReasonList.vm',
], function(ko, $, helpers, NotificationDialog, CancellationReasons) {
  $(document).ajaxComplete(function(event, xhr, settings) {
    if (xhr.status == 401) {
      var dialog = new NotificationDialog({
        message: localization.strings['MESSAGE.END_SESSION'],
        title: 'Աշխատանքի ավարտ',
        messageClass: 'dialogNotify',
        confirmButtonText: 'Ավարտել',
        visibleButton: 'true',
        visibleFirstButton: 'false',
        close: function() {
          window.location.href = '/account/logout';
        },
        confirm: function() {
          window.location.href = '/account/logout';
        },
      });
      dialog.show();
      dialog.notifyComplete();
    }
  });

  LoanApplicationList = function() {
    var self = this;
    this.items = ko.onDemandObservable(this.getItems, this);
    this.cancellationReason = ko.observable();

    this.selectStatusClass = function(state) {
      switch (state) {
        case 'NEW':
        case 'PENDING_PRE_APPROVAL':
        case 'PENDING_APPROVAL':
        case 'APPROVAL_REVIEW':
          return 'pending';
        case 'PRE_APPROVAL_SUCCESS':
        case 'APPROVAL_SUCCESS':
        case 'AGREED':
        case 'COMPLETED':
        case 'PRINT_READY':
        case 'LOAN_SPECIALIST_ELIGIBLE':
        case 'LOAN_SPECIALIST_PENDING_PREAPPROVAL':
        case 'LOAN_SPECIALIST_PREAPPOVED':
        case 'BANK_REVIEW':
        case 'BANK_REVIEW_SUPERVISOR':
          return 'approved';
        default:
          return 'rejected';
      }
    };

    this.isCancelButtonVisible = function(state) {
      switch (state) {
        case 'PENDING_APPROVAL':
        case 'PRE_APPROVAL_SUCCESS':
        case 'PRE_APPROVAL_REVIEW_ADDITIONAL_DATA':
        case 'PRE_APPROVAL_SUBMITTED':
        case 'ADDITIONAL_ATTACHMENTS_NEEDED':
        case 'PRE_APPROVAL_REVIEW_CORPORATE':
        case 'APPROVAL_SUCCESS':
          return true;
        default:
          return false;
      }
    };

    this.deleteApplication = function(id) {
      $.ajax({
        type: 'DELETE',
        url: '/api/loan/Applications/' + id,
        context: this,
        dataType: 'json',
      });
    };

    this.cancelApplication = function(id) {
      var cancelReasonId = {
        CANCELLATION_REASON_CODE: self.cancellationReason(),
      };
      $.ajax({
        type: 'PUT',
        url: '/api/loan/Applications/Cancelled/' + id,
        context: self,
        data: JSON.stringify(cancelReasonId),
        dataType: 'json',
        error: function(err) {
          helpers.errorHandler(err);
        },
      });
    };

    this.showCancelModal = function(view, event) {
      event.stopPropagation();
      helpers.confirmCancelModal(self.cancellationReason, CancellationReasons, function() {
        self.cancelApplication(view.ID);
      });
    };

    this.printApplication = function(id) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/loan/Applications/' + id + '/Documents/DOC_LOAN_CONTRACT_FINAL');
      xhr.onload = function() {
        if (xhr.status == 500) {
          alert('Պայմանագրի տպելու ձևը դեռ պատրաստ չէ');
        } else {
          var win = window.open(
            '/api/loan/Applications/' + id + '/Documents/DOC_LOAN_CONTRACT_FINAL'
          );
          win.print();
        }
      };
      xhr.send();
    };

    this.visitOffice = function() {
      var dialog = new NotificationDialog({
        message: localization.strings['MESSAGE.VISIT_BANK_BRANCH'],
        title: 'Մոտեցեք մասնաճյուղ',
        visibleButton: 'false',
        messageClass: 'visit-bank',
        firstButtonText: 'Փակել',
        back: function() {
          navigationHelper.navigateToApplicationList();
        },
      });
      dialog.show();
    };
  };

  LoanApplicationList.prototype.getItems = function() {
    var refreshInterval = 10000;
    var self = this;
    $.get({
      url: '/api/loan/Applications',
      context: self,
      success: function(data) {
        this.items(data);
        this.items.loaded(true);
        setTimeout(this.items.refresh, refreshInterval);
      },
      error: function(err) {
        setTimeout(this.items.refresh, refreshInterval);
      },
      dataType: 'json',
    });
  };

  return LoanApplicationList;
});
