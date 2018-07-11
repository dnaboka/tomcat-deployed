/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

/*
 * Tests for add
 */
AdHocTable.canAddFieldAsColumn = function(fieldName) {
    // according to the bug #29466 duplicated fields are allowed
    return true;
};

AdHocTable.isSpacer = function(fieldName){
    return fieldName == designerBase.SPACER_NAME;
};

AdHocTable.canAddAsColumn = function() {
    return _.all(selObjects, function(node) {

        if (!node.param) {
            return false;
        }

        return AdHocTable.canAddFieldAsColumn(node.param.id);
    });
};
/*
 * Tests for move
 */
AdHocTable.canMoveColumnsLeft = function(){
    return AdHocTable.getLeftMostPositionFromSelectedColumns() > 0;
};

AdHocTable.canMoveColumnsRight = function(){
    return AdHocTable.getRightMostPositionFromSelectedColumns() < (AdHocTable._getTableHeaders().length - 1);
};

AdHocTable.canAddFilter = function (object, errorMessages) {
    if (adhocDesigner.isSpacerSelected(object)) {
        errorMessages && errorMessages.push(addFilterErrorMessageSpacerAdd);
        return false;
    }
    if (adhocDesigner.isPercentOfParentCalcSelected(object)) {
        errorMessages && errorMessages.push(addFilterErrorMessagePercentOfParentCalcFieldAdd);
        return false;
    }
    if (adhocDesigner.isConstantSelected(object)) {
        errorMessages && errorMessages.push(addFilterErrorMessageConstantAdd);
        return false;
    }
    if (adhocDesigner.isMeasureSelected(object)) {
        errorMessages && errorMessages.push(addFilterErrorMessageMeasureAdd);
        return false;
    }

    return true;
};

/*
 * Used to get the left position of the selected object
 */
AdHocTable.getLeftMostPositionFromSelectedColumns = function(){
    var size = selObjects.length;
    if (size > 0) {
        var object = adhocDesigner.getSelectedColumnOrGroup();
        var left = object.index;
        for (var index = 1; index < size; index++) {
            var l = selObjects[index].index;
            if (l < left) {
                left = l;
            }
        }
        return parseInt(left);
    }
    return -1;
};
/*
 * Used to get the right most position of the selected column
 */
AdHocTable.getRightMostPositionFromSelectedColumns = function(){
    var size = selObjects.length;
    if (size > 0) {
        var object = adhocDesigner.getSelectedColumnOrGroup();
        var right = object.index;
        for (var index = 1; index < size; index++) {
            var r = selObjects[index].index;
            if (r > right) {
                right = r;
            }
        }
        return parseInt(right);
    }
    return -1;
};
/*
 * Column resize helper
 */
AdHocTable.getNewColumnWidth = function(element, index){
    var $dragger = jQuery(element);
    var $headerCell = jQuery(localContext._getTableHeaders()[index]);
    /*
     * left of dragger - left of cell == new width of cell/column
     */
    var leftOfDragger =  $dragger.offset().left;
    var leftOfCellHeader = $headerCell.offset().left;
    return Math.max(leftOfDragger - leftOfCellHeader, AdHocTable.MINIMUM_COL_WIDTH);
};

/**
 * Set width of the column
 *
 * @param index
 */
AdHocTable.setColumnWidth = function(index, width) {
    var $colGroupCol = jQuery("#canvasTableCols col").eq(index);
    $colGroupCol.width(width);

    var $headerCell = jQuery(localContext._getTableHeaders()[index]);
    $headerCell.css({minWidth: Number(width)});

    return $headerCell[0];
};

/*
 * Check to see if the column type is equal to the type passed
 */
AdHocTable.isSelectedColumnType = function(type){
    return localContext.getSelectedColumnType() == type;
};
/*
 * Used to get the datatype for the column
 */
AdHocTable.getSelectedColumnType = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object ? object.model.numericType : adhocDesigner.NaN;
};
/*
 * Tests ran by AdHocTable.shouldFetchMoreRows
 */
AdHocTable.hasColumns = function(){
    var hasCols = false;
    AdHocTable.theCols = $("canvasTableCols").getElementsByTagName("col");
    if(AdHocTable.theCols){
        hasCols = (AdHocTable.theCols.length > 0);
    }
    return hasCols;
};
AdHocTable.hasGroups = function(){
    return localContext.state.groups.length > 0;
};
/*
 * Test to see if we are currently getting more rows
 */
AdHocTable.isFetchingRows = function() {
    return AdHocTable.fetchingRows;
};
/*
 * Test to see if we are fetching more rows
 */
AdHocTable.shouldFetchMoreRows = function() {
    return ((AdHocTable.hasColumns() || AdHocTable.hasGroups())
            && (localContext.state.isShowingFullData && !localContext.state.endOfFile)
            && (AdHocTable.theRows.length < adhocDesigner.ROW_SIZE_TO_TRIGGER_SCROLLBAR));
};
/*
 * Test to fetch more rows
 */
AdHocTable.tableScrolled = function() {
    if ((localContext.getMode() === designerBase.TABLE) && localContext.state.isShowingFullData
            && !localContext.state.endOfFile  && !AdHocTable.isFetchingRows()) {

        var scrolledToBottom = isIPad() ?
            adhocDesigner._touchController.isBottom() : isAlmostInView(AdHocTable.theRows[AdHocTable.lastRow],AdHocTable.ALMOST_IN_VIEW_OFFSET);
        scrolledToBottom && localContext.fetchMoreRows();
    }
};

AdHocTable.isTotalsOnly  = function() {
    var table = localContext.state.table;
    return table.showTableTotals && !table.showTableDetails;
};

AdHocTable.selectedColumnCanAddSummary = function() {
    return !AdHocTable.isTotalsOnly() && !adhocDesigner.hasSpacerInSelection() && !AdHocTable.selectedColumnHasSummary();
};

AdHocTable.selectedColumnCanRemoveSummary = function() {
    return !AdHocTable.isTotalsOnly() && AdHocTable.selectedColumnHasSummary();
};

/*
 * Used to test if the column has a selected summary
 */
AdHocTable.selectedColumnHasSummary = function(){
    // In Totals Only we track summaries as Data so we don't want to remove or add them.
    if(selObjects.length !== 1){
        return false;
    }else{
        var column = localContext.state.columns[designerBase.getSelectedObject().index];
        return column.showSummary;
    }
};

AdHocTable.selectedColumnShowsSummaryOptions = function(){
    return AdHocTable.selectedColumnHasSummary() && AdHocTable.selectedMeasureShowsSummaryOptions();
};

AdHocTable.selectedMeasureShowsSummaryOptions = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    if(object){
        return !!localContext.state.columns[object.index];
    }
    return false;
};

AdHocTable.isSelectedMeasureNumeric = function(){
    return AdHocTable.isSelectedColumnType("int") || AdHocTable.isSelectedColumnType("dec");
};

AdHocTable.isSelectedSummaryFunction = function(thisFunction){
    var cell = actionModel.selObjects[0];
    return cell && cell.summaryFunction === thisFunction;
};

AdHocTable.isSelectedTimeSummaryFunction = function(thisFunction){
    var cell = actionModel.selObjects[0];
    return cell && cell.summaryTimeFunction === thisFunction;
};

AdHocTable.functionSelected = function(thisFunction){
    if(selObjects.length > 0){
        var index = designerBase.getSelectedObject().index;
        localContext.setSummaryFunction(thisFunction, index);
    }
};

AdHocTable.timeFunctionSelected = function(thisFunction){
    if(selObjects.length > 0){
        var index = designerBase.getSelectedObject().index;
        localContext.setTimeSummaryFunction(thisFunction, index);
    }
};

/*
 * check to see if the selected object has be used in sorting.
 */
AdHocTable.selectedFieldUsedForSorting = function() {
    var selectedObject = designerBase.getSelectedObject();
    var fieldName = adhocDesigner.getNameForSelected(selectedObject);
    return AdHocTable.usedInSorting(fieldName);
};
/*
 * Test to see if the field can be used for sorting.
 */
AdHocTable.selectedFieldCouldBeUsedForSorting = function() {
    return !(adhocDesigner.hasSpacerInSelection() ||
            adhocDesigner.hasGroupInSelection() ||
            AdHocTable.selectedFieldUsedForSorting() ||
            designerBase.isSelectedNodeAFolder() ||
            adhocDesigner.isAggregateSelected());
};
/*
 * Test to see if the column is being used for sorting
 */
AdHocTable.selectedColumnUsedForSorting = function(){
    if(!localContext.state.inDesignView){
        return false;
    }
    return selObjects.any(function(column){
        return AdHocTable.usedInSorting(column.model.name);
    });
};

AdHocTable.selectedColumnCouldBeUsedForSorting = function(){
    if(!localContext.state.inDesignView){
        return false;
    }
    return !AdHocTable.selectedColumnUsedForSorting() && !adhocDesigner.hasSpacerInSelection() && !adhocDesigner.isAggregateSelected();
};
/*
 * Used to test if a field is being used in sorting.
 */
AdHocTable.usedInSorting = function(fieldName){
    if (localContext.state.sortFields != null) {
        var sfs = localContext.state.sortFields;
        for (var i = 0; i < sfs.length; i++) {
            if (sfs[i].name == fieldName) {
                return true;
            }
        }
    }
    return false;
};
AdHocTable.canAddAsGroup = function() {
	if(selObjects[0]){
		if(selObjects[0].parent && selObjects[0].parent.treeId == 'measuresTree') return false;
	}
    return !(adhocDesigner.hasSpacerInSelection() ||
            adhocDesigner.multiSelect ||
            adhocDesigner.isSelectedTreeNodeAFolder() ||
            adhocDesigner.isPercentOfParentCalcSelected());
};

AdHocTable.canSwitchToGroup = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object && object.ftype === "dimension";
};

AdHocTable.canMoveGroupUp = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object && (object.index) > 0;
};

AdHocTable.canMoveGroupDown = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var numberOfGroups = localContext.state.groups.length;
    return object && (object.index) < (numberOfGroups - 1);
};

AdHocTable.isSelectedGroupType = function(type){
    return AdHocTable.getSelectedGroupType() === type;
};


AdHocTable.getSelectedGroupType = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object ? object.dataType : adhocDesigner.NaN;
};

AdHocTable.canAddGroupLabelToSelected = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    if (object) {
        var label = object.label;
        return label.blank();
    }
    return false;
};

AdHocTable.canGroupSetMask = function(){
    return AdHocTable.getSelectedGroupType() != adhocDesigner.NaN;
};

AdHocTable.isGroupMaskSelected =  function(mask){
    return AdHocTable.getMaskForSelectedGroup() == mask.unescapeHTML();
};

AdHocTable.isSelectedGridMode = function(mode) {
    var tableState = localContext.state.table;
    switch(mode) {
        case 'd' : return tableState.showTableDetails && !tableState.showTableTotals;
        case 't' : return !tableState.showTableDetails && tableState.showTableTotals;
        case 'dt' : return tableState.showTableDetails && tableState.showTableTotals;
        default : throw 'Unknown Grid Selector Mode: ' + mode;
    }
};

AdHocTable.getMaskForSelectedGroup = function(){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return object && object.mask;
};

AdHocTable.canColumnSetMask = function() {
    return (localContext.getSelectedColumnType() != adhocDesigner.NaN);
};
/**
 * Test to see if the selected mask is equal to the mask passed
 * @param mask
 */
AdHocTable.isColumnMaskSelected = function(mask){
    return AdHocTable.getMaskForSelectedColumn() === mask.unescapeHTML();
};
/*
 * Used to get the current mask for the selected column
 */
AdHocTable.getMaskForSelectedColumn = function(){
    return adhocDesigner.getSelectedColumnOrGroup().header.getAttribute("data-mask");
};

/*
 * Used to test if we can edit a column header
 */
AdHocTable.canEditColumnHeaderForSelected = function(){
    return !AdHocTable.selectedHasNoColumnHeader() && !adhocDesigner.hasSpacerInSelection();
};
/*
 * Used to test if we can add a column header
 */
AdHocTable.canAddColumnHeaderToSelected = function(){
    return AdHocTable.selectedHasNoColumnHeader() && !adhocDesigner.hasSpacerInSelection();
};
/*
 * Used to test if the current column has no header
 */
AdHocTable.selectedHasNoColumnHeader = function(){
    var headerObj = adhocDesigner.getSelectedColumnOrGroup();
    return (headerObj.header.hasClassName("deletedHeader"));
};

AdHocTable.getTableTop = function() {
    var canvasTableEl = jQuery('#canvasTable');
    var captionHeight = canvasTableEl.find('.caption').height();

    return canvasTableEl.position().top + captionHeight + "px";
};

AdHocTable.getTableHeight = function() {
    var canvasTableEl = jQuery('#canvasTable');
    var tbodys = canvasTableEl.find("tbody");

    return tbodys.first().height() + tbodys.last().height() + 2 + "px";
};
