/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

AdHocCrosstab.mouseDownHandler = function(evt){};

AdHocCrosstab.mouseUpHandler = function(evt){
    var it = AdHocCrosstab;
    var id;
    var name;
    var mask;
    var index;
    var display;
    var groupObj;
    var dataType;
    var overlayId;
    var sFunction;
    var canReBucket;
    var currentBucket;
    var overlayObject;
    var isShowingSummary;
    var element = evt.element();
    var regex = new RegExp("\\d+$");
    var matched = null;
    var isRowGroup,
        parent;

    if (Draggables.dragging != designerBase.AVAILABLE_FIELDS_AREA) {
        if (matchAny(element, [localContext.GROUP_LEVEL_DISCLOSURE_PATTERN], false)) {
            parent = element.up();
            if (parent) {
                var dimensionId = parent.readAttribute("data-dimension");
                var level = parent.readAttribute("data-level");
                var collapsed = element.hasClassName('closed');
                isRowGroup = parent.identify().startsWith("rowGroup");
                if (collapsed) {
                    AdHocCrosstab.expandLevel(dimensionId, level, isRowGroup);
                } else {
                    AdHocCrosstab.collapseLevel(dimensionId, level, isRowGroup);
                }
            }

            return;
        }

        if (matchAny(element, [localContext.GROUP_MEMBER_DISCLOSURE_PATTERN], false)) {
            parent = element.up();

            if ($(parent)) {
                id = parent.identify();
                isRowGroup = id.startsWith("rowGroup_");
                var regez = new RegExp(/\B\d+\B/);
                index = regez.exec(id)[0];
                var path = $(parent).readAttribute("data-path");
                if (isRowGroup) {
                    localContext.toggleExpandCollapseForRow(path, index);
                } else {
                    localContext.toggleExpandCollapseForColumn(path, index);
                }
            }

            return;
        }

        matched = matchAny(element, [localContext.COLUMN_GROUP_MEMBER_PATTERN, localContext.ROW_GROUP_MEMBER_PATTERN], true);
        if (matched && !isRightClick(evt)) {
            AdHocCrosstab.deselectAllSelectedOverlays();
            crossTabMultiSelect.selectXtabGroupMember(matched, evt);
        }

        matched = matchAny(element,  [localContext.ROW_GROUP_OVERFLOW_PATTERN, localContext.COLGROUP_GROUP_OVERFLOW_PATTERN], true);
        if(matched){
            if($(matched).hasClassName("colOverflow")){
                var canShowMoreColumns = $(matched).readAttribute("data-canShowMore");
                if (canShowMoreColumns === "true") {
                    AdHocCrosstab.retrieveOverflowColumnGroups();
                }
            }else{
                AdHocCrosstab.retrieveOverflowRowGroups();
            }
        }
    }
};

AdHocCrosstab.mouseOverHandler = function(evt){};

AdHocCrosstab.mouseOutHandler = function(evt){};

AdHocCrosstab.mouseClickHandler = function(evt){
    var anchor = null;
    var element = evt.element();
    var regex = new RegExp('\\d+', 'g');
    var matched = null;
    var axis = null;
    var action = null;

    if(element.match(AdHocCrosstab.DRILL_THROUGH_PATTERN)){
        crossTabMultiSelect.deselectAllGroupMembers();
        element = element.parentNode;

        if ($(element)) {
            anchor = element.identify();
            if (localContext.state.inDesignView) {
                if (anchor.startsWith("measureBucketDrill_")) {
                    var rowPathIndex = regex.exec(anchor)[0];
                    var columnPathIndex = regex.exec(anchor)[0];
                    if (!AdHocCrosstab.isOlapMode()) {
                        AdHocCrosstab.drill(rowPathIndex, columnPathIndex);
                    } else {
                        AdHocCrosstab.drillOLAP(rowPathIndex, columnPathIndex);
                    }
                    return;
                }
                //  Let the user know why their Drill Through Click is not responding
                if (anchor.startsWith("measureBucketNoDrillParentChild_")) {
                    dialogs.systemConfirm.show(adhocDesigner.getMessage("ADH_1213_DRILLTHROUGH_NOT_SUPPORTED_PARENT_CHILD", 15000));
                }
                if (anchor.startsWith("measureBucketInvalidDrill_")) {
                    // Do nothing if the user clicks on an invalid drill down
                    return;
                }
            }
        }
    }
};

AdHocCrosstab.contextMenuHandler = function(evt) {
    var element = evt.element();
    var id = element.identify();

    var index;
    var groupObj;
    var isRowGroup;

    if (matchAny(element, [AdHocCrosstab.COLUMN_GROUP_MEMBER_PATTERN, AdHocCrosstab.ROW_GROUP_MEMBER_PATTERN], true)) {
        //Members
        if (element) {
            //do not show context menu for items without id
            if (id.indexOf("anonymous") === 0) {
                return;
            }

            if (!designerBase.isObjectInSelection({ id : id }, "id")) {
                crossTabMultiSelect.selectXtabGroupMember(element, evt);
            }
            adhocDesigner.showDynamicMenu(evt, designerBase.MEMBER_GROUP_MENU_LEVEL);
        }
    } else if (matchAny(element, [AdHocCrosstab.GROUP_LEVEL_PATTERN], false)) {
        //Groups

        while ($(element).hasClassName("dummy")) {
            element = element.nextSiblings()[0];
        }

        id = element.identify();
        isRowGroup = id.startsWith("rowGroup");
        index = parseInt(AdHocCrosstab.ENDS_WITH_A_NUMBER_REGEX.exec(id)[0]);
        var state = localContext.state,
            axis = isRowGroup ? 'row' : 'column',
            dimensionId = element.readAttribute("data-dimension"),
            dimensionIndex = _.indexOf(state.getDimensions(axis), state.getDimension(dimensionId, axis));

        if ($(element)) {
            groupObj = {
                id: (isRowGroup ? "rowGroup_" : "colGroup_") + index,
                name: element.readAttribute("data-level"), //for filters
                level: element.readAttribute("data-level"),
                dimensionId: dimensionId,
                expandable: element.readAttribute("data-expanable") === 'true',
                axis: axis,
                isMeasure: (dimensionId === adhocDesigner.MEASURES),
                groupIndex: AdHocCrosstab.isOlapMode() ? dimensionIndex : index,
                index : index,
                sorting: element.readAttribute("data-sorting")
            };

            if (groupObj.dimensionId !== AdHocCrosstab.NULL_DIMENSION) {
                crossTabMultiSelect.selectXtabGroupLabel(groupObj);

                if (groupObj.isMeasure) {
                    AdHocCrosstab.showCrosstabMenu(evt, localContext[isRowGroup ? "MEASURES_DIMENSION_ROW_MENU_CONTEXT" : "MEASURES_DIMENSION_COLUMN_MENU_CONTEXT"]);
                } else {
                    AdHocCrosstab.showCrosstabMenu(evt, designerBase[isRowGroup ? "ROW_GROUP_MENU_LEVEL" : "COLUMN_GROUP_MENU_LEVEL"]);
                }
            }
        }
    } else if (matchAny(element, [AdHocCrosstab.MEASURE_PATTERN], false)) {
        //Measures

        while ($(element).hasClassName("dummy")) {
            element = element.nextSiblings()[0];
        }

        index = parseInt(AdHocCrosstab.ENDS_WITH_A_NUMBER_REGEX.exec(id)[0]);
        isRowGroup = id.startsWith("rowGroup");

        var measures = AdHocCrosstab.getRefinedMeasuresFromState();
        var measuresCount = measures.length;
        var levelIndex = index % measuresCount;
        var name = measures[levelIndex].fieldName;
        var path = element.readAttribute("data-path"),
            tbFilter = AdHocCrosstab.getTopBottomFilter();

        if ($(element)) {
            groupObj = {
                id: (isRowGroup ? "rowGroup_" : "colGroup_") + index,
                name: name, //for filters
                level: name,
                dimensionId: adhocDesigner.MEASURES,
                expandable: element.readAttribute("data-expanable") === 'true',
                axis: isRowGroup ? 'row' : 'column',
                isMeasure: true,
                index: levelIndex,
                path : element.readAttribute("data-path"),
                isInner : element.hasClassName('inner'),
                sorting : element.readAttribute("data-sorting"),
                topBottomFilter: tbFilter && tbFilter.path === path ? tbFilter.type : "none"
            };

            crossTabMultiSelect.selectXtabGroupLabel(groupObj);

            AdHocCrosstab.showCrosstabMenu(evt, localContext[isRowGroup ? "MEASURE_ROW_MENU_CONTEXT" : "MEASURE_COLUMN_MENU_CONTEXT"]);
        }
    }
};

AdHocCrosstab.lmHandlersMap = {
    // Common methods for both axes
    addItems : function(nodes, pos, axis) {
        var dims = _.uniq(_.map(nodes, function(n) {return n.extra.dimensionId;}));
        var child = _.pluck(nodes, 'id');
        var isMeasure = nodes[0].extra.isMeasure;
        var isOlap = AdHocCrosstab.isOlapMode();

        AdHocCrosstab.insertDimensionInAxisWithChild({
            dim :  isMeasure ? dims.slice(0, 1) : dims,
            axis : axis,
            pos : pos,
            child : isOlap || isMeasure ? child : null,
            hierarchyName : nodes[0].extra.hierarchyName
        });
    },
    measureReorder : function(measure, to) {
        AdHocCrosstab.moveMeasure(measure, to);
    },

    column : {
        addItem : function(dim, pos, level, levelPos, isMeasure, uri, hierarchyName) {
            AdHocCrosstab.insertDimensionInAxisWithChild({
                dim : dim,
                axis : 'column',
                pos : pos,
                child : AdHocCrosstab.isOlapMode() || isMeasure ? level : null,
                measure_pos : levelPos,
                isMeasure : isMeasure,
                uri : uri,
                hierarchyName : hierarchyName
            });
        },
        removeItem : function(item, index) {
            if (item.isMeasure) {
                AdHocCrosstab.removeMeasure(index);
            } else {
                AdHocCrosstab.hideColumnLevel(item.dimensionId, item.level);
            }
        },
        moveItem : function(dim, from, to) {
            AdHocCrosstab.moveDimension(dim, 'column', 'column', from, to);
        },
        switchItem : function(dim, from, to) {
            AdHocCrosstab.moveDimension(dim, 'row', 'column', from, to);
        },
        contextMenu : function(event, options) {
            AdHocCrosstab.selectFromDisplayManager(options.targetEvent, options.extra, designerBase.COLUMN_GROUP_MENU_LEVEL);
            AdHocCrosstab.showCrosstabMenu(options.targetEvent, localContext.DISPLAY_MANAGER_COLUMN_CONTEXT);
        }
    },
    row : {
        addItem : function(dim, pos, level, levelPos, isMeasure, uri, hierarchyName) {
            AdHocCrosstab.insertDimensionInAxisWithChild({
                dim : dim,
                axis : 'row',
                pos : pos,
                child : AdHocCrosstab.isOlapMode() || isMeasure ? level : null,
                measure_pos : levelPos,
                isMeasure : isMeasure,
                uri : uri,
                hierarchyName : hierarchyName
            });
        },
        removeItem : function(item, index) {
            if (item.isMeasure) {
                AdHocCrosstab.removeMeasure(index);
            } else {
                AdHocCrosstab.hideRowLevel(item.dimensionId, item.level);
            }
        },
        moveItem : function(dim, from, to) {
            AdHocCrosstab.moveDimension(dim, 'row', 'row', from, to);
        },
        switchItem : function(dim, from, to) {
            AdHocCrosstab.moveDimension(dim, 'column', 'row', from, to);
        },
        contextMenu : function(event, options) {
            AdHocCrosstab.selectFromDisplayManager(options.targetEvent, options.extra, designerBase.ROW_GROUP_MENU_LEVEL);
            AdHocCrosstab.showCrosstabMenu(options.targetEvent, localContext.DISPLAY_MANAGER_ROW_CONTEXT);

        }
    }
};

AdHocCrosstab.treeMenuHandler = function(event) {
    var node = event.memo.node;
    var contextName;

    if (node.treeId === "dimensionsTree") {
        contextName = node.isParent() ? adhocDesigner.DIMENSION_TREE_DIMENSION_CONTEXT : adhocDesigner.DIMENSION_TREE_LEVEL_CONTEXT;
    } else if (node.treeId === "measuresTree") {
        contextName = node.isParent() ? adhocDesigner.MEASURE_TREE_GROUP_CONTEXT : adhocDesigner.MEASURE_TREE_CONTEXT;
    }

    adhocDesigner.showDynamicMenu(event.memo.targetEvent, contextName, null);
};

/**
 * method to be called when a level is selected from the display manager by right click
 */
AdHocCrosstab.selectFromDisplayManager = function(event, node, area) {
    designerBase.unSelectAll();
    var isMultiSelect = adhocDesigner.isMultiSelect(event, area);
    //update select area
    selectionCategory.area = area;
    var isSelected = adhocDesigner.isAlreadySelected(node);
    actionModel.setSelected([node]);
    adhocDesigner.addSelectedObject(event, node, isMultiSelect, isSelected);
    Event.stop(event);
};
