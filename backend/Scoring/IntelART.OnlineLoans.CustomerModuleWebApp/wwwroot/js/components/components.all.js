define(['knockout'], function (ko) {
    ko.components.register('address-details', {
        template: { require: 'text!./components/addressDetailsComponent.html' }
    });
    ko.components.register('english-name-surname', {
        template: { require: 'text!./components/englishNameSurnameComponent.html' }
    });
    ko.components.register('loan-term-and-interest', {
        template: { require: 'text!./components/loanTermComponent.html' }
    });
    ko.components.register('upload-documents', {
        template: { require: 'text!./components/uploadDocumentsComponent.html' }
    });
    // small components
    ko.components.register('multiple-file-upload', {
        template: { require: 'text!./components/multipleFileUploadComponent.html' }
    });
    ko.components.register('ko-dropdown', {
        template: { require: 'text!./components/selectComponent.html' },
        viewModel: { require: 'vm/selectComponent.vm' }
    });
});