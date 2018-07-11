/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Artem Malieiev
 * @version: $Id$
 */

define(function (require) {
    var Backbone = require("backbone"),
        _ = require("underscore"),
        $ = require("jquery"),

        i18n = require("bundle!AdHocBundle"),

        formatterFactory = require("../../model/factory/formattersFactory"),

        crosstabRowsTemplate = require("text!../template/crosstabRowsTemplate.htm"),
        crosstabColumnsTemplate = require("text!../template/crosstabColumnsTemplate.htm");

    // Converter from aux model to template data

    function prepareRangeRendering(crosstab, range, horizontal, merge, axisComponent, data){
        var tmp = merge ? makeMergedRenderModel(range, horizontal) : makeNotMergedRenderModel(range, horizontal),
            measures = crosstab.components.findComponentDeep("measure");

        applyExpansionStrategy(tmp, range, axisComponent);
        localizeMeasures(tmp, range, measures);
        formatValues(tmp, range, axisComponent);
        applyAdditionalLookAndFeel(tmp, range, axisComponent, horizontal, data);

        if (horizontal) {
            var spacer = {
                isSpacer: true,
                label: ""
            }, spacerRow = [];

            tmp = transplantMatrix(tmp);
            if (tmp[0]) {
                for (var i = 0, l = tmp[0].length; i < l; i++) {
                    spacerRow.push(spacer);
                }
                tmp.push(spacerRow);
            }
        }

        return tmp;
    }

    function makeNotMergedRenderModel(range, horizontal){
        var tmp = [], row, last = false;

        for (var i = 0; i < range.length; i++){
            row = [];
            for (var j = 0; j < range[i].length; j++){
                row.push(makeTemplateItem(range[i][j], i, j));
            }
            tmp.push(row);
        }

        if (range.length) {
            for (var cols = 0; cols < range[0].length - 1; cols++) {
                for (var rows = 0; rows < range.length; rows++) {
                    if (range[rows][cols].isExpandable && range[rows][cols + 1].isTotal) {
                        if (last === range[rows][cols]) {
                            tmp[rows][cols].isCollapsed = false;
                            tmp[rows][cols].isExpanded = false;
                        } else {
                            last = range[rows][cols];
                        }
                    }
                }
            }
        }

        return tmp;
    }

    function makeMergedRenderModel(range, horizontal){
        var tmp = _.map(range, function(){
            return [];
        }), item = false, span = horizontal ? "colspan":"rowspan", representation;

        if (range.length){
            var lastRowMember = false;
            for (var cols = 0; cols < range[0].length; cols++){
                for (var rows = 0; rows < range.length; rows++){
                    if (range[rows][cols] === item) {
                        if (representation[span]) {
                            representation[span]++;
                        } else {
                            representation[span] = 2;
                        }

                        tmp[rows].push(null);

                    } else {
                        item = range[rows][cols];
                        representation = makeTemplateItem(item, rows, cols);
                        if (!horizontal && range[rows][cols].isExpandable && range[rows][cols].isExpanded && range[rows][cols + 1] && !range[rows][cols + 1].childFirst){
                            representation.label = "";
                        }

                        tmp[rows].push(representation);
                    }
                }
            }
        }

        return tmp;
    }

    function transplantMatrix(matrix) {
        var width = matrix[0] ? matrix[0].length : 0,
            height = matrix.length,
            result = new Array(width);

        for (var i = 0; i < width; i++) {
            result[i] = new Array(height);
            for (var j = 0; j < height; j++) {
                result[i][j] = matrix[j][i];
            }
        }
        return result;
    }

    function makeTemplateItem(item, i1, i2) {
        return {
            isExpanded: item.isExpandable && item.isExpanded,
            isCollapsed: item.isExpandable && !item.isExpanded,
            isMeasure: item.isMeasure,
            //// JRS-15214 : added extra condition item.istotalCol.
            isTotal: item.isTotal || item.istotalCol,
            label: label(item.label, item),
            expId: item.isExpandable ? i1 +"-"+ i2 : undefined
        };
    }

    function label(key, item){
        var res = key;
        if (key === "other_node") {
            res = i18n["adhoc.node.other.node"];
        } else if (item.isTotal) {
            res = i18n["adhoc.node.total.node"];
        }

        return res;
    }

    function applyExpansionStrategy(result, data, axisComponent){
        var parent, child;

        if (result.length){
            for (var cols = result[0].length - 1; cols > 0; cols--){
                if (axisComponent.components.models[cols] && axisComponent.components.models[cols].get("includeAll")){
                    for (var rows = 0; rows < result.length; rows++){
                        if ((data[rows][cols].isTotal || data[rows][cols].isMeasure) && (child = result[rows][cols])){
                            for (var parentIndex = rows; parentIndex >= 0 && !parent; parentIndex--){
                                parent = result[parentIndex][cols - 1];
                            }

                            child.isExpanded = parent.isExpanded;
                            child.isCollapsed = parent.isCollapsed;
                            child.expId = parent.expId;

                            parent = undefined;
                        }
                    }
                }
            }

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    parent = result[i][j];

                    if (parent && parent.expId && !data[i][j].isTotal){
                        parent.isExpanded = undefined;
                        parent.isCollapsed = undefined;
                        parent.expId = undefined;
                    }
                }
            }
        }
    }

    function localizeMeasures(result, data, measures){
        var measuresSubstitutes, measureObj;

        if (data.length){
            for (var i = 0; i < data[0].length; i++) {
                if (data[0][i].isMeasure) {

                    measuresSubstitutes = _.reduce(measures, function (memo, component) {
                        // Show summary function.
                        memo[component.get("reference")] = component.label(true);
                        return memo;
                    }, {});

                    for (var j = 0; j < data.length; j++) {
                        if (measureObj = result[j][i]) { // jshint ignore:line
                            measureObj.label = measuresSubstitutes[measureObj.label];
                        }
                    }
                }
            }
        }
    }

    function formatValues(tmp, range, axisComponent){
        var formatters = axisComponent.components.map(function (componentLevel) {
                var level = componentLevel.level();
                if (level) {
                    return formatterFactory(componentLevel.level().get("type"));
                }
            }),

            opts = axisComponent.components.map(function (componentLevel) {
                return {
                    format: componentLevel.get("format"),
                    categorizer: componentLevel.level() && componentLevel.level().get("categorizer"),
                    ignoreTimezone: true
                };
            });

        for (var i = 0; i < tmp.length; i++) {
            for (var j = 0; j < tmp[i].length; j++) {
                if (tmp[i][j] && formatters[j] && !range[i][j].isTotal){
                    tmp[i][j].label = formatters[j].format(tmp[i][j].label, opts[j].format, opts[j]);
                }
            }
        }
    }

    function applyAdditionalLookAndFeel(tmp, range, axisComponent, horizontal, data){
        if (!axisComponent.components.length){
            tmp[0] && (tmp[0][0] = {
                label : horizontal ? "" : i18n["adhoc.node.rowgroup.node"]
            });
        }

        for (var i = 0; i < tmp.length; i++){
            for (var j = 0; j < tmp[i].length; j++){
                (!tmp[i].totalRow) && (tmp[i].totalRow |= range[i][j].isTotal);
                if(j+1 === tmp[i].length && j-1 >= 0 && range[i][j-1].isTotal) {
                    tmp[i][j].isTotal = true;
                }
            }
        }

        if (!horizontal) {
            var id = -1;
            for (var i = 0; i < tmp.length; i++) {
                var rowspans = false;
                for (var j = 0; j < tmp[i].length; j++) {
                    if (tmp[i][j] !== null) {
                        tmp[i][j].rowspan !== undefined ? rowspans = true : null;

                        // JRS-14959 & JRS-15048 -- Start
                        tmp[i].totalRow === 1 && (j-1 > -1) &&
                        ((tmp[i][j-1]!== null && tmp[i][j-1].isTotal === true) && (tmp[i][j].isTotal = true) && id===-1 && (id = i))
                        || (tmp[i][j-1]=== null && id !== -1 && tmp[id][j-1] && tmp[id][j-1].isTotal && i-1 > 0 && tmp[i-1][j] && tmp[i-1][j].isTotal && (tmp[i][j].isTotal = true));

                        if(tmp[i][j].isTotal) {
                            if(rowspans && tmp[i]!==null && tmp[i].totalRow === 1) {
                                for(var m = i+1 ; m <i + tmp[i][j].rowspan; m++) {
                                    for(var k=j+1; k< tmp[i].length; k++) {
                                        tmp[i]!==null && tmp[i].totalRow === 1 && tmp[m][k]!==null && (tmp[m][k].isTotal = true);
                                    }
                                }
                            }
                        }
                        // JRS-14959 & JRS-15048-- End
                        if (tmp[i][j].rowspan > 0 ) {
                            //JRS-14959 - Added additional condition separated from the above if.
                                tmp[i + tmp[i][j].rowspan - 1].rowMemberLast = true;
                                if (data !== null) {
                                    data.rows.range[i + tmp[i][j].rowspan - 1].rowMemberLast = true;
                                }
                            !tmp[i].rowMember ? tmp[i].rowGroup = true : null;
                        }
                        else {
                            !tmp[i].rowGroup ? tmp[i].rowMember = true : null;
                        }
                    }
                }

                //JRS-14908 & JRS-14869: Updated the condition to add rowMemberLast class.
                if(!rowspans && i - 1 > 0 && tmp[i - 1].rowMemberLast === true && tmp[i].totalRow !== 1) {
                    tmp[i].rowMemberLast = true;
                    data !== null && (data.rows.range[i].rowMemberLast = true);
                }
                if(i + 1 < tmp.length && tmp[i].totalRow !== 1 && tmp[i + 1].totalRow === 1) {
                    tmp[i].rowMemberLast = true;
                    data !== null && (data.rows.range[i].rowMemberLast = true);
                }
            }

            //JRS-15007 & JRS-15048 : Added this to check to add rowMemberLast class.
            for(var i = 0; i< tmp.length; i++) {
                var rowSpanCount = 0;
                var nonRowSpanCount = 0;
                for(var j = 0; j<tmp[i].length; j++) {
                    if(tmp[i][0]!==null && tmp[i][0].rowspan === undefined && j+1 === tmp[i].length && i+1< tmp.length && !tmp[i].rowGroup && j > 0 && tmp[i+1][j-1] !==null && tmp[i][j-1]!==null && tmp[i+1][j-1].label!== tmp[i][j-1].label) {
                        data!== null && (data.rows.range[i].rowMemberLast = true);
                        tmp[i].rowMemberLast = true;
                    }

                    if(tmp[i][j]=== null  || (tmp[i][j] && tmp[i][j].rowspan > 0)) {
                        rowSpanCount ++;
                    } else {
                        nonRowSpanCount ++;
                    }
                }

                //JRS-15096 & JRS-15212: Check if row is
                // 1) 1) one or more cells in the row have a rowspan,
                // 2) there are two or more remaining cells in the same row that have no rowspan (are visual members)
                if(tmp[i] && !tmp[i].isTotal && rowSpanCount >= 1 && tmp[i].rowGroup && nonRowSpanCount >=2) {
                    tmp[i].rowSingleMember = true;
                    data!== null &&  (data.rows.range[i].rowMemberLast = true);
                }

                //JRS-15097: Check if the row is the only member and add rowMemberLast
                //JRS-15096: Check if row
                // 1)  is not a totals row,
                // 2) no cells in the row have rowspans, and
                // 3) the row contains two or more field or measure cells

                if(tmp[i] && rowSpanCount === 0 && tmp[i].isTotal !==1 && tmp[i].length >1 && i+1 !== tmp[i].length && tmp[i+1] && tmp[i][0].label !== tmp[i+1][0].label) {
                    tmp[i].rowMemberLast = true;
                    data !== null && (data.rows.range[i].rowMemberLast = true);
                }

                //JRS-15096
                if (rowSpanCount===1 && tmp[i][0] && tmp[i][0].rowspan >0 && tmp[i].length > 2) {
                    //JRS-14959 - Added additional condition separated from the above if.
                    for(var k = i+1; k <= i + tmp[i][0].rowspan - 1; k++) {
                        //JRS-14908 & JRS-14869: Adding additional check to add rowMemberLast class.
                        var innerTypeCount = 0;
                        for(var m = 0; m<tmp[k].length; m++) {
                            tmp[k][m]=== null && (innerTypeCount++);
                            tmp[k][m] && tmp[k][m].rowspan > 0 && (innerTypeCount++);
                        }
                        if(tmp[k] && !tmp[k].rowGroup && innerTypeCount === 1) {
                            tmp[k].rowMemberLast = true
                            data !== null && (data.rows.range[k].rowMemberLast = true);

                        }
                    }
                }
            }

        }
    }

    // View code

    var CrosstabHeaderView = Backbone.View.extend({

        events: {
            "click .jr-isExpanded": "onClick",
            "click .jr-isCollapsed": "onClick"
        },

        initialize: function (options) {
            this.orientation = options.orientation || CrosstabHeaderView.Orientation.HORIZONTAL;
            this.options = options;
            this.hyperlinkEnabledFor = [];

            if (this.orientation === CrosstabHeaderView.Orientation.VERTICAL) {
                this.templateFn = _.template(crosstabRowsTemplate);
                this.itemsCollection = this.model.dataSet.query.rows.axis;
            } else if (this.orientation === CrosstabHeaderView.Orientation.HORIZONTAL) {
                this.templateFn = _.template(crosstabColumnsTemplate);
                this.itemsCollection = this.model.dataSet.query.cols.axis;
            }

            this.items = this.itemsCollection.toQueryMultiaxisAxisItems();

            this.$viewport = this.$("table");

            this.listenTo(this.model.dataSet.query, "query:componentsDataChange" , function () {
                this.items = this.itemsCollection.toQueryMultiaxisAxisItems();
            }, this);
        },

        render: function () {
            if (this.renderData) {
                this.$viewport.html(this.templateFn({data: this.renderData, hyperlinks: this.hyperlinks}));
            }

            return this;
        },

        acquireData: function (data){
            var crosstab = this.model.component.getCrosstabComponent(),
                mergeCells = crosstab.get("mergeCrosstabCells"),
                horizontal = this.orientation === CrosstabHeaderView.Orientation.HORIZONTAL,
                axis = horizontal ? crosstab.getColumnsComponent() : crosstab.getRowsComponent();
            if(!horizontal) {
                this.data = data.rows;
                this.renderData = prepareRangeRendering(this.model.component.getCrosstabComponent(),  data.rows.range, horizontal, mergeCells, axis, data);
            }
            else {
                this.data = data.columns;
                this.renderData = prepareRangeRendering(this.model.component.getCrosstabComponent(),  data.columns.range, horizontal, mergeCells, axis, null);
            }
        },

        onClick: function (ev) {
            ev.stopPropagation();
            
            var id = ev.target.getAttribute("data-expansion-id").split("-"),
                row = this.data.range[+id[0]],
                expansion = {
                    member: {
                        expanded: false,
                        path: []
                    }
                };

            for (var i = 0; i <= +id[1]; i++) {
                expansion.member.path.push(row[i].isTotal ? "All":(row[i].value || "empty_node"));
            }
            expansion.member.expanded = !row[+id[1]].isExpanded;

            if (!expansion.member.expanded){
                this._collapseIndex = +id[1];
                this._collapseItem = row[this._collapseIndex];

                var position = $(ev.target).parents(".jr-mDatatable-cell:first").position();

                if (this.orientation === CrosstabHeaderView.Orientation.VERTICAL){
                    this._collapseOffset = this.data.top  - this.$el.scrollTop() + position.top;
                } else {
                    this._collapseOffset = this.data.top - this.$el.scrollLeft() + position.left;
                }
            }

            this.trigger("expansion", expansion);
        },

        validateViewport: function(newData, offset, pageSize){
            var res = -1, contains;

            if (this._collapseItem){
                for (var i = 0; i < newData.range.length && !contains; i++){
                    contains = newData.range[i][this._collapseIndex] === this._collapseItem;
                }

                if (!contains) {
                    res = Math.max(0, offset - Math.floor(pageSize / 2));
                }
            }

            return res;
        },

        getRequiredScrollPosition: function(){
            var res = -1, contains;

            if (this._collapseItem){
                for (var i = 0; i < this.data.range.length && !contains; i++){
                    contains = this.data.range[i][this._collapseIndex] === this._collapseItem;
                }

                if (contains){
                    for (var j = 0, sum = this.data.top; j < i - 1; sum += this.data.resultPixels[j],j++);
                    res = Math.max(0, sum - this._collapseOffset);
                } 
            }
            
            return res;
        },
        
        onDone: function(){
            this._collapseIndex = undefined;
            this._collapseItem = undefined;
            this._collapseOffset = undefined;
        },

        scrollTo: function (val) {
            var fn;

            if (this.orientation === CrosstabHeaderView.Orientation.VERTICAL) {
                fn = this.$el.scrollTop
            } else if (this.orientation === CrosstabHeaderView.Orientation.HORIZONTAL) {
                fn = this.$el.scrollLeft
            }

            return fn.call(this.$el, val);
        },

        enableHyperlinks: function (linkOptions) {
            this.hyperlinks = true;
            if (linkOptions.events) {
                var self = this;
                for (var key in linkOptions.events) {
                    this.hyperlinkEnabledFor.push(key);
                    this.$el.on(key, ".jr-jHyperLink", function (ev) {
                        var index = +ev.currentTarget.getAttribute("data-local-index"),
                            depth = +ev.currentTarget.getAttribute("data-local-depth");

                        self.trigger("hyperlink", {
                            context: this,
                            event: ev,
                            data: self.getHyperlinkData(index, depth)
                        });
                    });
                }
            }
        },

        disableHyperlinks: function(){
            this.hyperlinks = false;
            for (var i = 0; i < this.hyperlinkEnabledFor; i++){
                this.$el.off(this.hyperlinkEnabledFor[i], ".jr-jHyperLink");
            }
        },

        getHyperlinkData: function () {
            var index = arguments[0],
                items = this.items,
                data = {},
                depth;

            if (arguments.length > 1) {
                depth = Math.min(arguments[1], this.items.length - 1);
            } else {
                depth = this.items.length - 1;
            }

            for (var i = 0; i <= depth; i++) {
                if (items[i].aggregations) {
                    data["Measures"] = [this.data.range[index][i].isTotal ? "total_node" : this.data.range[index][i].label];
                } else {
                    data[items[i].level.id || items[i].level.field] = this.data.range[index][i].isTotal ? "total_node" : this.data.range[index][i].label;
                }
            }
            return data;
        },
        
        getHyperlinks: function(){
            var res = {
                    all: [],
                    bottomDataRow: []
                },
                data, index, depth, bottomDataIndex, elements,
                actualSize = this.items.length;

            if (actualSize === 0) {
                res.bottomDataRow.push({});
            } else {
                bottomDataIndex = actualSize - 1;
                elements = this.$(".jr-jHyperLink");

                for (var el = 0, ell = elements.length; el < ell; el++) {
                    index = +elements[el].getAttribute("data-local-index");
                    depth = +elements[el].getAttribute("data-local-depth");

                    if (depth < actualSize) {
                        data = this.getHyperlinkData(index, depth);
                        res.all.push({
                            element: elements[el],
                            data: data
                        });

                        if (depth === bottomDataIndex) {
                            res.bottomDataRow.push(data);
                        }
                    }
                }
            }
            return res;
        }
    }, {
        Orientation: {
            VERTICAL: "rows",
            HORIZONTAL: "columns"
        }
    });

    return CrosstabHeaderView;
});