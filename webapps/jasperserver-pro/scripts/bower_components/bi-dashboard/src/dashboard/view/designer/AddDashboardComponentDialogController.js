/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        addDashboardComponentDialogTitleFactory = require("dashboard/factory/addDashboardComponentDialogTitleFactory"),
        addDashboardComponentDialogTemplateFactory = require("dashboard/factory/addDashboardComponentDialogTemplateFactory"),
        parameterExpressionAutocompletionMixin = require("dashboard/view/mixin/parameterExpressionAutocompletionMixin"),
        repositoryResourceTypes = require("bi/repository/enum/repositoryResourceTypes"),
        Dialog = require("common/component/dialog/Dialog"),
        ViewWithEpoxy = require("common/view/ViewWithEpoxy"),
        RepositoryChooserDialogFactory = require("bi/repository/dialog/resourceChooser/RepositoryChooserDialogFactory"),
        sidebarTreeLeafTooltipTemplate = require("text!dashboard/template/tooltip/sideBarTreeLeafTooltipTemplate.htm"),
        i18n = require('bundle!DashboardBundle'),
        i18n2 = require('bundle!CommonBundle');

    var AddDashboardComponentDialogView = ViewWithEpoxy.extend({
        events : _.extend({}, ViewWithEpoxy.prototype.events, {
            "click .showRepositoryChooserDialog" : "showDialog"
        }),

        render: function(){
            var res = ViewWithEpoxy.prototype.render.apply(this, arguments);

            this.applyParameterExpressionAutocompletionMixin();

            return res;
        },

        showDialog: function(){
            if (!this.repositoryChooserDialog) {
                var RepositoryChooserDialog = RepositoryChooserDialogFactory.getDialog('item'),
                    extensions = [".pdf", ".docx", ".html", ".ods", ".odt", ".csv", ".pptx", ".rtf", ".xls", ".xlsx", ".svg",
                        ".xml", ".jar", ".jrxml", ".cur", ".jrtx", ".properties", ".css", ".eot", ".ttf", ".woff"];


                this.repositoryChooserDialog = new RepositoryChooserDialog({
                    resourcesTypeToSelect: ["img"],
                    resourcesTypeToSelectTree: ["file"],
                    title: i18n["dashboard.dialog.properties.repository.chooser.title"],
                    tooltipTemplate: sidebarTreeLeafTooltipTemplate,
                    tooltipi18n: i18n2,
                    cssClassItemProcessor: function (item) {
                        if (item.value.resourceType === repositoryResourceTypes.FILE && !_.find(extensions, function(ext){
                                return item.value.label.toLowerCase().endsWith(ext);
                            })){
                            item.cssClass = "dashboard-newContent-image";
                        }
                        return item;
                    }
                });

                this.listenTo(this.repositoryChooserDialog, 'close', function(){
                    if (this.repositoryChooserDialog.selectedResource && this.repositoryChooserDialog.selectedResource.resourceUri){
                        var val = {url: "repo:" + this.repositoryChooserDialog.selectedResource.resourceUri};
                        this.model.set(val);
                        this.model.validate(val);
                    }
                }, this);
            }

            this.repositoryChooserDialog.open();
        },

        remove: function(){
            this.repositoryChooserDialog && this.repositoryChooserDialog.remove();

            return ViewWithEpoxy.prototype.remove.apply(this, arguments);
        }
    });

    _.extend(AddDashboardComponentDialogView.prototype, parameterExpressionAutocompletionMixin);

    function AddDashboardComponentDialogController(model, options) {
        var self = this;
        this.model = model;

        if (options && options.overElement) {
            this.lastHighestIndex = Dialog.highestIndex;
            Dialog.highestIndex = parseInt(options.overElement.css("zIndex")) + 1;
        }

        this.dialog = new Dialog({
            modal: true,
            model: model,
            additionalCssClasses: "addDashboardComponentDialog",
            title: addDashboardComponentDialogTitleFactory(model),
            content: new AddDashboardComponentDialogView({ template: addDashboardComponentDialogTemplateFactory(model), model: model, i18n: i18n }),
            buttons: [
                {
                    label: i18n2[(options && options.okButtonLabel) ? options.okButtonLabel : "button.ok"],
                    action: "ok", primary: true, triggerOnKeyCode: 13
                },
                {
                    label: i18n2["button.cancel"],
                    action: "cancel", primary: false,
                    triggerOnKeyCode: 27
                }
            ]
        });

        this.dialog.listenTo(model, "validated:valid", function(){
            this.enableButton("ok");
        });

        this.dialog.listenTo(model, "validated:invalid", function(){
            this.disableButton("ok");
        });

        this.dialog.listenTo(model, "change", function(){
            model.isValid(true);
        });

        this.dialog.on("close", function(){
            self.dialog.content.trigger("close");
        });

        this.dialog.on("dialog:visible", function(){
            var input = this.$el.find("input");
            var inputVal = input.val();
            // necessary to set caret properly if some text already in the input
            input.focus().val("").val(inputVal);
        });

        options && options.okButtonDisabled && this.dialog.disableButton("ok");
    }

    AddDashboardComponentDialogController.prototype.remove = function() {
        this.dialog.off("dialog:visible");
        this.dialog.remove();
    };

    AddDashboardComponentDialogController.prototype.closeAndRemove = function() {
        Dialog.resetHighestIndex(this.lastHighestIndex);
        this.dialog.close();
        this.remove();
    };

    return AddDashboardComponentDialogController;
});
