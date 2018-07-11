/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* global localContext, designerBase, isDesignView, encodeText, adhocControls */

//////////////////////////////////////////////////////////
//Report state
//////////////////////////////////////////////////////////
/*
 * save in a temp location, then when your call returns, launch a new window to view the report
 * the saveTemp method will put the ARU path in the session
 *
 * NOTE: this runs the report in a window named "jr". The first time you run a report it should open a new window,
 * 		but the next time, it will reuse that window.
 * 		There was a bug where if you used the window named "jr", the report would show up in
 * 		the current window but there was no way to get back.
 * 		I`m fixing this by forcing the current window to have a blank name.
 * 		Nothing except this code relies upon window names, but it might be confusing if someone does
 */

define(function(require) {

    var adhocDesigner = require("adhoc/designer");

    adhocDesigner.ajaxActionPrefix = {
        table:'co',
        crosstab:'cr',
        olap_crosstab:'cr',
        chart: 'ch',
        ichart: 'ich',
        olap_ichart: 'ich'
    };

    adhocDesigner.getControllerPrefix = function() {
        return adhocDesigner.ajaxActionPrefix[localContext.getMode()];
    };

    adhocDesigner.loadState = function(initCallback) {
        designerBase.sendRequest(adhocDesigner.getControllerPrefix() + "_loadState", [], function(state) {
            localContext.setMode(state.viewType);
            adhocControls.initialize(state);

            adhocDesigner.updateStateAndRender(state);

            adhocDesigner.initFieldsPanel(true);

            if (isDesignView) {
                adhocDesigner.dimensionsTree.showTree(adhocDesigner._AVAILABLE_TREE_DEPTH);
                adhocDesigner.measuresTree.showTree(adhocDesigner._AVAILABLE_TREE_DEPTH);
            }

            adhocDesigner.filtersController.setFilters(state, {reset : true});
        });
    };

    adhocDesigner.updateTrees = function () {
        if (!isDesignView) {
            return;
        }
        designerBase.sendRequest(adhocDesigner.getControllerPrefix() + "_updateAvailableTree", [], function () {
            adhocDesigner.dimensionsTree.showTree(adhocDesigner._AVAILABLE_TREE_DEPTH);
            adhocDesigner.measuresTree.showTree(adhocDesigner._AVAILABLE_TREE_DEPTH);
        });
    };

    adhocDesigner.undo = function() {
        if (localContext.state.modeOnUndo && !localContext.state.modeOnUndo.blank() && (localContext.state.modeOnUndo != localContext.getMode())) {
            localContext.hide && localContext.hide();
            adhocDesigner.switchMode(localContext.state.modeOnUndo, "undo");
        } else {
            designerBase.sendRequest('co_undo', [], adhocDesigner.undoAndRedoCallback);
        }
    };

    adhocDesigner.undoAll = function() {
        if(localContext.state.undoModeNames.length > 0 && localContext.state.undoModeNames[0] !== localContext.getMode()){
            localContext.hide && localContext.hide();
            adhocDesigner.switchMode(localContext.state.undoModeNames[0], "undoAll");
        }else{
            designerBase.sendRequest('co_undoAll', [], adhocDesigner.undoAndRedoCallback);
        }
    };

    adhocDesigner.redo = function() {
        if (localContext.state.modeOnRedo && !localContext.state.modeOnRedo.blank() && (localContext.state.modeOnRedo != localContext.getMode())) {
            localContext.hide && localContext.hide();
            adhocDesigner.switchMode(localContext.state.modeOnRedo, "redo");
        } else {
            designerBase.sendRequest('co_redo', [], adhocDesigner.undoAndRedoCallback);
        }
    };

    adhocDesigner.switchMode = function(requestedMode, undoOrRedo){
        var params = ["_mode=" + requestedMode];

        if (undoOrRedo) {
            params.push("undoOrRedo=" + undoOrRedo);
        }

        var switchModeCallback = function(state){
            var newMode = state.viewType;
            undoOrRedo && adhocDesigner.selectDisplayModeTab(newMode);
            adhocDesigner.initComponents(newMode);
            adhocDesigner.undoAndRedoCallback(state);
        };

        if (localContext.cleanupOnSwitch) {
            localContext.cleanupOnSwitch();
        }

        designerBase.sendRequest(adhocDesigner.getControllerPrefix() + '_switchMode', params, switchModeCallback);
    };

    adhocDesigner.selectDisplayModeTab = function(mode) {
        jQuery("#displayMode > li").each(function(){
            if (jQuery(this).attr("id").startsWith(mode)) {
                jQuery(this).addClass("selected");
            } else {
                jQuery(this).removeClass("selected");
            }
        });
    };

    //////////////////////////////////////////////////////////
    //Report attributes and options
    //////////////////////////////////////////////////////////
    adhocDesigner.updateReportTitle = function(currentTitle) {
        var controllerPrefix = adhocDesigner.getControllerPrefix();
        if(currentTitle.blank()){
            designerBase.sendRequest(controllerPrefix + '_setTitle', ['l=_null']);
        }else{
            designerBase.sendRequest(controllerPrefix + '_setTitle', ['l='+ encodeText(currentTitle)]);
        }
    };

    adhocDesigner.toggleTitleBar = function() {
        designerBase.sendRequest(adhocDesigner.getControllerPrefix() + '_toggleTitleBar', []);
    };

    adhocDesigner.setShowDisplayManager = function(show) {
        var callback = function(state){
            //do not need to update anything
            //localContext.standardOpCallback(state);
        };
        designerBase.sendRequest('co_toggleDisplayManager', new Array("name=showDisplayManager", "value=" + show), callback, null);
    };

    adhocDesigner.mergeCrosstabCells = function(merge) {
        var callback = function(state){
            localContext.standardOpCallback(state);
        };
        designerBase.sendRequest('cr_mergeCrosstabCells', ["merge=" + merge], callback, null);
    };

    adhocDesigner.toggleAdhocDataSetSize = function(setting) {
        var proceed = false;

        /*if(setting.startsWith("full") && !localContext.state.isShowingFullData){
            proceed = true;
        }else if(setting.startsWith("sample") && localContext.state.isShowingFullData){
            proceed = true;
        }*/

        var sizeOption= 'datasize='+setting;
        if(setting.startsWith("full") && localContext.state.isShowingFullData !== true){
            proceed = true;
        }else if(setting.startsWith("sample") && localContext.state.isShowingSampleData !== true){
            proceed = true;
        }else if(setting.startsWith("nodata") && localContext.state.isShowingNoData !== true){
            proceed = true;
        }

        if (proceed) {
            var callback = function(state) {
                adhocDesigner.updateStateAndRender(state);
                this.checkMaxRowsLimit();
            }.bind(adhocDesigner);

            designerBase.sendRequest('co_toggleAdhocDataSetSize', [sizeOption], callback);
        }
    };

    adhocDesigner.tryToKeepServerAlive = function(){
        var callback = function(state){
            localContext.standardOpCallback(state);
        };
        designerBase.sendRequest('co_tryToKeepServerAlive', [], callback, null);

    };

    adhocDesigner.setProperty = function(thisName, thisValue, callback) {
        designerBase.sendRequest('co_setProperty', ["name=" + thisName, "value=" + thisValue], callback);
    };

    adhocDesigner.changeFieldAttributeOrMeasure = function (fieldName, type) {
        designerBase.sendRequest('co_changeFieldAttributeOrMeasure', ['name=' + encodeText(fieldName), 'type=' + type]);
    };

    adhocDesigner.setFilter = function(filter) {
        designerBase.sendRequest('co_setFilter', ["testFilter="+filter]);
    };

    adhocDesigner.setSorting = function (sortFields, extra_callback){
        localContext.state.sortFields = sortFields;

        var sortJson = Object.toJSON(sortFields),
            escapedSortJson = encodeURIComponent(sortJson);
        var callback = function(state){
            adhocDesigner.updateStateAndRender(state);
            extra_callback();
        };

        designerBase.sendRequest('ta_resort', ['so=' + escapedSortJson], callback);
    };

    adhocDesigner.pivot = function() {
        localContext.pivot ? localContext.pivot() : designerBase.sendRequest(adhocDesigner.getControllerPrefix() + '_pivot', []);
    };

    //////////////////////////////////////////////////////////////////////////////////
    //Ajax callbacks..
    //////////////////////////////////////////////////////////////////////////////////
    adhocDesigner.undoAndRedoCallback = function(state) {
        adhocDesigner.updateTrees();
        adhocDesigner.updateStateAndRender(state);
        adhocDesigner.filtersController.setFilters(state, {reset : true});
    };

    adhocDesigner.updateStateAndRender = function(state) {
        adhocDesigner.updateState(state);
        adhocDesigner.render();
    };

    return adhocDesigner;
});
