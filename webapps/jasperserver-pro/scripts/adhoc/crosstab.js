/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* jshint undef: false */

var AdHocCrosstab = {
    DRILL_THROUGH_PATTERN: "tbody#detailRows tr td.value span",
    ROW_GROUP_MEMBER_PATTERN: "tbody#detailRows tr td.member",
    COLUMN_GROUP_MEMBER_PATTERN: "thead#headerAxis th.member",
    GROUP_LEVEL_PATTERN: "thead#headerAxis tr th.level",
    MEASURE_PATTERN: "table#canvasTable .measure",
    GROUP_MEMBER_DISCLOSURE_PATTERN: ".olap span.button.disclosure",
    GROUP_LEVEL_DISCLOSURE_PATTERN: "th.level span.button.disclosure",
    SORT_ICON_PATTERN: ".olap .icon.sort",
    MEASURE_LABEL_PATTERN: "#measureLabel.label.measure UL.measures LI.leaf a span.xm",
    XTAB_LABEL_PATTERN: "th.label.group",

    ROW_GROUP_OVERFLOW_PATTERN: "td.rowOverflow",
    COLGROUP_GROUP_OVERFLOW_PATTERN: "th.colOverflow",

    COLGROUP_PLACEHOLDER: "th#columnGroupsPlaceHolder",
    ROW_GROUP_PLACEHOLDER: "td#rowGroupsPlaceHolder",
    MEASURES_PLACEHOLDER: "td#measuresPlaceHolder",
    TREE_CONTEXT_MENU_PATTERN: [
        'ul#dimensionsTree li.leaf .button',
        'ul#dimensionsTree li.node .button',
        'ul#measuresTree li.leaf .button',
        'ul#measuresTree li.node .button'],

    // Display Manager constants
    SHOWING_DISPLAY_MANAGER_CLASS: "showingDisplayManager",
    OLAP_COLUMNS_ID: "olap_columns",
    OLAP_ROWS_ID: "olap_rows",
    DM_AXIS_LIST_PATTERN: 'ul.tokens.sortable',

    NULL_DIMENSION: "NULL Dimension",

    // actionModel context ids
    DIMENSION_TREE_DIMENSION_CONTEXT: "dimensionsTree_dimension",
    DIMENSION_TREE_LEVEL_CONTEXT: "dimensionsTree_level",
    MEASURE_TREE_GROUP_CONTEXT: "measuresTree_group",
    MEASURE_TREE_CONTEXT : "measuresTree",
    DISPLAY_MANAGER_ROW_CONTEXT : "displayManagerRow",
    DISPLAY_MANAGER_COLUMN_CONTEXT : "displayManagerColumn",
    MEASURES_DIMENSION_ROW_MENU_CONTEXT : "measuresDimensionInRows",
    MEASURES_DIMENSION_COLUMN_MENU_CONTEXT : "measuresDimensionInColumns",
    MEASURE_ROW_MENU_CONTEXT : "measureRow",
    MEASURE_COLUMN_MENU_CONTEXT : "measureColumn",

    ENDS_WITH_A_NUMBER_REGEX: new RegExp("\\d+$"),
    ALL_LEVEL_NAME: "(All)",

    ///////////////////////////////////////////
    //global constants
    ///////////////////////////////////////////

    MEASURE: "measure",
    ROW_GROUP_MEMBER: "rgMember",
    COLUMN_GROUP_MEMBER: "cgMember",
    ROW_GROUP_PREFIX: "rowGroup",

    HACK_PADDING: 1,
    VISUAL_CUE_HACK_PADDING: 2,
    TRUNCATED_LABEL_LEN: 100,
    requestsInProgress: 0,
    DROP_TARGET_CLASS: "dropTarget",
    draggingMoveOverIndex: -1,
    currentlyDraggingIndex: -1,

    getMode: function() {
        return this.mode;
    },

    setMode: function(mode) {
        this.mode = mode;
    },

    reset: function() { /* Put here mode specific parameters reset */},

    render: function() {
        var state = this.state;
        var crosstab = state.crosstab;

        var isDataPresent = crosstab.queryStatus === 'OK';

        var html = this[this.getMode() + 'Template'](state);
        if (isIE9()) {
            // remove whitespace between tags because of the famous bug in IE9
            html = removeWhitespacesFromTable(html);
        }
        adhocDesigner.ui.canvas.html(html);

        adhocDesigner.setNothingToDisplayVisibility(!isDataPresent || state.isShowingNoData);

        adhocDesigner.enableXtabPivot(this.isPivotAllowed());

        if (this.state.isShowingNoData) {
            jQuery('#nothingToDisplayMessage').html(adhocDesigner.getMessage("noDataMode"));

        } else if (state.unresolvedReferences && state.unresolvedReferences.length > 0) {
            var msg = adhocDesigner.getMissingFieldsCanvasMessage(state);

            jQuery('#nothingToDisplayMessage').html(msg);

        } else {
            jQuery('#nothingToDisplayMessage').html(adhocDesigner.getMessage(crosstab.queryStatusMessagePrefix + crosstab.queryStatus));
        }

        return isDataPresent;
    },

    isPivotAllowed: function() {
        //For OLAP mode disable pivot if nothing in rows
        return this.state.getDimensionsCount('row') > 0 ||
            (localContext.isNonOlapMode() ? this.state.getDimensionsCount('column') > 0 : false);
    },

    initAll: function(){
        new Truncator($$(AdHocCrosstab.MEASURE_LABEL_PATTERN), AdHocCrosstab.TRUNCATED_LABEL_LEN);
        new Truncator($$(AdHocCrosstab.XTAB_LABEL_PATTERN), AdHocCrosstab.TRUNCATED_LABEL_LEN);
    },

    isOlapMode: function() {
        return this.getMode() === designerBase.OLAP_CROSSTAB;
    },

    isNonOlapMode: function() {
        return this.getMode() === designerBase.CROSSTAB;
    },

    fromSiblingHierarchy : function(hierarchy, dimensionId, axis) {
        if (!hierarchy) {
            return false;
        }
        var levelsInAxis = this.state.getLevelsFromDimension(dimensionId, axis);

        return levelsInAxis.length > 0 && levelsInAxis[0].indexOf("[" + hierarchy + "]") === -1;
    }
};

AdHocCrosstab.State = {
    getDimensions : function(axis) {
        return axis ? this.crosstabState[axis + 'Groups'] : _.chain(this.crosstabState).filter(function(val, key) {
            return key.search(/Groups$/) >= 0;
        }).flatten().value();
    },

    getDimension : function(dimensionName, axis) {
        return _.find(this.getDimensions(axis), function(dim) {
            return dim.name === dimensionName;
        });
    },

    getDimensionsCount : function(axis) {
        return this.getDimensions(axis).length;
    },

    getLevelsFromDimension : function(dim, axis) {
        return _.pluck(this.getLevelObjectsFromDimension(dim, axis), "name");
    },

    getLevelObjectsFromDimension : function(dim, axis) {
        var axisModel = this.getDimensions(axis);
        dim = _.find(axisModel, function(d) {
            return d.name === dim;
        });

        return dim ?
            _.chain(dim.levels).
                filter(function(level) { // return only visible levels
                    return level.visible;
                }).
                map(function(level) {                    // retrieve all members from levels
                    return !_.isEmpty(level.members) ? level.members : level
                }).
                flatten().
                filter(function(member) {      // filter out spacers
                    return !member.isSpacer;
                }).value()     :
            [];
    },

    getLevelObject : function(levelName, dimName, axisName) {
        var axisModel = this.getDimensions(axisName);
        function findByName(array, name) {
            return _.find(array, function(item) {
                return item.name == name;
            })
        }
        var dim = findByName(axisModel, dimName);
        if(!dim) {
            return null;
        }
        return findByName(dim.levels, levelName);
    },

    getFilteredList : function(a, p) {
        var axis = a || null, props = p || {};
        if (arguments.length === 1 && _.isObject(a)) {
            props = a;
            axis = null;
        }
        // add mandatory values to property map
        props.visible = true;
        return _.chain(this.getDimensions(axis)).pluck('levels').flatten().
            map(function(level) {
                return !_.isEmpty(level.members) ? level.members : level;
            }).flatten().filter(function(level) {
                return _.all(props, function(prop, key) {
                    return level[key] === undefined ||  level[key] === prop;
                });
            }).value();
    },

    getFilteredMeasureList : function(a, p) {
        var axis = a || null, props = p || {};
        if (arguments.length === 1 && _.isObject(a)) {
            props = a;
            axis = null;
        }
        return this.getFilteredList(axis, _.extend(props, {measure : true, measuresLevel : true}));
    }
};