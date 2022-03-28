define(['knockout', 'jquery'], function (ko, $) {
    return function (model) {
        var viewModel;
        var self = this;

        this.show = function () {
            var body = $("body")[0];
            var div = document.createElement("div");
            div.style.display = "none";
            document.body.appendChild(div);
            var dialog = null;
            var getDialog = function () { return dialog; };

            var msg = "";
            var title = "";
            var confirmButtonText = "Շարունակել";
            var firstButtonText = "Վերադառնալ գլխավոր էջ";
            var messageClass = "dialogLoader";
            var visibleButton = true;
            var visibleFirstButton = true;
            var dropdown = null;
            var validationErrors = [];
            var confirmAction = function () { };
            var back = function () { };
            var closeAction;

            defaultAction = {
                isEnabled: true,
                action: function () {
                    var d = getDialog();
                    if (d) {
                        d.modal("hide");
                    }
                    try {
                        confirmAction();
                    }
                    catch (err) {
                    }
                }
            }

            if (model) {
                if (model.message) {
                    msg = model.message;
                }
                if (model.title) {
                    title = model.title;
                }
                if (model.dropdown) {
                    dropdown = model.dropdown;
                }
                if (model.confirm) {
                    confirmAction = model.confirm;
                }
                if (model.close) {
                    closeAction = model.close;
                }
                if (model.back) {
                    back = model.back;
                }
                if (model.confirmButtonText) {
                    confirmButtonText = model.confirmButtonText;
                }
                if (model.firstButtonText) {
                    firstButtonText = model.firstButtonText;
                };
                if (model.visibleButton) {
                    visibleButton = (model.visibleButton == "true");
                }
                if (model.visibleFirstButton) {
                    visibleFirstButton = (model.visibleFirstButton == "true");
                }
                if (model.messageClass) {
                    messageClass = model.messageClass;
                }
                if (model.actions) {
                    confirmAction = model.confirm;
                    closeAction = model.actions.closeAction;
                    back = model.actions.back;
                } else if (model.confirm) {
                    confirmAction = model.confirm;
                    actions = [defaultAction];
                } else {
                     // Inject default action
                    actions = [defaultAction];
                }
            }

            viewModel = {
                message: ko.observable(msg),
                dropdown: dropdown,
                title: ko.observable(title),
                isComplete: ko.observable(false),
                confirmButtonText: ko.observable(confirmButtonText),
                firstButtonText: ko.observable(firstButtonText),
                visibleButton: ko.observable(visibleButton),
                visibleFirstButton: ko.observable(visibleFirstButton),
                messageClass: ko.observable(messageClass),
                actions: [],
                isShow: true,
                validationErrors: ko.observableArray(),
                confirm: function () {
                    if (self.validate()) {
                        closeAction = null;
                        var d = getDialog();
                        if (d) {
                            d.modal("hide");
                        }
                        try {
                            confirmAction();
                        } catch (err) {}
                    }
                },
                back: function () {
                    closeAction = null;
                    var d = getDialog();
                    if (d) {
                        d.modal("hide");
                    }
                    try {
                        back();
                    } catch (err) {}
                },
                hide: function () {
                    var d = getDialog();
                    if (d) {
                        d.modal("hide");
                    }
                }
            };

            ko.renderTemplate("notificationDialogBox", viewModel, {
                afterRender: function (renderedElement) {
                    dialog = $(renderedElement);
                    dialog.modal("show");
                    dialog.on("hidden.bs.modal", function () {
                        dialog.each(function (index, element) { ko.cleanNode(element); });
                        dialog.remove();
                        try {
                            if (closeAction) {
                                closeAction()
                            };
                        }
                        catch (err) {
                        }
                    });
                }
            }, div, "replaceNode");
        }

        this.notifyComplete = function () {
            viewModel.isComplete(true);
        }
        this.setMessage = function (msg) {
            viewModel.message(msg);
        }
        this.setTitle = function (title) {
            viewModel.title(title);
        }
        this.hide = function () {
            viewModel.hide();
        }
        this.isShow = function () {
            return viewModel.isShow;
        }
        this.setMessageClass = function (messageClass) {
            viewModel.messageClass(messageClass);
        }
        this.setButtonVisible = function (visibleButton) {
            viewModel.visibleButton(visibleButton == "true")
        }
        this.setFirstButtonVisible = function(visible) {
            viewModel.visibleFirstButton(visible === 'true');
        }

        this.validate = function () {
            viewModel.validationErrors([]);
            if (viewModel.dropdown && viewModel.dropdown.isRequired && !viewModel.dropdown.value()) {
                viewModel.validationErrors.push({ propertyName: viewModel.dropdown.name, errorMessage: localization.errors["REQUIRED_FIELD_ERROR"] });
            }

            return (viewModel.validationErrors().length === 0)
        }
    }
});