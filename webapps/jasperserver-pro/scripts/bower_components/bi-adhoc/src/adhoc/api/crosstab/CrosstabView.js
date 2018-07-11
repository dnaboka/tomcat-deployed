/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        log = require("logger").register(module),
        i18n = require("bundle!AdHocBundle"),

        AuxModel = require("./model/CrosstabAuxModel"),

        crosstabTemplate = require("text!./template/crosstabTemplate.htm"),

        CrosstabCornerView = require("./view/CrosstabCornerView"),
        CrosstabHeaderView = require("./view/CrosstabHeaderView"),
        CrosstabBodyView = require("./view/CrosstabBodyView"),

        SCROLL_VERTICAL = "vert",
        SCROLL_HORIZONTAL = "horz";

    require('perfect-scrollbar');
    require('css!jasper-ui/perfect-scrollbar.css');

    require('css!jasper-ui/jr-reset.css');
    require('css!jasper-ui/base.css');
    require('css!jasper-ui/datatable.css');
    require('css!jasper-ui/icon.css');
    require('css!jasper-ui/utility.css');

    function findExpansionMember(model) {
        if (model.has("member")) {
            var member = model.get("member");
            if (member.path.length === this.member.path.length) {
                for (var i = 0; i < member.path.length; i++) {
                    if (member.path[i] !== this.member.path[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    function findExpansionLevel(model) {
        return model.has("level") && model.get("level").fieldRef === this.level.fieldRef;
    }

    function expandLevelsWithoutSummary(levels, expCollection){
         var level, parent, expansion, exp;

        for (level = levels.length - 1; level > -1; level--) {
            if (!levels.models[level].hasSummary() && !levels.models[level].isMeasure()) {
                parent = levels.models[level];
                while ((parent = parent.prevLevel()) && (!parent.hasSummary() || parent.isMeasure()));

                if (isLevelExpanded(parent, expCollection)) {
                    parent = levels.models[level].prevLevel();

                    if (parent) {
                        expansion = expCollection.getByGroupByItem(parent.isMeasure() ? {aggregations:{}} : parent.level().toQueryMultiaxisAxisItem());
                        exp = _.clone(expansion.get("level"));
                        exp.expanded = true;
                        expansion.set("level", exp);
                    } else {
                        // make sure first level is expanded.
                        // it is always expanded by now
                    }
                }
            }
        }
    }

    function isLevelExpanded(level, expCollection) {
        var res, parentLevel,
            parent = level;

        if (parent) {
            // find first non-measures parent
            while ((parent = parent.prevLevel()) && !(parentLevel = parent.level()));

            if (parent) {
                res = expCollection.getByGroupByItem(parentLevel.toQueryMultiaxisAxisItem()).get("level").expanded;
            } else {
                res = true;
            }
        } else {
            res = true;
        }
        return res;
    }

    function resetPagination(columns){
        this._rendering = true;

        if (columns){
            this.crosstabColumnsView.scrollTo(0);
            this.crosstabBodyView.scrollToLeft(0);
        } else {
            this.crosstabRowsView.scrollTo(0);
            this.crosstabBodyView.scrollToTop(0);
        }

        this.auxModel.set(columns ? "colsOffset" : "rowsOffset", 0, {silent: true});
    }

    function validateViewport(data) {
        var newRowOffset, newColOffset;
        if (this._fromScroll) {
            if (this._fromScroll === SCROLL_HORIZONTAL){
                newColOffset = this.crosstabBodyView.validateViewportWidth(data.columns, this.auxModel.get("colsOffset"), this.auxModel.get("colsPageSize"));
            } else {
                newRowOffset = this.crosstabBodyView.validateViewportHeight(data.rows, this.auxModel.get("rowsOffset"), this.auxModel.get("rowsPageSize"));
            }
         } else {
            newRowOffset = validateViewportAxis(data.rows, this.auxModel.get("rowsOffset"), this.auxModel.get("rowsPageSize")),
            newColOffset = validateViewportAxis(data.columns, this.auxModel.get("colsOffset"), this.auxModel.get("colsPageSize"));

            if (newColOffset == -1 && newRowOffset == -1) {
                newRowOffset = this.crosstabRowsView.validateViewport(data.rows, this.auxModel.get("rowsOffset"), this.auxModel.get("rowsPageSize"));
                newColOffset = this.crosstabColumnsView.validateViewport(data.columns, this.auxModel.get("colsOffset"), this.auxModel.get("colsPageSize"));
            }
        }

        if (newColOffset >= 0 || newRowOffset >= 0){
            var res = {};

            if (newColOffset >= 0){
                res.colsOffset = newColOffset;
            }

            if (newRowOffset >= 0){
                res.rowsOffset = newRowOffset;
            }

            return res;
        }
    }

    function validateViewportAxis(newData, curentOffset, currentPageSize) {
        var res = -1;
        if (!newData.range.length && newData.loaded){
            if (curentOffset >= newData.loaded){
                res = curentOffset;
                while (res > newData.loaded){
                    res -= currentPageSize;
                }
                res = Math.max(res, 0);
            }
        }

        return res;
    }

    function min(arr){
        var min = arr[0];
        for (var a = 1; a < arr.length; a++){
            min = min > arr[a] ? arr[a] : min;
        }
        return min;
    }

    function handleTopBottomSorting(axis, expansion, query, auxModel) {
        if (query.get("orderBy")){
            var orderBy = _.each(_.compact(_.map(query.get("orderBy"), function (order) {
                return order.topN || order.bottomN || order.member;
            })), function(orderObj){
                if (expansion.member){
                    var lengDiff = orderObj.path.length - expansion.member.path.length;
                    if (lengDiff <= 2 && lengDiff > 0){
                        for (var i = 0; i < expansion.member.path.length; i++){
                            if (orderObj.path[i] !== expansion.member.path[i]){
                                return;
                            }
                        }
                        auxModel.keepAxis(axis.id);
                    }
                }

                if (expansion.level){
                    var levels = axis.axis.multiAxisMap(function (level, index) {
                            return level;
                        }),
                        levelIndex = 1 + _.reduce(levels, function (memo, level, index) {
                                if ((expansion.level.aggregation && level.isMeasure()) || (expansion.level.fieldRef === level.get("id"))) {
                                    memo = index;
                                }
                                return memo;
                            }, -1),
                        lengDiff = orderObj.path.length - levelIndex;
                    if (lengDiff <= 2 && lengDiff > 0) {
                        auxModel.keepAxis(axis.id);
                    }
                }
            });
        }
    }

    return Backbone.View.extend({

        DEFAULT_CROSSTAB_HEIGHT: 500,

        el: function () {
            return $(_.template(crosstabTemplate)({i18n: i18n}))[0];
        },

        initialize: function (options) {
            this.options = options;

            this.adHocModel = options.dataModel;
            this.auxModel = new AuxModel({}, options);

            this.rowsProperties = {};
            this.columnsProperties = {};

            this._initElements();
            this._initExpansions();

            this.crosstabCornerView = new CrosstabCornerView({
                model: options.dataModel,
                el: this.$headerRowLabelsContainer
            });

            this.crosstabColumnsView = new CrosstabHeaderView({
                model: options.dataModel,
                el: this.$headerColumnLabelsContainer,
                options: options.options,
                orientation: CrosstabHeaderView.Orientation.HORIZONTAL
            });

            this.crosstabRowsView = new CrosstabHeaderView({
                model: options.dataModel,
                el: this.$bodyRowLabelsContainer,
                options: options.options,
                orientation: CrosstabHeaderView.Orientation.VERTICAL
            });

            this.crosstabBodyView = new CrosstabBodyView({
                model: options.dataModel,
                el: this.$bodyDataContainer,
                options: options.options
            });

            this.listenTo(this.crosstabBodyView, "scroll", this.onScroll, this);

            this.crosstabRowsView.listenTo(this.crosstabBodyView, "scroll:y", this.crosstabRowsView.scrollTo, this.crosstabRowsView);
            this.crosstabColumnsView.listenTo(this.crosstabBodyView, "scroll:x", this.crosstabColumnsView.scrollTo, this.crosstabColumnsView);

            this.listenTo(this.crosstabRowsView, "expansion", this.expandRow, this);
            this.listenTo(this.crosstabColumnsView, "expansion", this.expandColumn, this);

            this.listenTo(this.crosstabCornerView, "expansion:column", _.bind(resetPagination, this, true));
            this.listenTo(this.crosstabCornerView, "expansion:row", _.bind(resetPagination, this, false));

            this.listenTo(this.crosstabCornerView, "expansion:column", this.expandColumn, this);
            this.listenTo(this.crosstabCornerView, "expansion:row", this.expandRow, this);

            this.listenTo(this.crosstabBodyView, "hyperlink", this.onHyperlink, this);
            this.listenTo(this.crosstabRowsView, "hyperlink", this.onHyperlink, this);
            this.listenTo(this.crosstabColumnsView, "hyperlink", this.onHyperlink, this);

            //bundles are loaded in parallel, make sure they are loaded before rendering
            this.listenToOnce(this.auxModel, "data:data", function(data){
                this.adHocModel.bundles.bundle().done(_.bind(function(){
                    this.listenTo(this.auxModel, "data:data",this.onDataSetChange, this);

                    this.onDataSetChange(data);
                }, this));
            }, this);

            this.listenTo(this.auxModel, "data:error", _.bind(this.adHocModel.trigger, this.adHocModel, "component:error"));
            this.listenTo(this.auxModel, "data:loading", function(isLoading){
                isLoading && this.adHocModel.trigger("component:busy", true);
            },this);

            this.enableHyperlinks();
        },

        isAcceptable: function (type) {
            return type === "Crosstab";
        },

        render: function ($canvas) {
            if ($canvas) {
                $canvas.append(this.$el);
                this.$el.height() || (this.el.style.height = "100%");
            }

            return this._refresh(new $.Deferred()).promise();
        },

        refresh: function(dfd){
            return this._refresh(dfd, true);
        },

        onDataSetChange: function (data) {
            var newViewPort = validateViewport.call(this, data);
            if (newViewPort) {
                this.auxModel.set(newViewPort);
            } else {
                this.crosstabRowsView.acquireData(data);
                this.crosstabBodyView.acquireData(data);
                this.crosstabColumnsView.acquireData(data);

                this.crosstabCornerView.render();
                this.crosstabBodyView.render();
                this.crosstabRowsView.render();
                this.crosstabColumnsView.render();

                this._resetStyling();

                this._synchronizeWidthsCorner(data);

                this._alignTables(data);

                this._synchronizeWidthsBody(data);
                this._updateStretchedState();

                this._synchronizeHeights(data);

                this._updateViewPortSize(data);
                this._updateScrollState();

                this._applyLookAndFeel();

                //JRS-13925 : Swapped with previous method.
                this._updateCalculatedValues(data);


                this._processLinks();

                this._done();
            }
        },

        expandRow: function(expansion){
            this._expand(this.adHocModel.dataSet.query.rows, expansion);
        },

        expandColumn: function(expansion){
            this._expand(this.adHocModel.dataSet.query.cols, expansion);
        },

        resize: function(){
            this._alignTables();
            this._updateStretchedState();
            this._updateCalculatedValues();
            this._updateScrollState();
            this._checkDataEdge();
        },

        remove: function(){
            this._hasPs && this.$bodyDataContainer.perfectScrollbar("destroy");

            this.crosstabCornerView.remove();
            this.crosstabColumnsView.remove();
            this.crosstabRowsView.remove();
            this.crosstabBodyView.remove();

            this.auxModel.dispose();

            return Backbone.View.prototype.remove.call(this);
        },

        enableHyperlinks: function(linkOptions){
            linkOptions || (linkOptions = this.options.options.linkOptions);

            if (linkOptions){
                this.crosstabColumnsView.enableHyperlinks(linkOptions);
                this.crosstabRowsView.enableHyperlinks(linkOptions);
                this.crosstabBodyView.enableHyperlinks(linkOptions);
            }
        },

        disableHyperlinks: function(){
            this.crosstabColumnsView.disableHyperlinks();
            this.crosstabRowsView.disableHyperlinks();
            this.crosstabBodyView.disableHyperlinks();
        },

        _done: function(){
            this._rendering = false;
            this._fromScroll = false;

            // to make sure, that first portion fits creates scrollbars if required
            if (!this.rendered){
                this.rendered = true;
                this._checkDataEdge();
            }

            this.crosstabRowsView.onDone();
            this.crosstabColumnsView.onDone();

            this.adHocModel.trigger("component:busy", false);
        },

        _refresh: function (dfd, resetDataset) {
            this.rendered = false;
            this._rendering = true;

            this.auxModel.once("data:data", function(){
                dfd.resolve();
            }, this);

            this.crosstabColumnsView.scrollTo(0);
            this.crosstabBodyView.scrollToLeft(0);
            this.crosstabRowsView.scrollTo(0);
            this.crosstabBodyView.scrollToTop(0);

            resetDataset && this.adHocModel.dataSet.resetDataset();
            this.auxModel.reset();

            //direct subscription to execution call errors
            this.adHocModel.dataSet.data().fail(_.bind(dfd.reject, dfd));

            return dfd;
        },

        _expand: function (axis, expansion) {
            if (this.crosstabBodyView.hasData()) {

                handleTopBottomSorting(axis, expansion, this.adHocModel.dataSet.query, this.auxModel);

                var existing = axis.expansions.find(_.bind(expansion.level ? findExpansionLevel : findExpansionMember, expansion));

                if (existing) {
                    if (existing.has("member") && existing.get("member").expanded && !expansion.member.expanded) {
                        axis.expansions.remove(existing);
                    } else {
                        existing.set(expansion);
                    }
                } else {
                    axis.expansions.add(expansion);
                }
            }
        },

        _applyLookAndFeel: function () {
            var rowsAxis = this.adHocModel.component.getCrosstabComponent().getRowsComponent();

            if (!rowsAxis.components.length || !this.crosstabBodyView.hasData()) {
                this.$bodyContainer.addClass("jr-isEmpty");
            }
            //JRS-13925 : Added width calculation here.
            var totalWidth = this.$bodyRowLabelsTable.outerWidth(true) > this.$headerRowLabelsContainer.outerWidth(true)
                ? this.$bodyRowLabelsTable.outerWidth(true) : this.$headerRowLabelsContainer.outerWidth(true)
            var borderWidth = parseInt(this.$bodyDataContainer.css("border-right-width"));

            this.$bodyRowLabelsContainer.width(totalWidth);
            this.$bodyDataContainer.css({left: totalWidth});
            this.$headerRowLabelsContainer.width(totalWidth );
            this.$headerColumnLabelsContainer.css({left: totalWidth });

            //JRS-14982 : Crosstab widths not correct.
            if(this.$el.width() < this.$bodyDataContainer.width() + totalWidth + borderWidth) {
                this.$bodyDataContainer.width(this.$el.width() - totalWidth - borderWidth);
                this.$headerColumnLabelsContainer.width(this.$el.width() - totalWidth - borderWidth);
            }
        },

        _processLinks: function () {
            var linkOptions = this.options.options.linkOptions,
                bodyLinkToElemPairs, columnsLinks, rowsLinks, bodyLinks;

            if (linkOptions && linkOptions.beforeRender) {
                bodyLinkToElemPairs = [];
                bodyLinks = this.crosstabBodyView.$(".jr-jHyperLink");

                columnsLinks = this.crosstabColumnsView.getHyperlinks();
                rowsLinks = this.crosstabRowsView.getHyperlinks();

                for (var row = 0, rl = rowsLinks.bottomDataRow.length; row < rl; row++){
                    for (var col = 0, cl = columnsLinks.bottomDataRow.length; col < cl; col++){
                        bodyLinkToElemPairs.push({
                            element: bodyLinks[row * cl + col],
                            data: _.extend({}, rowsLinks.bottomDataRow[row], columnsLinks.bottomDataRow[col])
                        });
                    }
                }

                linkOptions.beforeRender(rowsLinks.all.concat(columnsLinks.all, bodyLinkToElemPairs));
            }
        },

        _initExpansions: function(){
            expandLevelsWithoutSummary(this.adHocModel.component.getCrosstabComponent().getColumnsComponent().components, this.adHocModel.dataSet.query.cols.expansions);
            expandLevelsWithoutSummary(this.adHocModel.component.getCrosstabComponent().getRowsComponent().components, this.adHocModel.dataSet.query.rows.expansions);
        },

        _initElements: function () {

            this.$headerRowLabelsContainer = this.$(".jr-mDatatableCrosstab-header-rowlabelsContainer");

            this.$headerColumnLabelsContainer = this.$(".jr-mDatatableCrosstab-header-columnlabelsContainer");
            this.$headerColumnLabelsTable = this.$(".jr-mDatatableCrosstab-header-columnlabelsContainer .jr-mDatatable.jr-mDatatableCrosstab");
            this.$headerColumnLabelsBackground = this.$(".jr-mDatatableCrosstab-header-columnlabelsContainer .jr-DatatableCrosstab-background");

            this.$bodyRowLabelsContainer = this.$(".jr-mDatatableCrosstab-body-rowlabelsContainer");
            this.$bodyRowLabelsTable = this.$(".jr-mDatatableCrosstab-body-rowlabelsContainer .jr-mDatatable.jr-mDatatableCrosstab");
            this.adHocModel.component.getCrosstabComponent().get("mergeCrosstabCells") ? '': this.$bodyRowLabelsTable.addClass('jr-isUnmerged')
            this.$bodyRowLabelsBackground = this.$(".jr-mDatatableCrosstab-body-rowlabelsContainer .jr-DatatableCrosstab-background");

            this.$bodyDataContainer = this.$(".jr-mDatatableCrosstab-body-dataContainer");
            this.$bodyContainer = this.$(".jr-mDatatableCrosstab-bodyContainer");
            this.$bodyDataTable = this.$(".jr-mDatatableCrosstab-body-dataContainer .jr-mDatatable.jr-mDatatableCrosstab");
            this.$bodyDataBackground = this.$(".jr-mDatatableCrosstab-body-dataContainer .jr-mDatatableCrosstab-background");
        },

        _updateStretchedState: function(){
            if (this.columnsProperties.stretched) {
                var headerWidth, bodyWidth, headerCells, bodyCells;

                this.$headerColumnLabelsTable.addClass("jr-uWidth-100pc");
                this.$bodyDataTable.addClass("jr-uWidth-100pc");

                // Need to calculate the maxWidth since setting the jr-uWidth-100pc can create sync issues.
                headerCells = this.$headerColumnLabelsContainer.find(".jr-mDatatable-cellSpacer");
                bodyCells = this.$bodyDataTable.find(".jr-mDatatable-cell:lt(" + headerCells.length + ")");
                headerWidth = _.map(headerCells, function (el) {
                    var elem = $(el);
                    return Math.ceil(elem.find("div:first-child").width() + parseFloat(elem.css("padding-left"))
                        + parseFloat(elem.css("padding-right")) + parseInt(elem.css("border-left-width")) + parseInt(elem.css("border-right-width")));
                });
                bodyWidth = _.map(bodyCells, function (el) {
                    var elem = $(el);
                    return Math.ceil(elem.find("div:first-child").width() + parseFloat(elem.css("padding-left"))
                        + parseFloat(elem.css("padding-right")) + parseInt(elem.css("border-left-width")) + parseInt(elem.css("border-right-width")));
                });

                for (var i = 0; i < bodyCells.length; i++) {
                    var width = Math.max(headerWidth[i], bodyWidth[i]);
                    bodyCells[i].style.maxWidth = width + "px";
                    headerCells[i].style.maxWidth = width + "px";
                }
            }
        },

        _synchronizeWidthsBody: function(data){
            var headerWidth, bodyWidth, maxWidths, headerCells, bodyCells;

            headerCells = this.$headerColumnLabelsContainer.find(".jr-mDatatable-cellSpacer");
            bodyCells = this.$bodyDataTable.find(".jr-mDatatable-cell:lt(" + headerCells.length + ")");

            // since the widths can change, we have to recalculate it each rendering
            headerWidth = _.map(headerCells, function (el) {
                var elem = $(el);
                return Math.ceil(elem.find("div:first-child").width() + parseFloat(elem.css("padding-left"))
                    + parseFloat(elem.css("padding-right")) + parseInt(elem.css("border-left-width")) + parseInt(elem.css("border-right-width")));
            });
            bodyWidth = _.map(bodyCells, function (el) {
                var elem = $(el);
                return Math.ceil(elem.find("div:first-child").width() + parseFloat(elem.css("padding-left"))
                    + parseFloat(elem.css("padding-right")) + parseInt(elem.css("border-left-width")) + parseInt(elem.css("border-right-width")));
            });

            maxWidths = [];
            for (var i = 0; i < bodyWidth.length; i++) {
                var item = data.columns.range[i][data.columns.range[i].length - 1],
                    maxWidth = Math.max(headerWidth[i], bodyWidth[i], item.pixels || 0);

                maxWidths.push(maxWidth);
                item.pixels = maxWidth;
            }

            data.columns.resultPixels = maxWidths;

            for (var i = 0, l = maxWidths.length; i<l; i++){
                var style =  maxWidths[i] + "px";
                bodyCells[i].style.minWidth = style;
                headerCells[i].style.minWidth = style;
            }

            this.columnsProperties.minCellSize = min(maxWidths.length ? maxWidths : headerWidth);
        },

        _synchronizeWidthsCorner: function (data) {
            var cornerCells = this.$headerRowLabelsContainer.find(".jr-mDatatable-cellColumnlabel"),
                rowHeaderCells = this.$bodyRowLabelsContainer.find(".jr-mDatatable-row:first").find(".jr-mDatatable-cell"),
                cornerWidths, rowHeaderWidth, count;

            if (cornerCells.length) {
                cornerWidths = _.map(cornerCells, function (el) {
                    var elem = $(el);
                    return Math.ceil(elem.find("div:first-child").width() + parseFloat(elem.css("padding-left"))
                        + parseFloat(elem.css("padding-right")) + parseInt(elem.css("border-left-width")) + parseInt(elem.css("border-right-width")));
                });

                rowHeaderWidth = _.map(rowHeaderCells, function (el) {
                    var elem = $(el);
                    return Math.ceil(elem.find("div:first-child").width() + parseFloat(elem.css("padding-left"))
                        + parseFloat(elem.css("padding-right")) + parseInt(elem.css("border-left-width")) + parseInt(elem.css("border-right-width")));
                });

                count = Math.min(cornerCells.length, rowHeaderCells.length);

                for (var i = 0; i < count; i++) {
                    var style = Math.max(cornerWidths[i], rowHeaderWidth[i]) + "px";
                    cornerCells[i].style.minWidth = style;
                    rowHeaderCells[i].style.minWidth = style;
                }
            }
        },

        _synchronizeHeights: function(data){
            var headerHeight, bodyHeight, maxHeights, headerCells, bodyCells;

            if (Math.abs(this.$bodyDataTable.height() - this.$bodyRowLabelsTable.height()) <= 1 &&
                this.$bodyDataTable.find(".jr-mDatatable-cell-wrapper:first").css("whiteSpace") === "nowrap"){
                // if no-wrap mode, all the rows have same height
                // Math.abs is a workaround for issue, when at the bottom one of the tables are bigger because of borders issue
                // Actually, the heights supposed to be equal
                if (!this.rowsProperties.minCellSize) {
                    this.rowsProperties.minCellSize = this.$(".jr-mDatatable-cell:first")[0].offsetHeight
                }

                maxHeights = [];
                for (var i = 0; i < data.rows.range.length; i++) {
                    var item = data.rows.range[i][data.rows.range[i].length - 1];
                    maxHeights.push(this.rowsProperties.minCellSize);
                    item.pixels = this.rowsProperties.minCellSize;
                }

                data.rows.resultPixels = maxHeights;
            } else {
                // it is wrap node or font/row size customizations were made

                // body cells
                headerCells = this.$bodyRowLabelsContainer.find(".jr-mDatatable-row").find(".jr-mDatatable-cell:last");
                bodyCells = this.$bodyDataTable.find(".jr-mDatatable-row").find(".jr-mDatatable-cell:first");

                // since the height can change, we have to recalculate it each rendering
                headerHeight = _.map(headerCells, function (el) {
                    return el.offsetHeight;
                });
                bodyHeight = _.map(bodyCells, function (el) {
                    return el.offsetHeight;
                });

                maxHeights = [];
                for (var i = 0; i < bodyHeight.length; i++) {
                    var item = data.rows.range[i][data.rows.range[i].length - 1],
                        maxWidth = Math.max(headerHeight[i], bodyHeight[i], item.pixels || 0);

                    maxHeights.push(maxWidth);
                    item.pixels = maxWidth;
                }

                data.rows.resultPixels = maxHeights;

                for (var i = 0, l = maxHeights.length; i < l; i++) {
                    var style = maxHeights[i] + "px";
                    bodyCells[i].style.height = style;
                    headerCells[i].style.height = style;
                }

                // header cells

                var cornerCells = this.$headerRowLabelsContainer.find(".jr-mDatatable-row"),
                    columnHeaderCells = this.$headerColumnLabelsContainer.find(".jr-mDatatable-row"),

                    cornerHeights = _.map(cornerCells, function (el) {
                        return el.offsetHeight;
                    }),

                    rowHeaderHeights = _.map(columnHeaderCells, function (el) {
                        return el.offsetHeight;
                    }),
                    count = Math.min(cornerHeights.length, rowHeaderHeights.length);

                for (var i = 0; i < count; i++) {
                    var style = Math.max(cornerHeights[i], rowHeaderHeights[i]) + "px";
                    cornerCells[i].style.height = style;
                    columnHeaderCells[i].style.height = style;
                }

                this.rowsProperties.minCellSize = min(maxHeights.length ? maxHeights : headerHeight);
            }
        },

        _alignTables: function(){
            var width = this.$el.width(),
                height = this.$el.height(),
                dataHeight = this.$bodyDataTable.height(),
                xPointX,xPointY;

            xPointX = this.$headerRowLabelsContainer.width();
            xPointY = this.$headerRowLabelsContainer.height();

            if (width - xPointX < 75){
                width += xPointX;
                this.$el.css({overflowX: "auto"});
                this._overflowXEnabled = true;
            } else if (this._overflowXEnabled){
                this.$el.css({overflowX: "hidden"});
                this._overflowXEnabled = false;
            }

            if (height - xPointY < 75){
                height += xPointY;
                this.$el.css({overflowY: "auto"});
                this._overflowYEnabled = true;
            }else if (this._overflowYEnabled){
                this.$el.css({overflowX: "hidden"});
                this._overflowYEnabled = false;
            }

            this.$headerColumnLabelsContainer.css({
                left: xPointX,
                width: width - xPointX
            });

            this.$bodyRowLabelsContainer.css({
                top: xPointY,
                height: Math.min(height - xPointY, dataHeight),
                width: xPointX
            });

            this.$bodyDataContainer.css({
                top: xPointY,
                left: xPointX,
                width: width - xPointX,
                height: Math.min(height - xPointY, dataHeight)
            });

            this.columnsProperties.stretched = Math.max(this.$headerColumnLabelsTable.width(), this.$bodyDataTable.width()) <= this.$bodyDataContainer.width();
        },

        _updateViewPortSize: function(data) {
            var top = data.rows.top < 0 ? 0 : data.rows.top,
                left = data.columns.top < 0 ? 0 : data.columns.top,
                width = data.columns.bottom + left + _.reduce(data.columns.resultPixels, function (memo, item) {
                        return memo + item;
                    }),
                height = data.rows.bottom + top + _.reduce(data.rows.resultPixels, function (memo, item) {
                        return memo + item;
                    }),
                scrollTop = this.crosstabRowsView.getRequiredScrollPosition(),
                scrollLeft = this.crosstabColumnsView.getRequiredScrollPosition();


            this._dataTop(top);
            this._dataLeft(left);
            this._backgroundWidth(width);
            this._backgroundHeight(height);

            if (scrollLeft >= 0) {
                this.crosstabBodyView.scrollToLeft(scrollLeft);
            }
            if (scrollTop >= 0) {
                this.crosstabBodyView.scrollToTop(scrollTop);
            }

            this.crosstabBodyView.onScroll();
        },

        _updateScrollState: function () {
            if (this._hasPs) {
                this.$bodyDataContainer.perfectScrollbar("update");
            } else {
                this.$bodyDataContainer.perfectScrollbar();
                this._hasPs = true;
            }
        },

        _updateCalculatedValues: function(data){
            if (data){
                this.rowsProperties.hasFirst = data.rows.hasFirst;
                this.rowsProperties.hasLast = data.rows.hasLast;

                this.columnsProperties.hasFirst = data.columns.hasFirst;
                this.columnsProperties.hasLast = data.columns.hasLast;
            }

            this.rowsProperties.visible = Math.ceil(this.$bodyDataContainer.height() / this.rowsProperties.minCellSize);
            this.columnsProperties.visible = Math.ceil(this.$bodyDataContainer.width() / this.columnsProperties.minCellSize);

            this.rowsProperties.additional = Math.min(Math.floor(this.rowsProperties.visible / 2), 12);
            this.columnsProperties.additional = Math.min(Math.floor(this.columnsProperties.visible / 2), 12);

            this.rowsProperties.dataSizeInPixels = this.$bodyDataTable.height();
            this.columnsProperties.dataSizeInPixels = this.$bodyDataTable.width();

            this.rowsProperties.viewportSizeInPixels = this.$bodyDataContainer.height();
            this.columnsProperties.viewportSizeInPixels = this.$bodyDataContainer.width();

            this.rowsProperties.dataOffsetInPixels = this._dataTop();
            this.columnsProperties.dataOffsetInPixels = this._dataLeft();
        },

        _resetStyling: function () {
            this.$headerRowLabelsContainer.attr("style", "");
            this.$headerColumnLabelsContainer.attr("style", "");
            this.$bodyRowLabelsContainer.attr("style", "");

            this.$headerColumnLabelsTable.removeClass("jr-uWidth-100pc");
            this.$bodyDataTable.removeClass("jr-uWidth-100pc");
            this.$bodyContainer.removeClass("jr-isEmpty");
        },

        onScroll: function (ev) {
            this._checkDataEdge(ev);
        },

        onHyperlink: function (payload) {
            var linkOptions = this.options.options.linkOptions,
                handler = linkOptions.events[payload.event.type],
                data = payload.data;

            if (handler) {
                if (!data) {
                    data = _.extend({}, this.crosstabColumnsView.getHyperlinkData(payload.column), this.crosstabRowsView.getHyperlinkData(payload.row));
                }

                handler.call(payload.context, payload.event, data);
            }
        },

        _checkDataEdge: function (ev) {
            if (!this._rendering){
                if (!this.rowsProperties.hasFirst && this._isTopEdge(ev)) {
                    this._rendering = true;
                    this._fromScroll = SCROLL_VERTICAL;

                    this.auxModel.set({
                        rowsOffset: Math.max(0, this.auxModel.get("rowsOffset") - this.rowsProperties.visible),
                        rowsPageSize: this.rowsProperties.additional + this.rowsProperties.visible + this.rowsProperties.additional
                    });
                } else  if (!this.rowsProperties.hasLast && this._isBottomEdge(ev)) {
                    this._rendering = true;
                    this._fromScroll = SCROLL_VERTICAL;

                    this.auxModel.set({
                        rowsOffset: Math.max(0, this.auxModel.get("rowsOffset") + this.auxModel.get("rowsPageSize") - this.rowsProperties.additional - this.rowsProperties.visible),
                        rowsPageSize: this.rowsProperties.additional + this.rowsProperties.visible + this.rowsProperties.additional
                    });
                } else if (!this.columnsProperties.hasFirst && this._isLeftEdge(ev)) {
                    this._rendering = true;
                    this._fromScroll = SCROLL_HORIZONTAL;

                    this.auxModel.set({
                        colsOffset: Math.max(0, this.auxModel.get("colsOffset") - this.columnsProperties.additional),
                        colsPageSize: this.columnsProperties.additional + this.columnsProperties.visible + this.columnsProperties.additional
                    });

                } else if (!this.columnsProperties.hasLast && this._isRightEdge(ev)) {
                    this._rendering = true;
                    this._fromScroll = SCROLL_HORIZONTAL;

                    this.auxModel.set({
                        colsOffset: Math.max(0, this.auxModel.get("colsOffset") + this.auxModel.get("colsPageSize") - this.columnsProperties.additional - this.columnsProperties.visible),
                        colsPageSize: this.columnsProperties.additional + this.columnsProperties.visible + this.columnsProperties.additional
                    });
                }
            }
        },

        _dataTop: function (top) {
            if (top === undefined) {
                return +this.$bodyDataTable.css("top").replace("px", "");
            } else {
                this.$bodyDataTable.css({top: top});
                this.$bodyRowLabelsTable.css({top: top});
            }
        },

        _dataLeft: function (left) {
            if (left === undefined) {
                return +this.$bodyDataTable.css("left").replace("px", "");
            } else {
                this.$bodyDataTable.css({left: left});
                this.$headerColumnLabelsTable.css({left: left});
            }
        },

        _backgroundHeight: function (height) {
            if (height === undefined) {
                return this.$bodyDataBackground.height();
            } else {
                this.$bodyDataBackground.height(height);
                this.$bodyRowLabelsBackground.height(height);
            }
        },

        _backgroundWidth: function (width) {
            if (width === undefined) {
                return this.$bodyDataBackground.width();
            } else {
                this.$bodyDataBackground.width(width);
                this.$headerColumnLabelsBackground.width(width);
            }
        },

        _isBottomEdge: function (ev) {
            var scroll = ev ? ev.top : this.$bodyDataContainer.scrollTop();
            return scroll + this.rowsProperties.viewportSizeInPixels >= this.rowsProperties.dataOffsetInPixels + this.rowsProperties.dataSizeInPixels;
        },

        _isTopEdge: function (ev) {
            var scroll = ev ? ev.top : this.$bodyDataContainer.scrollTop();
            return scroll < this.rowsProperties.dataOffsetInPixels
        },

        _isLeftEdge: function (ev) {
            var scroll = ev ? ev.left : this.$bodyDataContainer.scrollLeft();
            return scroll < this.columnsProperties.dataOffsetInPixels;
        },

        _isRightEdge: function (ev) {
            var scroll = ev ? ev.left : this.$bodyDataContainer.scrollLeft();
            return scroll + this.columnsProperties.viewportSizeInPixels >= this.columnsProperties.dataOffsetInPixels + this.columnsProperties.dataSizeInPixels;
        }
    });
});