define(['knockout', 'jquery'], function (ko, $) {
    return function (model) {
        var viewModel;

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
            var confirmAction = function () { };
            var closeAction = function () { };
            if (model) {
                if (model.message) {
                    msg = model.message;
                }
                if (model.title) {
                    title = model.title;
                }
                if (model.confirm) {
                    confirmAction = model.confirm;
                }
                if (model.close) {
                    closeAction = model.close;
                }
                if (model.confirmButtonText) {
                    confirmButtonText = model.confirmButtonText;
                }
            }

            viewModel = {
                message: ko.observable(msg),
                title: ko.observable(title),
                isComplete: ko.observable(false),
                confirmButtonText: ko.observable(confirmButtonText),
                confirm: function () {
                    closeAction = function () { };
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
                
            };

            ko.renderTemplate("waitNotificationDialogBox", viewModel, {
                afterRender: function (renderedElement) {
                    dialog = $(renderedElement);
                    dialog.modal("show");
                    dialog.on("hidden.bs.modal", function () {
                        dialog.each(function (index, element) { ko.cleanNode(element); });
                        dialog.remove();
                        try {
                            closeAction();
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
        
    }
});