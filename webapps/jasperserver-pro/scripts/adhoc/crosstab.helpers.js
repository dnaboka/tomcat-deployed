/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

///////////////////////////////////////////////////////////////
// Helper functions
///////////////////////////////////////////////////////////////

// these are called in other modules, so even though we don't use overlays, leave them stubbed out
AdHocCrosstab.deselectAllSelectedOverlays = function(){
};

AdHocCrosstab.deselectAllColumnGroupOverlays = function(){
};

AdHocCrosstab.deselectAllRowGroupOverlays = function(){
};

AdHocCrosstab.deselectAllMeasureOverlays = function(){
};


AdHocCrosstab.removeFromSelectObjects = function(overlayId){
    var foundObject = null;
    selObjects.each(function(object){
        if(object.id == overlayId){
            foundObject = object;
        }
    });
    selObjects = selObjects.without(foundObject);
};


AdHocCrosstab.getSelectedDimensionIndex = function(selectedObject){
    var index = -1,
        dimensionId;

    if(!selectedObject){
        return index;
    }
    if (_.isNumber(selectedObject.groupIndex)) {
        return selectedObject.groupIndex;
    }

    dimensionId = selectedObject.isMeasure ? adhocDesigner.MEASURES : selectedObject.dimensionId;
    _.find(localContext.state.getDimensions(selectedObject.axis), function(elem, ind) {
        if (elem.name === dimensionId) {
            index = ind;
            return true;
        }
    });

    return index;
};

AdHocCrosstab.getSelectedMeasure = function(){
    if(selObjects && selObjects.length > 0){
        var object = selObjects[0];
        if(object.isMeasure){
            var measures = AdHocCrosstab.getRefinedMeasuresFromState();

            return measures[object.index];
        }
    }
    return null;
};

AdHocCrosstab.getRefinedMeasuresFromState = function() {
    return _.filter(localContext.state.measures, function(measure) {
        return !measure.isSpacer;
    });
};

AdHocCrosstab.getSelectedGroup = function(object){
    if (!object) {
        return null;
    }

    return object.axis === "row"
        ? localContext.state.rowGroups[object.groupIndex]
        : localContext.state.columnGroups[object.groupIndex];
};

AdHocCrosstab.getMeasureTypeByFunction = function(thisFunction){
    var object = AdHocCrosstab.getSelectedMeasure();
    if(object){
        var type = adhocDesigner.getSuperType(object.type);
        if(thisFunction === "Average"){
            return "dec";
        }else if(thisFunction === "Count" ||thisFunction ==="DistinctCount"){
            return "int";
        }else{
            return type;
        }
    }
    return null;
};

/**
 * Fills "Add levels" menu items with dynamic values - all sibling levels
 */
AdHocCrosstab.updateContextMenuWithSiblingLevels = function(contextName, contextActionModel) {
    if (!adhocDesigner.ui.display_manager) {
        return contextActionModel;
    }

    var menuToUpdate = contextActionModel.find(function(item) {
        return item.clientTest === "AdHocCrosstab.canAddSiblingLevels";
    });

    if (!menuToUpdate) {
        return contextActionModel;
    }

    var siblingLevels = null;
    var rootNode = null;
    var action = null;
    var firstSelected = selObjects[0];
    var hierarchyMatch = /.*\[(.*)\]/.exec(firstSelected.level),
        hierarchyName = hierarchyMatch && hierarchyMatch[1];


    if (!firstSelected.isMeasure) {
        if (localContext.isOlapMode()) {
            rootNode = adhocDesigner.dimensionsTree.getRootNode().childs.find(function(node) {
                return node.param.extra.id === firstSelected.dimensionId;
            });

            if (rootNode.childs[0].param.extra.isHierarchy) {
                rootNode = _.find(rootNode.childs, function(node) {
                    return node.param.extra.id === hierarchyName;
                })
            }
            action = firstSelected.axis === "row" ? "AdHocCrosstab.appendDimensionToRowAxisWithLevel" : "AdHocCrosstab.appendDimensionToColumnAxisWithLevel";
        } else {
            //In nonOLAP mode there is only one level for any dimension
            firstSelected.index = 0;
            return contextActionModel;
        }
    } else {
        rootNode = adhocDesigner.measuresTree.getRootNode();
        action = firstSelected.axis === "row" ? "AdHocCrosstab.appendMeasureToRow" : "AdHocCrosstab.appendMeasureToColumn";
    }

    if (firstSelected.allLevels === undefined) {
        var metadata = firstSelected;
        metadata.allLevels = AdHocCrosstab.state.getLevelsFromDimension(firstSelected.dimensionId, metadata.axis);
        metadata.index = metadata.allLevels.indexOf(metadata.level);
    }

    if (firstSelected.allLevels) {
        if (localContext.isOlapMode()) {
            siblingLevels = rootNode.childs.findAll(function(node) {
                return !firstSelected.allLevels.include(node.param.extra.id);
            });
        } else {
            siblingLevels = adhocDesigner.getAllLeaves(rootNode, adhocDesigner.measuresTree)
                .findAll(function(node) {
                    return !firstSelected.allLevels.include(node.param.extra.id);
                });
        }
    }

    if (!siblingLevels || siblingLevels.length === 0) {
        return contextActionModel;
    }

    menuToUpdate.text = adhocDesigner.getMessage(firstSelected.isMeasure ? 'addMeasures' : 'addLevels');
    menuToUpdate.children = siblingLevels.collect(function(node) {
        return actionModel.createMenuElement("optionAction", {
            text: node.name,
            action: action,
            actionArgs: firstSelected.isMeasure ? [node.param.extra.id] : [{id: node.param.extra.id, groupId: node.param.extra.dimensionId, isMeasure: false}]
        });
    });

    return contextActionModel;
};

AdHocCrosstab.generateAvailableSummaryCalculationsMenu = function(context, menuActionModel) {
    var availableSummariesMenu = _.find(menuActionModel, function(item) {
        return item.clientTest === "AdHocCrosstab.selectedMeasureShowsSummaryOptions";
    });
    if (availableSummariesMenu) {
        var model = actionModel.selObjects[0],
            field = _.findWhere(localContext.state.measures, {name : model.name});

        field && adhocDesigner.generateAvailableSummaryCalculationsMenu(field.fieldName, availableSummariesMenu, {
            action: AdHocCrosstab.selectFunction,
            isSelectedTest: AdHocCrosstab.isSelectedSummaryFunction
        });
    }
    return menuActionModel;
};

AdHocCrosstab.getTopBottomFilter = function() {
    //use memoizing to store calculated value of topbottom filter
    if (typeof localContext.state.crosstab.topBottomFilter === "undefined") {
        localContext.state.crosstab.topBottomFilter = null;

        var transforms = localContext.state.crosstab.axisTransforms;
        var rowTransforms = transforms && transforms["ROWS"];

        if (rowTransforms && rowTransforms.length > 0) {

            for (var i = 0; i < rowTransforms.length; i++) {
                var rowTransform = rowTransforms[i];
                if (rowTransform && rowTransform.type === "com.jaspersoft.commons.dimengine.axistransform.TopOrBottomN") {
                    localContext.state.crosstab.topBottomFilter = {
                        path: "/" + rowTransform.path.join("/"),
                        //"asc" and "desc" are not very descriptive for top/bottom filtering
                        type: rowTransform.asc ? "bottom" : "top",
                        aggregateUnranked: rowTransform.createOtherBucket,
                        applyAcrossGroups: rowTransform.limitAllLevels,
                        limit: rowTransform.limit
                    };

                    break;
                }
            }
        }
    }

    return localContext.state.crosstab.topBottomFilter;
};