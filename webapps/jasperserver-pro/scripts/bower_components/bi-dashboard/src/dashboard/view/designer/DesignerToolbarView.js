/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar Tomchenko, Kostiantyn Tsaregradskyi, Sergii Kylypko
 * @version: $Id: DesignerToolbarView.js 136 2014-09-18 09:29:17Z obobruyko $
 */

define(function(require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        i18n = require('bundle!DashboardBundle'),
        HoverMenu = require('common/component/menu/HoverMenu'),
        Dialog = require('common/component/dialog/Dialog'),
        dashboardMessageBus = require("dashboard/dashboardMessageBus"),
        dashboardMessageBusEvents = require("dashboard/enum/dashboardMessageBusEvents"),
        toolbarTemplate = require('text!dashboard/template/designerToolbarTemplate.htm'),
        ViewerToolbarView = require('../viewer/ViewerToolbarView'),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        PropertiesDialogController = require("dashboard/view/designer/propertiesDialog/PropertiesDialogController"),
        SaveDialog = require('./SaveDialogView'),
        FilterManagerDialog = require('./filterManager/FilterManagerDialog');

    return ViewerToolbarView.extend({
        events: {
            "click #grid": "toggleLayoutGrid",
            "click #presentation": "togglePreviewMode",
            "click #filterManager": "showFilterManagerDialog",
            "click #filterPopup": "toggleFilterPopupDialog",
            "click #properties" : "togglePropertiesDialog",
            "click #undo": "undo",
            "click #undoAll": "undoAll",
            "click #redo": "redo"
        },

        el: _.template(toolbarTemplate, { i18n: i18n }),

        initialize: function(options) {
            ViewerToolbarView.prototype.initialize.apply(this, arguments);

            var foundation = this.model.currentFoundation;

            this.dashboardId = options.dashboardId;

            this.state = options.state;

            this.saveDialog = new SaveDialog({ model: this.model });

            this.listenTo(this.model, 'change:uri', _.bind(function() { this._initSaveMenu(); }, this));
            this.listenTo(this.model, 'change:label', function() {
                this.setTitle(this.model.get("label"));
            }, this);

            this.listenTo(foundation, "addComponent", function(model){
                if (model.get("type") === dashboardComponentTypes.DASHBOARD_PROPERTIES) {
                    this._initDashboardPropertiesDialogController(model);
                }
            });

            this.listenTo(this.saveDialog, "save", function() { this.trigger("dashboard:save"); }, this);
            this.listenTo(this.state, "change:currentState", this._onDashboardStateChange);

            this.listenTo(foundation, "addComponent removeComponent", this._onComponentsChange);
            this.listenTo(foundation.wiring, "init", function() {
                if (this.model.currentFoundation.wiring.initialized && this.model.currentFoundation.hasVisualComponents()) {
                    this.$("#filterManager").removeAttr("disabled").removeClass("disabledButton");
                }
            }, this);

            this.listenTo(dashboardMessageBus, dashboardMessageBusEvents.OPEN_FILTER_MANAGER, this.showFilterManagerDialog);

            this._initSaveMenu();
            this._initDashboardPropertiesDialogController(foundation.components.getDashboardPropertiesComponent());

            this.setTitle(this.model.get("label"));
        },

        undo: function() {
            this.trigger("button:undo");
        },

        undoAll: function() {
            this.trigger("button:undoAll");
        },

        redo: function() {
            this.trigger("button:redo");
        },

        togglePreviewMode: function() {
            if (this.previewIsOn) {
                this.previewIsOn = false;
                this.showAllButtons(["filterPopup"]);
                this.$("#presentation").removeClass("down");
                this.$("#filterPopup").removeClass("pressed").removeClass("down");
                this.filterPopupIsVisible = false;
                this.$(".toolbar").removeClass("previewMode");
                this.trigger("preview:off");
                // Return grid button highlighting after preview mode if grid was enabled.
                if (this.propertiesIsOn) {
                    this.$("#properties").addClass("down");
                    this.propertiesDialogController.dialog.open();
                }
                if (this.gridIsOn) {
                    this.$("#grid").addClass("down");
                }
                this.setVisibility({
                    export:false
                });
                this._onDashboardStateChange();
            } else {
                this.previewIsOn = true;
                this.hideAllButtons(["save", "presentation", "export", "filterPopup", "undo", "redo", "undoAll"]);
                this.$(".toolbar").addClass("previewMode");
                this.$("#presentation").addClass("down");
                this.$("#filterPopup").removeClass("pressed").removeClass("down");
                this.filterPopupIsVisible = false;
                this.trigger("preview:on");
                // Remove grid button highlighting during preview mode.
                if (this.propertiesIsOn) {
                    this.$("#properties").removeClass("down");
                    this.propertiesDialogController.dialog.close();
                }
                if (this.gridIsOn) {
                    this.$("#grid").removeClass("down");
                }

                this.setVisibility({
                    export:this.model.currentFoundation.components.getDashboardPropertiesComponent().get("showExportButton")
                });
            }

            dashboardMessageBus.trigger(dashboardMessageBusEvents.TOGGLE_PREVIEW_MODE, this.previewIsOn);
        },

        toggleLayoutGrid: function() {
            if (this.gridIsOn) {
                this.gridIsOn = false;
                this.$("#grid").removeClass("down");
                this.trigger("grid:off");
            } else {
                this.gridIsOn = true;
                this.$("#grid").addClass("down");
                this.trigger("grid:on");
            }
        },

        showFilterManagerDialog: function() {
            if (!this.filterManagerDialog) {
                this.filterManagerDialog = new FilterManagerDialog({
                    model: this.model.currentFoundation,
                    dashboardId: this.dashboardId
                });
            }

            this.filterManagerDialog.open();
        },

        _initDashboardPropertiesDialogController: function(model){
            if (this.propertiesDialogController) {
                this.stopListening(this.propertiesDialogController.dialog);
                this.propertiesDialogController.dialog.remove();
            }

            this.propertiesDialogController = new PropertiesDialogController(model);

            this.listenTo(this.propertiesDialogController.dialog, "close", function() {
                this.$("#properties").removeClass("down");
            }, this);

            this.listenTo(this.propertiesDialogController.dialog, "button:cancel", function() {
                this.propertiesIsOn = false;
            }, this);

            this.listenTo(this.propertiesDialogController.dialog, "button:ok", function() {
                this.propertiesIsOn = false;
            }, this);

            this.listenTo(this.propertiesDialogController.dialog.content.original, "change", this._onDashboardPropertiesChange);
        },

        /**
         * Shows/hides dashboard level properties.
         */
        togglePropertiesDialog: function() {
            var $properties = this.$("#properties");
            if (this.propertiesIsOn) {
                $properties.removeClass("down");
                this.propertiesDialogController.dialog.close();
                this.propertiesIsOn = false;
            } else {
                $properties.addClass("down");
                this.propertiesDialogController.dialog.open();
                this.propertiesIsOn = true;
            }
        },

        hideAllButtons: function(except) {
            var $buttons = this.$(".toolbar button");

            if (except && _.isArray(except) && except.length > 0) {
                $buttons = $buttons.not(_.map(except, function(id) { return "[id='" + id + "']" }).join(","));
            }

            $buttons.addClass("hidden").hide();
        },

        showAllButtons: function(except) {
            var $buttons = this.$(".toolbar button");

            if (except && _.isArray(except) && except.length > 0) {
                $buttons = $buttons.not(_.map(except, function(id) { return "[id='" + id + "']" }).join(","));
            }

            $buttons.removeClass("hidden").show();
        },

        _onDashboardStateChange: function() {
            if (this.state.hasPreviousState()) {
                this.$("#undo, #undoAll").removeAttr("disabled").removeClass("over disabledButton");
            } else {
                this.$("#undo, #undoAll").attr("disabled", "disabled").addClass("disabledButton").removeClass("over");
            }

            if (this.state.hasNextState()) {
                this.$("#redo").removeAttr("disabled").removeClass("over disabledButton");
            } else {
                this.$("#redo").attr("disabled", "disabled").addClass("disabledButton").removeClass("over");
            }
        },

        _onDashboardPropertiesChange: function(properties) {
            if ("dashletFilterShowPopup" in properties.changedAttributes()) {
                this.setVisibility({
                    "filterPopup": properties.get("dashletFilterShowPopup")
                });
                if (!properties.get("dashletFilterShowPopup")) {
                    this.closeFilterPopupDialog();
                }
            }
        },

        _onComponentsChange: function() {
            var $saveBtn = this.$("#save").removeClass("over"),
                $previewBtn = this.$("#presentation").removeClass("over");

            if (this.model.currentFoundation.hasVisualComponents()) {
                $saveBtn.removeAttr("disabled").removeClass("disabledButton");
                $previewBtn.removeAttr("disabled").removeClass("disabledButton");
                this.model.currentFoundation.wiring.initialized && this.$("#filterManager").removeAttr("disabled").removeClass("disabledButton")
            } else {
                $saveBtn.attr("disabled", "disabled").addClass("disabledButton");
                $previewBtn.attr("disabled", "disabled");
                this.$("#filterManager").attr("disabled", "disabled").addClass("disabledButton")
            }
        },

        _initSaveMenu: function() {
            if (this.saveMenu) {
                this.stopListening(this.saveMenu);
                this.saveMenu.remove();
            }

            var saveMenuOptions = [{ label: i18n["dashboard.save.label"], action: "save" }];

            if (!this.model.isNew()) {
                saveMenuOptions.push({ label: i18n["dashboard.save.as.label"], action: "saveAs" });
            }

            this.saveMenu = new HoverMenu(saveMenuOptions, this.$("#save"));

            this.listenTo(this.saveMenu, "option:save", _.bind(function() { this._onSaveMenuOptionSelected(); }, this));
            this.listenTo(this.saveMenu, "option:saveAs", _.bind(function() { this._onSaveAsMenuOptionSelected(); }, this));
        },

        _onSaveMenuOptionSelected: function() {
            this.saveMenu.hide();
            this.saveDialog.save();
        },

        _onSaveAsMenuOptionSelected: function() {
            this.saveMenu.hide();
            this.saveDialog.saveAs();
        },

        remove: function() {
            this.saveMenu && this.saveMenu.remove();
            this.saveDialog && this.saveDialog.remove();
            this.propertiesDialogController.dialog && this.propertiesDialogController.dialog.remove();

            ViewerToolbarView.prototype.remove.apply(this, arguments);
        }
    });
});