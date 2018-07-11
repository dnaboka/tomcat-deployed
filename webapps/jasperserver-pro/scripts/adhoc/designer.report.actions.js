/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

define(function(require) {

    var adhocDesigner = require("adhoc/designer"),
        jrsConfigs = require("jrs.configs");

    /*
     * Used to return to adhoc start page
     * @param mode
     */
    adhocDesigner.goToTopicView = function(mode){
        var location = 'flow.html?_flowId=adhocFlow&_mode=' + mode +
            '&launchType=' + localContext.state.launchType +
            '&alreadyEditing=true';

        if (!jrsConfigs.initAdditionalUIComponents) {
            location += "&decorate=no";
        }

        if (window.isEmbeddedDesigner) {
            location += "&" + jQuery.param({
                embeddedDesigner: true,
                embeddedName: window.embeddedName,
                saveAsUri: window.embeddedSaveAsUri,
                saveAsOverwrite: window.embeddedSaveAsOverwrite
            });
        }

        document.location.href = location;
    };

    adhocDesigner.cancelAdHoc = function() {
        if (exists(localContext.isDashboard) && localContext.isDashboard) {
            gotoDefaultLocation();
            return;
        }
        if (usingAdhocLauncher&&(usingAdhocLauncher !== '')) {
            history.back();
        } else {
            this.redirectToTopicPage();
        }
    };

    adhocDesigner.cancelTopic = function(isAlreadyEditing) {
        if(isAlreadyEditing){
            history.back();
        }else{
            designerBase.redirectToHomePage();
        }
    };

    adhocDesigner.enableCanUndoRedo = function(){
        if (exists(toolbarButtonModule)) {
            toolbarButtonModule.setButtonState($('undo'), localContext.state.canUndo);
            toolbarButtonModule.setButtonState($('redo'), localContext.state.canRedo);
            toolbarButtonModule.setButtonState($('undoAll'), localContext.state.canUndo);
        }
    };

    adhocDesigner.enableRunAndSave = function(isEnabled){
        if (exists(toolbarButtonModule)) {
            toolbarButtonModule.setButtonState($('save'), isEnabled);
            toolbarButtonModule.setButtonState($('presentation'), isEnabled);
            toolbarButtonModule.setButtonState($('export'), isEnabled);
        }
        canRunAndSave = isEnabled;
    };

    adhocDesigner.canSaveAdhocReport = function(){
        return localContext.canSaveReport();
    };

    adhocDesigner.toggleDisplayManager = function(){

        if (adhocDesigner.isDisplayManagerVisible()) {
            jQuery("#" + adhocDesigner.DISPLAY_MANAGER_ID).addClass(layoutModule.HIDDEN_CLASS);
            adhocDesigner.setDisplayManagerVisible(false);
        } else {
            jQuery("#" + adhocDesigner.DISPLAY_MANAGER_ID).removeClass(layoutModule.HIDDEN_CLASS);
            adhocDesigner.setDisplayManagerVisible(true);
        }

        jQuery('#designer').trigger('layout_update');
        adhocDesigner.setShowDisplayManager(adhocDesigner.isDisplayManagerVisible());
    };

    adhocDesigner.isDisplayManagerVisible = function(){
        return localContext.state.showDisplayManager;
    };

    adhocDesigner.setDisplayManagerVisible = function(visible){
        localContext.state.showDisplayManager = visible;
    };

    adhocDesigner.isCrosstabCellsMerged = function() {
        return localContext.state.crosstab.mergeCrosstabCells;
    };

    adhocDesigner.exportReport = function(exportFormat) {
        // var exportForm = jQuery(adhocDesigner.EXPORT_FORM_PATTERN);
        // exportForm.attr("target", "_blank");
        // exportForm.find('input[name="exportFormat"]').val(exportFormat);
        // exportForm.submit();

        var url = "reportGenerator.html?action=displayTempReportUnit" +
            "&clientKey=" + encodeURIComponent(clientKey) +
            "&exportFormat=" + encodeURIComponent(exportFormat || "");

        jQuery.ajax(url, {
            type: 'GET',
            dataType: 'json',
            success: function(response, textStatus, jqXHR) {
                if (response.status === "OK") {
                    window.open(response.data, '_blank');
                } else {
                    dialogs.errorPopup.show(response.data.msg);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                dialogs.errorPopup.show("Unknown Error");
            }
        });
    };

    adhocDesigner.enableXtabPivot = function(canPivot){
        if (exists(toolbarButtonModule)) {
            toolbarButtonModule.setButtonState($('pivot'), canPivot);
        }
    };

    adhocDesigner.enableSort = function(canSort){
        if (exists(toolbarButtonModule)) {
            toolbarButtonModule.setButtonState($('sort'), canSort);
        }
    };

    adhocDesigner.toggleUseDomainLabels = function(){
        var useDomainLabels = !localContext.state.useDomainLabels
        var callback = function(state){
            localContext.standardOpCallback(state);
            if (adhocDesigner.isUseDomainLabels()) {
                dialogs.systemConfirm.show(adhocDesigner.getMessage("adhoc.designer.warn.use.domain.labels"), 5000);
            }

            adhocDesigner.updateTrees();
            adhocDesigner.filtersController.setFilters(state, {reset: true});
        };

        designerBase.sendRequest('co_toggleUseDomainLabels',
            ["name=useDomainLabels", "value=" + useDomainLabels], callback, null);

    };

    adhocDesigner.isUseDomainLabels = function(){
        return localContext.state.useDomainLabels;
    };

    return adhocDesigner;
});
