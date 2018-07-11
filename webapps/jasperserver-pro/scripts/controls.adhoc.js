/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* jshint undef: false */

var adhocControls = {};

adhocControls = {
    CONTROLS_LOCATION: 'filtersMainTableICCell',
    filterSaveAsCheckbox: null,
    controlsController: null,
    hideDialog: null,
    lastSelection: {
        controlsData: null,
        saveAsDefault: null
    },

    initialize : function(state){
        if (hasVisibleInputControls !== 'true' || ! $(ControlsBase.INPUT_CONTROLS_DIALOG)) {
            return;
        }
        this.controlsController = new JRS.Controls.Controller({
            reportUri: Report.reportUnitURI
        });

        var optionsContainerSelector = "#" + ControlsBase.INPUT_CONTROLS_FORM + " .sub.header";
        if (jQuery("#" + ControlsBase.INPUT_CONTROLS_DIALOG).length > 0) {
            optionsContainerSelector = "#" + ControlsBase.INPUT_CONTROLS_DIALOG + " .sub.header";
        }

        this.viewModel = this.controlsController.getViewModel();
        this.viewModel.reloadContainer();

        this.controlsController.fetchControlsStructure(state.adhocParameters, true).always(function() {
            var viewModel = adhocControls.viewModel;
            if (!viewModel.areAllControlsValid() || reportForceControlsOnStart === "true") {
                adhocControls.launchDialog();
            } else {
                adhocControls.forceFiltersFromControls();
            }
        });

        this.filterSaveAsCheckbox = jQuery("#filterssaveasdefault");

        if (this.filterSaveAsCheckbox.length === 0) {
            throw Error("Can't find filter save as default");
        }

        adhocControls.setSaveAsDefaultCheckbox(state.isSaveParametersAsDefault);
        
        var dialogButtonActions = {
            'button#ok': this.applyFilters.curry(true),
            'button#cancel': this.cancel,
            'button#reset': this.reset,
            'button#apply': this.applyFilters.curry(false)
        };
       	this._dialog = new ControlDialog(dialogButtonActions);
    },

    launchDialog : function() {
        if (hasVisibleInputControls !== 'true') return;
        adhocControls._dialog.show();
        enableSelection(adhocControls._dialog._dom);
        adhocControls.setFocusOnFirstInputControl();
    },

    applyFilters: function(closeDialog) {
        adhocControls.hideDialog = closeDialog;
        if (adhocControls.isSelectionChanged()) {
            adhocControls.controlsController.validate()
                .then(function (areControlsValid) {
                    if (areControlsValid) {
                        adhocControls.forceFiltersFromControls();
                        closeDialog && adhocControls.closeDialog();
                    }
                }
            );
        } else if (adhocControls.viewModel.areAllControlsValid()) {
            closeDialog && adhocControls.closeDialog();
        }
    },

    reset : function(){
        adhocControls.controlsController.reset();
        adhocControls.setSaveAsDefaultCheckbox(true);
    },

    cancel : function(){
        adhocControls.closeDialog();
        if (adhocControls.isSelectionChanged()) {
            adhocControls.restoreDialogLastSelection();
        }
    },

    forceFiltersFromControls:function () {
        var selectedData = adhocControls.getControlsSelection();

        var extraParams;
        var saveAsDefaultChecked = adhocControls.isSaveAsDefaultCheckbox();
        if (saveAsDefaultChecked) {
            extraParams = {"filterssaveasdefault":"on"};
        }

        adhocControls.forceFilterAction(ControlsBase.buildSelectedDataUri(selectedData, extraParams));

        adhocControls.saveDialogLastSelection(selectedData, saveAsDefaultChecked);
    },

    closeDialog : function(){
        adhocControls._dialog.hide();
    },

    leaveAdhoc: function() {
        document.location = buildActionUrl({_flowId:'homeFlow'});
    },

    refreshAdhocDesigner: function() {
        
        var callback = function(state) {
            localContext.standardOpCallback(state);
            adhocDesigner.filtersController.setFilters(state, {reset : true});
        };

        designerBase.sendRequest("co_loadState", [], callback);
    },

    requestFilterAction: function(callback, action, opts, postData) {
        var urlData = {_flowId: 'adhocAjaxFilterDialogFlow', clientKey: clientKey, decorate: 'no'};
        urlData[action] = 'true';

        var url = buildActionUrl(urlData);

        var options =  Object.extend({
            postData: postData,
            callback: callback,
            mode: AjaxRequester.prototype.EVAL_JSON,
            errorHandler: baseErrorHandler
        }, opts);

        ajaxTargettedUpdate(url, options);
    },

    setFilters: function(callback) {
        adhocControls.requestFilterAction(callback, 'setFilters');
    },

    forceFilterAction:function (postData) {
        adhocControls.requestFilterAction(function (ajax) {
            if (ajax === 'success') {
                adhocControls.refreshAdhocDesigner();
                adhocControls.hideDialog && adhocControls.closeDialog();
            }
        }, 'setFilters', null, postData);
    },

    setFocusOnFirstInputControl: function() {
        if (typeof firstInputControlName != 'undefined' && firstInputControlName) {
            var inputOrSelect = $(firstInputControlName);
            if (inputOrSelect) {
                inputOrSelect.focus();
            }
        }
    },

    /**
     * Checks whether input controls data has been changed AND
     * whether saveAsDefault checkbox has been changed.
     */
    isSelectionChanged: function() {
        return JRS.Controls.ViewModel.isSelectionChanged(
            adhocControls.getControlsLastSelection(), adhocControls.getControlsSelection()) ||
            adhocControls.getSaveAsDefaultCheckboxLastValue() != adhocControls.isSaveAsDefaultCheckbox();
    },

    setSaveAsDefaultCheckbox: function(check) {
        check ? adhocControls.filterSaveAsCheckbox.prop('checked', true)
              : adhocControls.filterSaveAsCheckbox.removeAttr('checked');
    },

    isSaveAsDefaultCheckbox: function() {
        return adhocControls.filterSaveAsCheckbox.is(":checked");
    },

    getControlsSelection: function() {
        return adhocControls.viewModel.get('selection');
    },

    restoreDialogLastSelection: function() {
        adhocControls.controlsController.update(adhocControls.lastSelection.controlsData);
        adhocControls.setSaveAsDefaultCheckbox(adhocControls.lastSelection.saveAsDefault);
    },

    saveDialogLastSelection: function(selectedData, saveAsDefaultChecked) {
        adhocControls.lastSelection.controlsData = selectedData;
        adhocControls.lastSelection.saveAsDefault = saveAsDefaultChecked;
    },

    getControlsLastSelection: function() {
        return adhocControls.lastSelection.controlsData;
    },

    getSaveAsDefaultCheckboxLastValue: function () {
        return adhocControls.lastSelection.saveAsDefault;
    }
};
