/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

AdHocCrosstab.canMoveToDimensions  = function() {
    var fieldInUse = selObjects.find(function(obj) {
        return localContext.isInUse(obj.param.extra.id, obj.param.extra.isMeasure);
    });

    return !fieldInUse;
};

AdHocCrosstab.canMoveToMeasures = function() {
    //for now same logic as for move to dimensions
    return AdHocCrosstab.canMoveToDimensions();
};

AdHocCrosstab.canSaveReport = function(){
    if (localContext.isNonOlapMode()) {
        //In non olap mode we only need a measure tu run a report
        return localContext.state.hasMeasures;
    } else {
        //in OLAP mode we need a measure and something in columns to run a report
        return localContext.state.hasMeasures &&
            localContext.state.columnGroups.first() &&
            localContext.state.columnGroups.first().dimensionName !== localContext.NULL_DIMENSION;
    }
};

AdHocCrosstab.isGroupSelected = function(selectedObject){
    return !selectedObject.isMeasure;
};

AdHocCrosstab.isRowGroupSelected = function(selectedObject){
    return selectedObject.axis === "row" && !selectedObject.isMeasure;
};

AdHocCrosstab.isColumnGroupSelected = function(selectedObject){
    return selectedObject.axis === "column" && !selectedObject.isMeasure;
};

AdHocCrosstab.isCurrentDateType = function(thisType) {
    var group = AdHocCrosstab.getSelectedGroup(adhocDesigner.getSelectedColumnOrGroup());
    if(group){
        return group.categorizerName == thisType;
    }
    return false;
};

AdHocCrosstab.isSelectedMeasureNumeric = function() {
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        var type = adhocDesigner.getSuperType(object.type);
        return (type == "int" || type == "dec");
    }
    return false;
};

AdHocCrosstab.isDateType = function(){
    return AdHocCrosstab.isDateTimeType("date");
};

AdHocCrosstab.isTimestampType = function(){
    return AdHocCrosstab.isDateTimeType("timestamp");
};

AdHocCrosstab.isTimeType = function(){
    return AdHocCrosstab.isDateTimeType("time");
};

AdHocCrosstab.isDateTimeType = function(dateTimeType){
    var object = adhocDesigner.getSelectedColumnOrGroup();
    if(object){
        var isGroup = AdHocCrosstab.isGroupSelected(object);
        var group = AdHocCrosstab.getSelectedGroup(object);
        if (group) {
            var canReBucket = group.canReBucket === true;
            var dateDataType = group.type === dateTimeType;
            return (isGroup && canReBucket && dateDataType);
        }
    }
    return false;
};

AdHocCrosstab.isSelectedMeasureItemType = function(type) {
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        var selectedType = adhocDesigner.getSuperType(object.type);
        return (selectedType === type);
    }
    return false;
};

AdHocCrosstab.isSelectedMeasureMask = function(mask) {
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        return (object.functionMaskOrDefault === mask)
            || (!object.functionMaskOrDefault && mask === defaultMasks[adhocDesigner.INTEGER_TYPE_DISPLAY]);
    }
    return false;
};

AdHocCrosstab.isSelectedSummaryFunction = function(sFunc) {
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        return (object.functionOrDefault === sFunc);
    }
    return false;
};

AdHocCrosstab.isSelectedTimeSummaryFunction = function(sFunc) {
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        return (object.aggregateFirstLevelFunction === sFunc);
    }
    return false;
};

AdHocCrosstab.canSwitchToRow = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return (localContext.isNonOlapMode() || AdHocCrosstab.state.getDimensionsCount(object.axis) > 1);
};

AdHocCrosstab.canAddSliceFilter = function() {
    var doesSelectionContainNotSliceableObject = selObjects.find(function(obj) {
        return !obj.isSliceable;
    });

    return selObjects.first() && !doesSelectionContainNotSliceableObject;
};

AdHocCrosstab.canMoveUpOrLeft = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var index = AdHocCrosstab.getSelectedDimensionIndex(object);
    return (index > 0);
};

AdHocCrosstab.canMoveDownOrRight = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    var index = AdHocCrosstab.getSelectedDimensionIndex(object);
    return index < AdHocCrosstab.state.getDimensionsCount(object.axis) - 1;
};

AdHocCrosstab.canMoveMeasureUpOrLeft = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();
    return (object.index > 0);
};

AdHocCrosstab.canMoveMeasureDownOrRight = function() {
    var object = adhocDesigner.getSelectedColumnOrGroup();

    var dimensionId = object.isMeasure ? adhocDesigner.MEASURES : object.dimensionId;
    var total =  AdHocCrosstab.state.getLevelsFromDimension(dimensionId, object.axis).length;

    return object.index < total - 1;
};
/**
 * Whether selected dimension can be added to crosstab
 * either as column or as row
 */
AdHocCrosstab.canAddDimensionAsRowGroup = function() {
    var node = localContext.getSelectedObject();
    if (!node.hasChilds()) {
        node = node.parent;
    }

    if (localContext.isOlapMode()) {
        var dimensionId = node.param.id,
            dimensionsColumnCount = localContext.state.getDimensionsCount('column'),
            isHierarchy = node.param.extra.isHierarchy,
            levelsAtColumns = AdHocCrosstab.state.getLevelsFromDimension(dimensionId, 'column'),
            onlyOneHierarchyExistsInColumns = isHierarchy && dimensionsColumnCount === 1 && !_.isEmpty(levelsAtColumns);

        if (dimensionsColumnCount === 0 || onlyOneHierarchyExistsInColumns) {
            return false;
        }

        var hierarchyName = isHierarchy && node.param.extra.id,
            levelsAtRows = AdHocCrosstab.state.getLevelsFromDimension(dimensionId, 'row'),
            onlyInRows = _.isEmpty(levelsAtColumns);

        var fromSiblingHierarchy = localContext.fromSiblingHierarchy(hierarchyName, dimensionId);

        return (isHierarchy || onlyInRows) && (isHierarchy && fromSiblingHierarchy || levelsAtRows.length < node.getChildCount());
    } else {
        var tree = dynamicTree.trees[node.getTreeId()];
        var leaves = adhocDesigner.getAllLeaves(node, tree);
        var leavesStringArray = adhocDesigner.getAllLeaves(node, tree).collect(function(node) {
            return node.param.extra.id;
        });

        if (leaves[0].param.extra.isMeasure) {
            var measuresInColumns = localContext.state.getFilteredMeasureList('column');
            return measuresInColumns.length === 0;

        } else {
            var allUsedFields = _.pluck(localContext.state.getFilteredList(), 'name');
            return _.difference(leavesStringArray, allUsedFields).length > 0;
        }
    }
};

AdHocCrosstab.canAddDimensionAsColumnGroup = function() {
    var node = localContext.getSelectedObject();
    if (!node.hasChilds()){
        node = node.parent;
    }

    if (localContext.isOlapMode()) {
        var dimensionId = node.param.id,
            isHierarchy = node.param.extra.isHierarchy,
            hierarchyName = isHierarchy && node.param.extra.id,
            levelsAtColumns = AdHocCrosstab.state.getLevelsFromDimension(dimensionId, 'column'),
            levelsAtRows = AdHocCrosstab.state.getLevelsFromDimension(dimensionId, 'row'),
            onlyInColumns = levelsAtRows.length === 0;

        var fromSiblingHierarchy = localContext.fromSiblingHierarchy(hierarchyName, dimensionId);

        return (isHierarchy || onlyInColumns) && (isHierarchy && fromSiblingHierarchy || levelsAtColumns.length < node.getChildCount());
    } else {
        var tree = dynamicTree.trees[node.getTreeId()];
        var leaves = adhocDesigner.getAllLeaves(node, tree);
        var leavesStringArray = adhocDesigner.getAllLeaves(node, tree).collect(function(node) {
            return node.param.extra.id;
        });

        if (leaves[0].param.extra.isMeasure) {
            var measuresInRows = localContext.state.getFilteredMeasureList('row');
            return measuresInRows.length === 0;

        } else {
            var allUsedFields = _.pluck(localContext.state.getFilteredList(), 'name');
            return _.difference(leavesStringArray, allUsedFields).length > 0;
        }
    }
};

/**
 * Whether selected level can be added to crosstab
 * either as column or as row
 */
AdHocCrosstab.canAddLevelAsRowGroup = function() {
    if (localContext.state.getDimensionsCount('column') === 0 && localContext.isOlapMode()) {
        return false;
    }

    var node = localContext.getSelectedObject();
    if (!node) {
        return false;
    }

    var field = node.param.extra;

    if (!field) {
        return false;
    }

    var dimensionIds =  localContext.isOlapMode() ? [field.dimensionId] :
        adhocDesigner.getAllLeaves(node).map(function(n) {return n.param.extra.dimensionId});

    var levelsAtColumns = dimensionIds.inject([], function(levels, d) {
        return levels.concat(AdHocCrosstab.state.getLevelsFromDimension(d, 'column') || []);
    });
    var levelsAtRows = dimensionIds.inject([], function(levels, d) {
        return levels.concat(AdHocCrosstab.state.getLevelsFromDimension(d, 'row') || []);
    });
    return levelsAtColumns.length === 0 &&
        (levelsAtRows.length === 0 ||
            (localContext.isNonOlapMode() && (field.isMeasure || AdHocCrosstab.isDateField(field))) ||
            !_.contains(levelsAtRows, field.name));
};

AdHocCrosstab.canAddLevelAsColumnGroup = function() {
    var node = localContext.getSelectedObject();
    if (!node) {
        return false;
    }

    var field = node.param.extra;
    var dimensionIds =  localContext.isOlapMode() ? [field.dimensionId] :
        adhocDesigner.getAllLeaves(node).map(function(n) {return n.param.extra.dimensionId});

    var levelsAtColumns = dimensionIds.inject([], function(levels, d) {
        return levels.concat(AdHocCrosstab.state.getLevelsFromDimension(d, 'column') || []);
    });
    var levelsAtRows = dimensionIds.inject([], function(levels, d) {
        return levels.concat(AdHocCrosstab.state.getLevelsFromDimension(d, 'row') || []);
    });

    return levelsAtRows.length === 0 &&
        (levelsAtColumns.length === 0 ||
            (localContext.isNonOlapMode() && (field.isMeasure || AdHocCrosstab.isDateField(field))) ||
            !levelsAtColumns.find(function(name) {
                return _.contains(_.map(designerBase.getSelectedObjects(), function(node) {
                    return node.param.extra.id;
                }), name);
            }));
};

AdHocCrosstab.showAddHierarchyConfirm = function(hierarchyName, dimensionId, onOk) {
    if (localContext.fromSiblingHierarchy(hierarchyName, dimensionId)) {
        adhocDesigner.addConfirmDialog.show({ ok : function() {
            if (AdHocCrosstab.isFiltersApplied(dimensionId)) {
                dialogs.systemConfirm.show(adhocDesigner.getMessage("ADH_CROSSTAB_LAST_FILTERED_LEVEL"), 5000);
                return;
            }
            onOk();
        }});
        return true;
    }
    return false;
};

AdHocCrosstab.isFiltersApplied = function(dimensionId, axis) {
    var levelNames = _.pluck(localContext.state.getLevelObjectsFromDimension(dimensionId, axis), "levelUniqueName");
    var filterNames = _.pluck(localContext.state.existingFilters, "name");

    return !_.isEmpty(_.intersection(levelNames, filterNames));
};

/**
 * Whether exists siblings for this level
 * which are not added to crosstab
 */
AdHocCrosstab.canAddSiblingLevels = function() {
    //TODO: if all sibling levels already added to crosstab or
    //or no siblings present - return false
    return true;
};

/**
 * Whether selected level can be hidden
 */
AdHocCrosstab.canHideLevel = function() {
    //TODO: add check
    return true;
};

/**
 * Whether selected level can be restored
 * (only for hidden levels)
 */
AdHocCrosstab.canShowLevel = function() {
    //TODO: add check
    return true;
};

AdHocCrosstab.canHideSummariesForColumnGroup = function(){
    return AdHocCrosstab.canHideSummariesForGroup(false);
};


AdHocCrosstab.canHideSummariesForRowGroup = function(){
    return AdHocCrosstab.canHideSummariesForGroup(true);
};


// we can now hide summaries for all groups, now that we deal with collapsed nodes correctly (see bug 24981)
AdHocCrosstab.canHideSummariesForGroup = function(isRowGroup){
   return true;
};

AdHocCrosstab.canAddFilter = function(object, errorMessages) {
    if (localContext.isOlapMode()) {
        var isMeasure =  isNotNullORUndefined(object.isMeasure)
            ? object.isMeasure
            : (object.param.extra && object.param.extra.isMeasure);

        var isDuplicate = localContext._isAddingFilterDuplicate(object);
    }

    //We do not support filters for measures in OLAP-mode.
    if (isMeasure) {
        errorMessages && errorMessages.push(addFilterErrorMessageMeasureAdd);
        return false;
    }

    var levelName = object.param ? (object.param.extra && object.param.extra.id) : object.level,
        isAllLevel = levelName && levelName.indexOf(localContext.ALL_LEVEL_NAME) === 0;

    //We do not support filters for (All) level in 1'st iteration.
    if (isAllLevel) {
        errorMessages && errorMessages.push(addFilterErrorMessageAllLevelAdd);
        return false;
    }
    // Cannot add group of fields as filter.
    if (object.isParent && object.isParent()) {
        errorMessages && errorMessages.push(addFilterErrorMessageGroupAdd);
        return false;
    }

    if (object.param && localContext.fromSiblingHierarchy(object.param.extra.hierarchyName, object.param.extra.dimensionId)) {
        errorMessages && errorMessages.push(addFilterErrorMessageAnotherHierarchy);
        return false;
    }

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

    if (isDuplicate) {
        errorMessages && errorMessages.push(addFilterErrorMessage);
        return false;
    }

    return true;
};

AdHocCrosstab._isAddingFilterDuplicate = function (filterCandidate) {
    var filterCandidateName;

    if (filterCandidate.param) {
        filterCandidateName = "[" + filterCandidate.param.extra.dimensionId + "].[" + filterCandidate.param.extra.id + "]";
    } else {
        filterCandidateName = "[" + filterCandidate.dimensionId + "].[" + filterCandidate.level + "]";
    }
    return adhocDesigner.filtersController.hasFilterForField(filterCandidateName);
};

AdHocCrosstab.getSelectedObject = function() {
    return selObjects.first();
};

AdHocCrosstab.getHierarchy = function(node) {
    var extra = node.param.extra;
    // Return hierarchy name if this is level
    if (!node.hasChilds()) {
        return extra.hierarchyName;
    }

    // Reset extra to Default (first in list) hierarchy, if current node is Dimension, holding multiple hierarchies
    if (node.getFirstChild().hasChilds()) {
        extra = node.getFirstChild().param.extra;
    }

    return (extra && extra.isHierarchy) ? extra.id : undefined;
};

AdHocCrosstab._getAvailableFieldsNodeBySelection = function (level, dimensionId, item) {
    var meta = {};

    if (selectionCategory.area == designerBase.AVAILABLE_FIELDS_AREA) {
        if (item.hasChilds()) {
            meta.isMeasure = item.treeId === "measuresTree";
            meta.dimensionId = meta.isMeasure ? item.treeId : item.param.id;
            meta.uri = localContext.isNonOlapMode() ? item.param.uri : undefined;
            meta.level = null;
        } else {
            meta.isMeasure = !!item.param.extra.isMeasure;
            meta.level = item.param.extra.dimensionId && item.param.id;
            meta.dimensionId = item.param.extra.dimensionId || item.param.extra.id;
        }
        meta.hierarchyName = AdHocCrosstab.getHierarchy(item);
        meta.index = -1;
    } else if (selectionCategory.area == designerBase.ROW_GROUP_MENU_LEVEL
            || selectionCategory.area == designerBase.COLUMN_GROUP_MENU_LEVEL) {

        if (level || dimensionId) {
            var hierarchyMatch = /.*\[(.*)\]/.exec(level),
                hierarchyName = hierarchyMatch && hierarchyMatch[1];

            meta.isMeasure = !dimensionId;
            meta.level = level;
            meta.dimensionId = meta.isMeasure ? adhocDesigner.MEASURES : dimensionId;
            meta.index = -1;
            meta.hierarchyName = hierarchyName;
        } else if (item.axis) {
            //Display Manager object in selection
            meta = item;
        } else {
            //xtab object in selection
            //TODO get dim and lev from crosstab
            alert("Need a way to get dimension name for clicked level from crosstab");
            return;
        }
    }
    return meta;
};

AdHocCrosstab.getAvailableFieldsNodeBySelection = function(level, dimensionId) {
    return AdHocCrosstab._getAvailableFieldsNodeBySelection(level, dimensionId,selObjects.first());
};

AdHocCrosstab.getAvailableFieldsNodesBySelection = function(level, dimensionId) {
    var metas = [];
    for (var i = 0; i<selObjects.length; i++){
        metas.push(AdHocCrosstab._getAvailableFieldsNodeBySelection(level, dimensionId,selObjects[i]));
        metas[i].extra = metas[i];
        metas[i].dimensionId = metas[i].dimensionId;
        metas[i].id = metas[i].level;
    }
    return metas;
};

AdHocCrosstab.canShowSortOptions = function() {
    if (selObjects.length > 1) {
        return false;
    }

    var isColumnAxis = selObjects[0].axis === 'column',
        //bug #43972: Disable measure sorting on columns if there are no row groups
        hasRowGroups = localContext.state.crosstab.hasConcreteRowGroups;

    return selObjects[0].isInner && (isColumnAxis ? hasRowGroups : selObjects[0].isMeasure);
};

AdHocCrosstab.canShowTopBottomNFilterMenu = function() {
    var canSort = !localContext.isOlapMode() && AdHocCrosstab.canShowSortOptions(),
        hasRowGroups = localContext.state.hasConcreteRowGroups,
        rowDimensions = localContext.state.getDimensions("row"),
        areMeasuresInRows = hasRowGroups && _.find(rowDimensions, function(rowDimension) {
                return rowDimension.name === "Measures";
            });

    return canSort && !areMeasuresInRows;
};

AdHocCrosstab.isSortOptionSelected = function(sortingDirection) {
    return selObjects[0].sorting === sortingDirection;
};

AdHocCrosstab.isDateField = function(field) {
    return field.type === "Timestamp" || field.type === "Date" || field.type === "Time";
};

AdHocCrosstab.isTopBottomNOptionSelected = function(value) {
    return selObjects[0].topBottomFilter === value;
};