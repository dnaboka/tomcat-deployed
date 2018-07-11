/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function (require) {
    "use strict";

    var _ = require("underscore"),
        i18n = require('bundle!CommonBundle'),
        ClassUtil = require('common/util/classUtil'),
        dashboardSettings = require("dashboard/dashboardSettings"),
        PropertiesDialogView = require("./view/PropertiesDialogView"),
        propertiesTitleFactory = require("dashboard/factory/propertiesTitleFactory"),
        Dialog = require("common/component/dialog/Dialog"),
        dashboardMessageBus = require("../../../dashboardMessageBus"),
        dashboardMessageBusEvents = require("../../../enum/dashboardMessageBusEvents"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    var PropertiesDialog = Dialog.extend(
        /** @lends PropertiesDialog.prototype */
        {

        /**
         * @constructor PropertiesDialog
         * @extends Dialog
         * @access private
         * @classdesc PropertiesDialog - dialog with model input validation and previous state saving.
         */


        events: _.extend({
            "mousedown .header.mover, .subcontainer, .footer": "_onPropertiesDialogSelect"
        }, Dialog.prototype.events),


        /**
         * @description Opens properties dialog. Sets properties dialog model, and original state.
         */
        open: function() {
            //reset dialog to start from basic tab.
            this.content.openTab('basic');
            this.content.model.set(this.content.original.clone().attributes);
            this.content.originalState.set(this.content.original.clone().attributes);

            Dialog.prototype.open.apply(this, arguments);

            this.content.model.validate();
        },

        /**
         * @description on dialog mouse down handler
         * @access protected
         * @fires PropertiesDialog#properties:dialog:select
         */
        _onPropertiesDialogSelect: function(){
            this.trigger("properties:dialog:select", this);
        }
    });

    /**
     * @function getAutoRefreshTitle
     * @access private
     * @param {object} model - component model
     * @description adds additional css class depends on model type is dashboardProperties or dashletProperties.
     * @returns {String} classes
     */
    var getAdditionalCssClasses = function(model) {
      var classes = "dashboardLevelPropertiesDialog " + model.get("type") + "Dialog";
      if (model.get("type") !== dashboardComponentTypes.DASHBOARD_PROPERTIES) {
        classes += " dashletLevelPropertiesDialog";
      }
      return classes;
    };
 
    return ClassUtil.extend(
        /** @lends PropertiesDialogController.prototype */
        {

        /**
         * @constructor PropertiesDialogController
         * @classdesc PropertiesDialogController - constructs properties dialog and initializes properties dialog actions handlers.
         * @param {object} model - component model for which properties dialog is needed.
         */
        constructor: function(model){
            this.dialog = new PropertiesDialog({
                model: model,
                additionalCssClasses: getAdditionalCssClasses(model),
                title: propertiesTitleFactory(model),
                content: new PropertiesDialogView({ model: model }),
                buttons: [
                    { label: i18n["button.apply"], action: "apply", primary: true },
                    { label: i18n["button.ok"], action: "ok", primary: false },
                    { label: i18n["button.cancel"], action: "cancel", primary: false }
                ]
            });

            this.initialize();
        },


        /**
         * @description Initialize function. Initializes events and public property dialogIsOpened.
         */
        initialize: function(){
            this._initEvents();
            this.dialogIsOpened = false;
        },

        /**
         * @description On dialog apply button click handler. Applies changes without closing dialog.
         */
        onDialogApply: function(){
            var self = this;

            if (this.dialog.content.hyperlinkParametersSectionView && this.dialog.content.hyperlinkParametersSectionView.isEditing) {
                this.dialog.content.hyperlinkParametersSectionView.confirmAbort(function () {
                    self.applyModel();
                });
            } else {
                this.applyModel();
            }
        },

        /**
         * @description On dialog ok button click handler. Applies, saves changes and closes dialog.
         */
        onDialogOk: function() {
            var self = this;

            if (this.dialog.content.hyperlinkParametersSectionView && this.dialog.content.hyperlinkParametersSectionView.isEditing) {
                this.dialog.content.hyperlinkParametersSectionView.confirmAbort(function () {
                    if (self.applyModel()){
                        self.saveModel();
                        Dialog.prototype.close.apply(self.dialog, arguments);
                    }
                });
            } else {
                if (this.applyModel()){
                    this.saveModel();
                    Dialog.prototype.close.apply(this.dialog, arguments);
                }
            }
        },

        /**
         * @description On dialog ok button click handler. Returns made changes (if such was) to previous state.
         */
        onDialogCancel: function(){
            this.dialog.content.hyperlinkParametersSectionView && this.dialog.content.hyperlinkParametersSectionView.resetState();

            this.rollbackModel();
            Dialog.prototype.close.apply(this.dialog, arguments);
        },


        /**
         * @description Saves model (made changes) if its valid.
         * @fires dashboardMessageBus#saveDashboardState
         */
        saveModel: function(){
            var originalState = this.dialog.content.originalState;

            if (!_.isEqual(this.dialog.content.original.attributes, this.dialog.content.originalState.attributes)) {
                originalState.set(this.dialog.content.original.toJSON());
                dashboardMessageBus.trigger(dashboardMessageBusEvents.SAVE_DASHBOARD_STATE);
            }
        },

        /**
         * @description Applies changes if they are valid.
         */
        applyModel: function(){
            if (this.dialog.content.model.isValid(true)) {
                this.dialog.content.original && this.dialog.content.original.set(this.dialog.content.model.attributes);
                return true;
            }
            return false;
        },

        /**
         * @description Rollbacks model if its needed.
         * @param {object} [options]
         * @param {boolean} [options.silent] - rollback without event firing.
         */
        rollbackModel: function(options){
            var options  = options || {};
            var original = this.dialog.content.original;
            var originalState = this.dialog.content.originalState;

            var originalStateJSON = originalState.toJSON();

            options.silent ? original.set(originalStateJSON, {silent: true}) : original.set(originalStateJSON);
        },

        /**
         * @description Toggles propeties dialog controller property.
         * @param {string} prop - properties dialog controller property.
         */
        toggleDialogStateProps: function(prop){
            this[prop] ? (this[prop] = false) : (this[prop] = true);
        },

        /**
         * @description Initializes event handlers: on dialog open, close and apply.
         * @access protected
         */
        _initEvents: function(){
            var self = this;

            this.dialog.on("open", function(){
                self.toggleDialogStateProps("dialogIsOpened");
            });

            this.dialog.on("close", function(){
                self.toggleDialogStateProps("dialogIsOpened");
                self.dialog.content.trigger("close");
            });

            this.dialog.on("button:cancel", _.bind(this.onDialogCancel, this));
            this.dialog.on("button:apply", _.bind(this.onDialogApply, this));
            this.dialog.on("button:ok", _.bind(this.onDialogOk, this));

            this.dialog.listenTo(this.dialog.content, "saveAndGoToFilterManager", function() {
                self.onDialogOk();
                dashboardMessageBus.trigger(dashboardMessageBusEvents.OPEN_FILTER_MANAGER);
            });
        },

        /**
         * @description Removes dialog, sign off all of the attached event handlers.
         */
        remove: function(){
            this.dialog.content.remove();
            this.dialog.off("button:cancel");
            this.dialog.off("button:apply");
            this.dialog.off("button:ok");
            this.dialog.off("open");
            this.dialog.off("close");
            this.dialog.remove();
        }
    });
});
