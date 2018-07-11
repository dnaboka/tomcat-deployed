/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

var TopBottomFilterDialog,
    Backbone;
require(["adhoc/TopBottomFilterDialog", "backbone"],
    function (dialog, backbone) {
        TopBottomFilterDialog = dialog;
        Backbone = backbone;
    });

AdHocCrosstab.showCrosstabMenu = function(evt, contextLevel){
    adhocDesigner.showDynamicMenu(evt, contextLevel, null, function(context, model) {
        context = AdHocCrosstab.updateContextMenuWithSiblingLevels(context, model);
        return AdHocCrosstab.generateAvailableSummaryCalculationsMenu(context, model);
    });
};

AdHocCrosstab.addFieldToXtab = function(dragged, dropped, evt) {
    var dropSection = evt.element();

    if(!dropSection){
        return;
    }

    var dropSectionAxis = matchMeOrUp(dropSection, localContext.DM_AXIS_LIST_PATTERN);
    if (!dropSectionAxis) {
        return;
    }

    var dropSectionAxisId = $(dropSectionAxis).identify();
    if(dropSectionAxisId.startsWith(localContext.OLAP_COLUMNS_ID)){
        AdHocCrosstab.appendDimensionToColumnAxisWithLevel();
    }else if(dropSectionAxisId.startsWith(localContext.OLAP_ROWS_ID)){
        AdHocCrosstab.appendDimensionToRowAxisWithLevel();
    }
};

AdHocCrosstab.processFieldAsColumnGroup = function(element, regex, xIndex){
    var index = xIndex;
    var position = null;
    var elementId = element.identify();
    if(elementId.startsWith("colGroupHeaderRow_") || elementId.startsWith("colGroupHeader_")){
        try {
            position = regex.exec(elementId)[0];
            index = parseInt(position) + 1;
        } catch(e) {
            //unexpected error.
        }
    }
    AdHocCrosstab.addFieldAsColumnGroup(index);
};

AdHocCrosstab.processFieldAsMeasure = function(element, regex, xIndex){
    var index = xIndex;
    var position = null;
    var elementId = element.identify();
    if(elementId.startsWith("measureHeader_")){
        try {
            position = regex.exec(elementId)[0];
            index = parseInt(position) + 1;
        } catch(e) {
            //unexpected error.
        }
    }else if (element.nodeName == "A" || element.nodeName == "LI"){
        if(element.nodeName == "A" ){
            element = element.up("li.leaf");
        }
        if(element){
            index = $(element).previousSiblings().length;
        }
    }
    addFieldAsMeasure(index, true);
};

AdHocCrosstab.processFieldAsRowGroup = function(element, regex, xIndex){
    var index = xIndex;
    var position = null;
    var elementId = element.identify();
    if(elementId.startsWith("rowGroup_") || elementId.startsWith("rowGroupHeader_")){
        try {
            position = regex.exec(elementId)[0];
            index = parseInt(position) + 1;
        } catch(e) {
            //unexpected error.
        }
    }
    AdHocCrosstab.addFieldAsRowGroup(index);
};

AdHocCrosstab.moveRowGroupLeft = function(customCallback) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var fromGroup = AdHocCrosstab.getSelectedDimensionIndex(object);
    var toGroup = fromGroup-1;
    AdHocCrosstab.moveRowGroup(fromGroup, toGroup, customCallback);
};

AdHocCrosstab.moveRowGroupRight = function(customCallback) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var fromGroup = AdHocCrosstab.getSelectedDimensionIndex(object);
    var toGroup=fromGroup + 1;
    AdHocCrosstab.moveRowGroup(fromGroup, toGroup, customCallback);
};

AdHocCrosstab.moveColumnGroupLeft = function(customCallback) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var fromGroup = AdHocCrosstab.getSelectedDimensionIndex(object);
    var toGroup = fromGroup-1;
    AdHocCrosstab.moveColumnGroup(fromGroup, toGroup, customCallback);
};

AdHocCrosstab.moveColumnGroupRight = function(customCallback) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var fromGroup = AdHocCrosstab.getSelectedDimensionIndex(object);
    var toGroup=fromGroup + 1;
    AdHocCrosstab.moveColumnGroup(fromGroup, toGroup, customCallback);
};

AdHocCrosstab.moveMeasureLeft = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    AdHocCrosstab.moveMeasure(object.level, object.index - 1);
};

AdHocCrosstab.moveMeasureRight = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    AdHocCrosstab.moveMeasure(object.level, object.index + 1);
};

AdHocCrosstab.moveRowGroupOnDrag = function(){
    draggingMoveOverIndex = parseInt(draggingMoveOverIndex);
    currentlyDraggingIndex = parseInt(currentlyDraggingIndex);

    if (currentlyDraggingIndex != draggingMoveOverIndex) {
        if (currentlyDraggingIndex >= 0 && draggingMoveOverIndex >= 0) {
            AdHocCrosstab.moveRowGroup(currentlyDraggingIndex, draggingMoveOverIndex);
        } else if (draggingMoveOverIndex == -1) {
            AdHocCrosstab.removeRowGroup(currentlyDraggingIndex);
        }
    }
};

AdHocCrosstab.hideLevel = function(customCallback) {
    var dimAndLevel = getDimensionWithLevelFromSelection();
    if(selectionCategory.area === designerBase.COLUMN_GROUP_MENU_LEVEL){
        AdHocCrosstab.hideColumnLevel(dimAndLevel.dimensionId, dimAndLevel.level);
    } else if(selectionCategory.area === designerBase.ROW_GROUP_MENU_LEVEL){
        AdHocCrosstab.hideRowLevel(dimAndLevel.dimensionId, dimAndLevel.level);
    }
};

AdHocCrosstab.showLevel = function(customCallback) {
    var dimAndLevel = AdHocCrosstab.getDimensionWithLevelFromSelection();
    if(selectionCategory.area === designerBase.COLUMN_GROUP_MENU_LEVEL){
        AdHocCrosstab.showColumnLevel(dimAndLevel.dimensionId, dimAndLevel.level);
    } else if(selectionCategory.area === designerBase.ROW_GROUP_MENU_LEVEL){
        AdHocCrosstab.showRowLevel(dimAndLevel.dimensionId, dimAndLevel.level);
    }
};

AdHocCrosstab.moveColumnGroupDown = function(customCallback) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var fromGroup = AdHocCrosstab.getSelectedDimensionIndex(object);
    var toGroup=fromGroup + 1;
    AdHocCrosstab.moveColumnGroup(fromGroup, toGroup, customCallback);
};

AdHocCrosstab.moveColumnGroupUp = function(customCallback) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var fromGroup = AdHocCrosstab.getSelectedDimensionIndex(object);
    var toGroup=fromGroup - 1;
    AdHocCrosstab.moveColumnGroup(fromGroup, toGroup, customCallback);
};

AdHocCrosstab.moveColumnGroupOnDrag = function(){
    draggingMoveOverIndex = parseInt(draggingMoveOverIndex);
    currentlyDraggingIndex = parseInt(currentlyDraggingIndex);

    if (currentlyDraggingIndex != draggingMoveOverIndex) {
        if (currentlyDraggingIndex >= 0 && draggingMoveOverIndex >= 0) {
            AdHocCrosstab.moveColumnGroup(currentlyDraggingIndex, draggingMoveOverIndex);
        } else if (draggingMoveOverIndex == -1) {
            AdHocCrosstab.removeColumnGroup(currentlyDraggingIndex);
        }
    }
};

AdHocCrosstab.moveMeasureOnDrag = function(){
    draggingMoveOverIndex = parseInt(draggingMoveOverIndex);
    currentlyDraggingIndex = parseInt(currentlyDraggingIndex);

    if (currentlyDraggingIndex != draggingMoveOverIndex) {
        if (currentlyDraggingIndex >= 0 && draggingMoveOverIndex >= 0) {
            AdHocCrosstab.moveMeasure(currentlyDraggingIndex, draggingMoveOverIndex);
        } else if (draggingMoveOverIndex == -1) {
            AdHocCrosstab.removeMeasure(currentlyDraggingIndex);
        }
    }
};

AdHocCrosstab.retrieveOverflowRowGroups = function(){
    var proceed = confirm(adhocDesigner.getMessage("overflowConfirmMessage"));
    if(proceed){
        AdHocCrosstab.getOverflowRowGroups();
    }
};

AdHocCrosstab.retrieveOverflowColumnGroups = function(){
    var proceed = confirm(adhocDesigner.getMessage("overflowConfirmMessage"));
    if(proceed){
        AdHocCrosstab.getOverflowColumnGroups();
    }
};

AdHocCrosstab.selectMeasureMask = function(mask){
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        var index = selObjects.first().index;
        AdHocCrosstab.setMask(mask, index);
    }
};

AdHocCrosstab.selectFunction = function(newFunction) {
    var measure = AdHocCrosstab.getSelectedMeasure(), selected = selObjects.first();
    if(measure){
        var type = adhocDesigner.getSuperType(measure.type);
        var newType = AdHocCrosstab.getMeasureTypeByFunction(newFunction);
        if(type !== newType){
            AdHocCrosstab.setSummaryFunctionAndMask(newFunction, defaultMasks[newType], selected.index);
        }else{
            AdHocCrosstab.setSummaryFunction(newFunction, selected.index);
        }
    }
};

AdHocCrosstab.selectTimeFunction = function(newFunction) {
    var measure = AdHocCrosstab.getSelectedMeasure(), selected = selObjects.first();
    if(measure){
        var type = adhocDesigner.getSuperType(measure.type);
        var newType = AdHocCrosstab.getMeasureTypeByFunction(newFunction);

        AdHocCrosstab.setSummaryTimeFunction(newFunction, selected.index);
    }
};

AdHocCrosstab.selectedMeasureShowsSummaryOptions = function() {
    return !!AdHocCrosstab.getSelectedMeasure();
};

AdHocCrosstab.selectedMeasureShowsNumericSummaryOptions = function() {
    return (localContext.selectedMeasureShowsSummaryOptions() && localContext.isSelectedMeasureNumeric());
};

AdHocCrosstab.setCatForColumnGroup = function(catName) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    if(object && AdHocCrosstab.isColumnGroupSelected(object)){
        AdHocCrosstab.setCategoryForColumnGroup(catName, object.groupIndex);
    }
};

AdHocCrosstab.setCatForRowGroup = function(catName) {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    if(object && AdHocCrosstab.isRowGroupSelected(object)){
        AdHocCrosstab.setCategoryForRowGroup(catName, object.groupIndex);
    }
};

///////////////////////////////////////////////////////////////
// Action model functions
///////////////////////////////////////////////////////////////

AdHocCrosstab.appendDimensionWithLevel = function(level, axis){
    var meta = level ?
        localContext.getAvailableFieldsNodeBySelection(level.id, level.groupId) :
        localContext.getAvailableFieldsNodeBySelection();
    meta.axis = axis;
    if (AdHocCrosstab.showAddHierarchyConfirm(meta.hierarchyName, meta.dimensionId, function() {
        jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItem', meta);
    })) {
        return;
    }
    jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItem', meta);
};

AdHocCrosstab.appendDimensionToRowAxisWithLevel = function(level){
    AdHocCrosstab.appendDimensionWithLevel(level, "row");
};

AdHocCrosstab.appendDimensionToColumnAxisWithLevel = function(level){
    AdHocCrosstab.appendDimensionWithLevel(level, "column");
};

AdHocCrosstab.appendMeasureToRow = function(name) {
    var meta = name ?
        localContext.getAvailableFieldsNodesBySelection(name) :
        localContext.getAvailableFieldsNodesBySelection();
    jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItems',
        {axis : 'row', levels : meta, index : meta[0].index});
};

AdHocCrosstab.appendMeasureToColumn = function(name) {
    var meta = name ?
        localContext.getAvailableFieldsNodesBySelection(name) :
        localContext.getAvailableFieldsNodesBySelection();
    jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:addItems',
        {axis : 'column', levels : meta, index : meta[0].index});
};

AdHocCrosstab.removeLevelFromRow = function() {
    var meta = localContext.getSelectedObject();
    jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:removeItem',
        {axis : 'row', index : meta.index, item : {level : meta.level, dimensionId : meta.dimensionId, isMeasure : meta.isMeasure}});
};

AdHocCrosstab.removeLevelFromColumn = function() {
    var meta = localContext.getSelectedObject();
    jQuery('#' + adhocDesigner.DISPLAY_MANAGER_ID).trigger('lm:removeItem',
        {axis : 'column', index : meta.index, item : {level : meta.level, dimensionId : meta.dimensionId, isMeasure : meta.isMeasure}});
};

AdHocCrosstab.selectedGroupCanShowSummary = function(){
    var group = AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup()),
        parentGroup = AdHocCrosstab.getGroupParent(group);
    if (!parentGroup){
        return !AdHocCrosstab.selectedGroupHasSummary();
    }else{
        return parentGroup.expanded === true && !AdHocCrosstab.selectedGroupHasSummary();
    }
};

AdHocCrosstab.selectedColumnGroupCanHideSummary = function(){
    var canHideSummary = AdHocCrosstab.canHideSummariesForColumnGroup(),
        group = AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup()),
        parentGroup = AdHocCrosstab.getGroupParent(group);
    if(canHideSummary){
        if (!parentGroup){
            return AdHocCrosstab.selectedGroupHasSummary();
        }else{
            return parentGroup.expanded === true && AdHocCrosstab.selectedGroupHasSummary();
        }
    }
    return false;
};

AdHocCrosstab.selectedRowGroupCanHideSummary = function(){
    var canHideSummary = AdHocCrosstab.canHideSummariesForRowGroup();
    if(canHideSummary){
        return AdHocCrosstab.selectedGroupHasSummary();
    }
    return false;
};

AdHocCrosstab.getGroupParent = function(group) {
    var parentIndex = -1,
        parent;

    localContext.state.columnGroups.detect(function(el, i) {
        if (el.name === group.name) {
            parentIndex = i - 1;
            return parentIndex;
        }
    });

    if (parentIndex >= 0) {
        parent =  localContext.state.columnGroups[parentIndex];
    }
    return parent;
};

AdHocCrosstab.selectedGroupHasSummary = function(){
    var group = AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup());
    if(group){
        return group.isShowingSummary === true;
    }
    return false;
};

AdHocCrosstab.selectedRowGroupIsCollapsible = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object && object.expandable;
};

AdHocCrosstab.selectedColumnGroupIsCollapsible = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object && object.expandable;
};

AdHocCrosstab.topBottomNFilteringClicked = function(type) {
    var selection = selObjects[0],
        currentTopBottomNFilter = AdHocCrosstab.getTopBottomFilter(),
        isSameColumnSelected = currentTopBottomNFilter && selection.path === currentTopBottomNFilter.path,
        options = {
            type: type,
            limit: isSameColumnSelected ? currentTopBottomNFilter.limit : 5,
            aggregateUnranked: isSameColumnSelected ? currentTopBottomNFilter.aggregateUnranked : true,
            applyAcrossGroups: isSameColumnSelected ? currentTopBottomNFilter.applyAcrossGroups : false
        };

    if (type !== 'none') {
        new TopBottomFilterDialog({
            model: new Backbone.Model(options),
            ok: function(options) {
                AdHocCrosstab.applyTopBottomNFiltering({
                    //backend understand "asc" or "desc" instead of "bottom" and "top"
                    type: type === "top" ? "desc" : "asc",
                    limit: options.limit,
                    aggregateUnranked: options.aggregateUnranked,
                    applyAcrossGroups: options.applyAcrossGroups
                })
            }
        }).open();
    } else if (isSameColumnSelected && type !== currentTopBottomNFilter.type) {
        AdHocCrosstab.applyTopBottomNFiltering({
            type: type,
            limit: 0,
            aggregateUnranked: false,
            applyAcrossGroups: false
        })
    }
};