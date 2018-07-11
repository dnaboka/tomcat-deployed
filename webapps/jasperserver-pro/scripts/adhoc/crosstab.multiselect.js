/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

////////////////////////////////////////////////////////////////
// Crosstab multiselect Code.
////////////////////////////////////////////////////////////////

/**
 * Global variable
 *
 * crosstab constant state (updated in adHocScriptHeader.jsp)
 * xtabFilterMenu
 */
var crossTabMultiSelect = {};
crossTabMultiSelect.ROW_GROUP = "rowGroup";
crossTabMultiSelect.COL_GROUP = "colGroupHeaderRow";
crossTabMultiSelect.ROW_GROUP_LEVEL = "rowGroupLevel_";
crossTabMultiSelect.COl_GROUP_LEVEL = "colGroupLevel_";
crossTabMultiSelect.selectedCells = [];

/**
 * This function is a helper method used for selection
 * @param clickedCell cell selected..
 * @param e the event
 */
crossTabMultiSelect.selectXtabGroupMember = function(clickedCell, e) {
    clickedCell = $(clickedCell);
    var areaId = null;
    var axis = null;
    var memberObj = null;
    var groupType = null;
    var regex = new RegExp("\\d+");

    var clickedHeader = (clickedCell.tagName == "SPAN" && clickedCell.parentNode) || clickedCell;
	if (!clickedHeader) {
		areaId = null;
	}

    var id = $(clickedHeader).identify();
    var groupLevel = regex.exec(id)[0];

	
	if(id.startsWith(crossTabMultiSelect.ROW_GROUP)){
        areaId = crossTabMultiSelect.ROW_GROUP_LEVEL +  groupLevel;
        groupType = crossTabMultiSelect.ROW_GROUP;
        axis = 'row';
    }else if(id.startsWith(crossTabMultiSelect.COL_GROUP)){
        areaId = crossTabMultiSelect.COl_GROUP_LEVEL +  groupLevel;
        groupType = crossTabMultiSelect.COL_GROUP;
        axis = 'column';
    }

    if(areaId) {
        var ctrlKeyDown = null;
        var shiftKeyDown = null;
        //create select object
        var path = clickedCell.readAttribute("data-path"),
            tbFilter = AdHocCrosstab.getTopBottomFilter(),
            tbFilterType = tbFilter && tbFilter.path === path ? tbFilter.type : "none";

        memberObj = {
            id : clickedCell.identify(),
            path : path,
            value : clickedCell.readAttribute("data-fieldValue"),
            isSummary : clickedCell.readAttribute("data-isSummaryHeader"),
            isSliceable : clickedCell.readAttribute("data-sliceable") === "true",
            axis : axis,
            isInner : clickedCell.hasClassName('inner'),
            sorting : clickedCell.readAttribute("data-sorting"),
            level: clickedCell.readAttribute("data-levelname"),
            name: clickedCell.readAttribute("data-levelname"), // for filter compatibility
            topBottomFilter: tbFilterType
        };

        //checking for shift | control | command key event
        shiftKeyDown = isShiftHeld(e);
        //if the shift key is pressed do a multi-select from the last selected option to the next spot.
        if ((selectionCategory.area == areaId) && shiftKeyDown) {
            //get last selected item from area of selected object
            regex = new RegExp(/\d+$/);
            var lastSelectedCell = selObjects[selObjects.length - 1];

            if(lastSelectedCell){
                var lastSelectedCellIndex = parseInt(regex.exec(lastSelectedCell.id));
                var clickedCellIndex = parseInt(regex.exec(clickedCell.id));
                var numberOfCellToSelect = Math.abs(clickedCellIndex - lastSelectedCellIndex);
                var incrementing = (lastSelectedCellIndex < clickedCellIndex);

                if(crossTabMultiSelect.isObjectAlreadySelected(memberObj)){
                    adhocDesigner.removeSelectedObject(memberObj);
                }
                else{
                    for (var index = 0; index <= numberOfCellToSelect; index++) {
                        var codeIndex = (incrementing) ? (lastSelectedCellIndex + index) : (lastSelectedCellIndex - index);
                        // create new object for each item
                        var domObject = $(groupType + "_" + groupLevel + "_" + codeIndex);
                        if(domObject){
                            var newObject = {
                                id : domObject.identify(),
                                path : domObject.readAttribute("data-path"),
                                value : domObject.readAttribute("data-fieldValue"),
                                isSummary : domObject.readAttribute("data-isSummaryHeader"),
                                isSliceable : domObject.readAttribute("data-sliceable") === "true",
                                axis : axis,
                                isInner : domObject.hasClassName('inner'),
                                sorting : domObject.readAttribute("data-sorting"),
                                level: domObject.readAttribute("data-levelname"),
                                name: domObject.readAttribute("data-levelname"),
                                topBottomFilter: tbFilterType
                            };
                            designerBase.addToSelected(newObject);
                            crossTabMultiSelect.activateSelectedXtabCells();
                        }

                    }
                }
                selectionCategory.area = areaId;
            }
        }else {
            //control(PC) or command (Mac) selection

            /*
             * Things to note. This check is to prevent the selection of summary cells. In other words u cannot start
             * a selection on a summary cell. However, according to Tim & Angus, we should let summary cells be selected
             * if and only if <iff> they are part of a shift click selection. In other words a group multiselect.
             */
            if ($(clickedCell).getAttribute("data-isSummaryHeader") === "false") {
                ctrlKeyDown = isMetaHeld(e);
                //create select object
                memberObj = {
                    id : clickedCell.identify(),
                    path : clickedCell.readAttribute("data-path"),
                    value : clickedCell.readAttribute("data-fieldValue"),
                    isSummary : clickedCell.readAttribute("data-isSummaryHeader"),
                    isSliceable : clickedCell.readAttribute("data-sliceable") === "true",
                    axis : axis,
                    isInner : clickedCell.hasClassName('inner'),
                    sorting : clickedCell.readAttribute("data-sorting"),
                    level: clickedCell.readAttribute("data-levelname"),
                    name: clickedCell.readAttribute("data-levelname"),
                    topBottomFilter: tbFilterType
                };
                //check if selected. If it is deselect otherwise select it.
                if (crossTabMultiSelect.isObjectAlreadySelected(memberObj) && ctrlKeyDown) {
                    crossTabMultiSelect.removeSelectedObject(memberObj);

                } else {
                    if(!ctrlKeyDown || designerBase.shouldClearSelections(e, areaId)){
                        crossTabMultiSelect.deselectAllGroupMembers(e);
                        designerBase.unSelectAll();
                    }
                    designerBase.addToSelected(memberObj);
                    crossTabMultiSelect.activateSelectedXtabCells();
                    selectionCategory.area = areaId;
                }
            } else if (isRightClick(e)) {
                if (!crossTabMultiSelect.isObjectAlreadySelected(memberObj)) {
                    //Right click on summary header which is not in selection yet: deselect everything
                    crossTabMultiSelect.deselectAllGroupMembers();
                    designerBase.unSelectAll();
                    designerBase.addToSelected(memberObj);
                }
            }

        }
        actionModel.setSelected(selObjects);
    }
};

crossTabMultiSelect.selectXtabGroupLabel = function(groupLabel) {
    designerBase.unSelectAll();
    selectionCategory.area = groupLabel.axis === "column" ? designerBase.COLUMN_GROUP_MENU_LEVEL : designerBase.ROW_GROUP_MENU_LEVEL;
    actionModel.setSelected([groupLabel]);
    designerBase.addToSelected(groupLabel);
};

crossTabMultiSelect.isObjectAlreadySelected = function(obj){
    return designerBase.isObjectInSelection(obj, "id")
};

crossTabMultiSelect.removeSelectedObject = function(obj){
    crossTabMultiSelect.deactivateXtabCell(obj);
    var objectIndexToRemove = null;
    for(var index = 0; index < selObjects.length; index++){
        if(selObjects[index]["id"] == obj["id"]){
            objectIndexToRemove = index;
            break;
        }
    }
    selObjects = selObjects.without(selObjects[objectIndexToRemove]);
};

crossTabMultiSelect.activateSelectedXtabCells = function(){
    selObjects.each(function(object){
        crossTabMultiSelect.activateXtabCell(object);
    });
};

crossTabMultiSelect.activateXtabCell = function(object){
    if(object && object.id){
        var identifier = object.id;
        if(identifier.startsWith("colGroupHeaderRow") || identifier.startsWith("rowGroup")){
            if ($(identifier)) {
                $(identifier).addClassName("selected");
                crossTabMultiSelect.selectedCells.push(object);
            }
        }
    }
};

crossTabMultiSelect.deactivateXtabCell = function(object) {
    if(object && object.id){
        var identifier = object.id;
        if(identifier.startsWith("colGroupHeaderRow") || identifier.startsWith("rowGroup")){
            if ($(identifier)) {
                $(identifier).removeClassName("selected");
                crossTabMultiSelect.selectedCells.without(object);
            }
        }
    }
};

crossTabMultiSelect.deactivateSelectedXtabCells = function(){
    selObjects.each(function(object){
        crossTabMultiSelect.deactivateXtabCell(object);
    });
};

crossTabMultiSelect.deselectAllGroupMembers = function(){
    crossTabMultiSelect.selectedCells.each(function(object){
        crossTabMultiSelect.deactivateXtabCell(object);
    });
    crossTabMultiSelect.selectedCells.clear();
};
