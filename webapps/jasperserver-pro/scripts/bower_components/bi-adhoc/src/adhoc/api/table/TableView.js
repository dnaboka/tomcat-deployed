/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author:
 * @version: $Id$
 */

/* global console */

define(function (require, exports, module) {
    "use strict";


    var _ = require("underscore"),
        $ = require("jquery"),
        Backbone = require("backbone"),
        log = require("logger").register(module),
        i18n = require("bundle!AdHocBundle"),

        generalTableLayout = require("text!./template/generalTableLayout.htm"),
        tableHeaderTemplate = require("text!./template/tableHeaderTemplate.htm"),
        tableBodyTemplate = require("text!./template/tableBodyTemplate.htm"),
        tableFooterTemplate = require("text!./template/tableFooterTemplate.htm"),

        TableDataConverter = require("./model/tableDataConverter"),
        cellTypesFactory = require("../model/factory/cellTypesFactory"),

        headerContextMenuFactory = require("./factory/headerContextMenuFactory"),
        headerMultiSelectContextMenuFactory = require("./factory/headerMultiSelectContextMenuFactory"),

        tableHeaderTemplateFn = _.template(tableHeaderTemplate),
        tableBodyTemplateFn = _.template(tableBodyTemplate),
        tableFooterTemplateFn = _.template(tableFooterTemplate);

    require('perfect-scrollbar');

    function stripExtendedData(extendedData) {
        var newData = _.cloneDeep(extendedData);
        try {
            if (extendedData.column){
                newData.column = stripExtendedDataObject(extendedData.column);
            }

            if (extendedData.group){
                newData.group = _.map(extendedData.group, stripExtendedDataObject);
            }

            if (extendedData.row && extendedData.row.cells){
                newData.row.cells = _.map(extendedData.row.cells, stripExtendedDataObject);
            }

        } catch (e){
            return {};
        }

        return newData;
    }

    function stripExtendedDataObject(object){
        return _.pick(object || {}, "index", "label", "labelId", "value");
    }

    var TableView =  Backbone.View.extend({

        el: function () {
            return _.template(generalTableLayout)({i18n: i18n});
        },

        initialize: function (options) {
            _.bindAll(this, "onScroll", "onBottomScroll");

            var self = this;

            this._initElements();

            this.options = options;

            if (!_.isObject(options.dataModel)) {
                throw Error("Missing required init option adhocModel");
            }

            this.adHocModel = options.dataModel;
            this.tableModel = this.adHocModel.component.getTableComponent();
            this.dataConverter = new TableDataConverter();

            this.rows = [];
            this.rowHeights = [];

            this.activeRowsStart = 0;
            this.activeRowsEnd = 0;
            this.currentLoadedOffset = 0;
            this.defaultPageSize = 50;
            this.emptyMessageHeight = 0;

            this.on("scroll:loading", function(){
                if(!self.isDataLoading){
                    self.isDataLoading = true;
                    self._loadNewPortion().done(function(){
                        self._loadNewActiveRows(true);
                        self.isDataLoading = false;
                        self._setOverlay(false);
                    });
                }
            });

            this.on("scroll:scroll", this._loadNewActiveRows, this);

            // scroll watch dog
            this.on("scroll:scroll scroll:loading", function(){
                self._scrollTimer && clearTimeout(self._scrollTimer);

                self._scrollTimer = setTimeout(function(){
                    var currentTableOffset = +self.$tableBodyContainer.css("top").replace("px", ""),
                        currentTableHeight = self.$tableBodyContainer.height(),
                        currentOffsetTop = self.$bodyDataContainer.scrollTop(),
                        viewportHeight = self.$el.height();

                    if (currentOffsetTop < currentTableOffset
                        || currentTableOffset + currentTableHeight < currentOffsetTop + viewportHeight) {
                        self._loadNewActiveRows(true);
                    }
                }, 100);
            });

            this.on("scroll:bottom", function () {
                if (self.isDataLoading) {
                    self._setOverlay(true);
                }
            });

            this.$bodyDataContainer.on("scroll", this.onScroll);
            this.$bottomDataContainer.on("scroll", this.onBottomScroll);
        },

        isAcceptable: function (type) {
          return type === "Table";
        },

        render: function ($canvas) {
            this._setOverlay(true);
            this._clear();

            var self = this,
                dfd = $.Deferred(),
                dataDfd = this.adHocModel.dataSet.data().fail(_.bind(dfd.reject, dfd)),
                bundleDfd = this.adHocModel.bundles.bundle().fail(_.bind(dfd.reject, dfd));

            $.when(dataDfd, bundleDfd).done(function(dataSet, i18n){
                self.rows = [];
                self.rowHeights = [];
                self._acquireDataSet(dataSet);

                $canvas && $canvas.append(self.$el);

                self.$tableHeaderContainer.html(tableHeaderTemplateFn({
                    header: self.headerRow = self._getHeaderRow(),
                    widths: self.columnWidths,
                    cellTypesFactory: cellTypesFactory
                }));

                self.renderData = self.rows;
                self.$tableBodyContainer.html(tableBodyTemplateFn({
                    data: self.rows,
                    widths: self.columnWidths,
                    cellTypesFactory: cellTypesFactory
                }));

                self.$tableBottomContainer.html(tableFooterTemplateFn({
                    footer: self.dataConverter.grandTotalRow,
                    widths: self.columnWidths,
                    cellTypesFactory: cellTypesFactory
                }));

                self.activeRowsStart = 0;
                self.activeRowsEnd = self.rows.length;

                self._processLinks();

                self.$el.css({maxWidth: $(self.options.options.container).width()});
                self._checkData();
                self._calculateSizes();
                self._checkloadActiveRows(false);
                self._updateTableSize();

                self._initPerfectScrollbar();

                self._setOverlay(false);

                dfd.resolve();
            });

            return dfd.promise();
        },

        _setOverlay: function (show) {
            this.adHocModel.trigger("component:busy", show);
        },

        _clear: function(){
            this.dataConverter.reset();

            this.currentLoadedOffset = 0;
            this.adHocModel.dataSet.set({
                "params": {
                    offset: [0],
                    pageSize:  [this.defaultPageSize]
                }
            });
        },

        _checkData: function () {
            if (this.rows.length || this.dataConverter.grandTotalRow.length) {
                this.$emptyMessage.addClass("jr-isHidden");
            } else {
                this.$emptyMessage.removeClass("jr-isHidden");
                this.emptyMessageHeight = this.$emptyMessage[0].clientHeight;
            }
        },

        _calculateSizes: function() {

            var self = this,
            //added this code to explicitly set the new width of div inside th and td as per JRS-14233

            tableHeadersData = self.$(".jr-mDatatable-cell.jr");
            for (var rowIdx = 0; rowIdx < tableHeadersData.length; rowIdx++) {
                var totalWidth = $(tableHeadersData[rowIdx]).innerWidth() - $(tableHeadersData[rowIdx]).width();
                ($(tableHeadersData[rowIdx]).find("div.jr-mDatatable-cell-wrapper")).width(tableHeadersData[rowIdx].offsetWidth - totalWidth);
            }

            var offsetTop = 0, totalTop, rowIdx, size,
                currentBodyContainerHeight = this.$el.height() - this.$(".jr-mDatatable-headerContainer").height(),
                renderedRows = this.$(".jr-mDatatable-bodyContainer table tr").length;

            // calculate average row height
            this.rowHeight = this.$(".jr-mDatatable-bodyContainer table").height() / renderedRows;

            // save height for each row
            this.$(".jr-mDatatable-bodyContainer table tr").each(function (idx, elem) {
                if (!self.rowHeights[idx + self.activeRowsStart]){
                    self.rowHeights[idx + self.activeRowsStart] = $(elem).height();
                }
            });

            // calculate top offset for rendered data
            for (rowIdx = 0; rowIdx < this.activeRowsStart; rowIdx++) {
                offsetTop += this.rowHeights[rowIdx];
            }
            totalTop = offsetTop;

            for (rowIdx = this.activeRowsStart, size = this.rowHeights.length; rowIdx < this.rowHeights.length; rowIdx++) {
                totalTop += this.rowHeights[rowIdx];
            }

            this.$bodyBackground.height(totalTop+1);
            this.$tableBodyContainer.css({top: offsetTop + "px"});

            if (this.$tableBodyContainer.height() + this.$bodyCompensator.height() < currentBodyContainerHeight) {
                this.$bodyDataContainer.css({height: "initial"});
              // added the following condition for JRS-14575.
            } else if(this.$bodyDataContainer.height() > this.$el.parent().height()){
                this.$bodyDataContainer.css({height: currentBodyContainerHeight});
            }

            // Apply 95% width to Message, when Table width less then Message original width.
            if (this.$tableBodyContainer.width() - this.$emptyMessage.find(".jr-mMessage").width() < 5) {
                this.$emptyMessage.find(".jr-mMessage").addClass("jr-uWidth-95pc");
            }

            // Fix for http://jira.jaspersoft.com/browse/JRS-13059.
            this.$bottomDataContainer.css({bottom: this.$bottomDataContainer.height() + "px"});
            this.$bodyCompensator.height(this.$bottomDataContainer.find("div").height());
        },

        _initElements: function () {
            this.$tableHeaderContainer = this.$(".jr-mDatatable-headerContainer table:first");
            this.$tableBodyContainer = this.$(".jr-mDatatable-bodyContainer table:first");
            this.$tableBottomContainer = this.$(".jr-mDatatable-bottomContainer table:first");
            this.$bodyBackground = this.$(".jr-jBodyBackground");
            this.$headerDataContainer = this.$(".jr-mDatatable-headerContainer table:first");
            this.$bodyDataContainer = this.$(".jr-mDatatable-bodyContainer");
            this.$bottomDataContainer = this.$(".jr-mDatatable-bottomContainer");
            this.$emptyMessage = this.$(".jr-jEmptyMessage");
            this.$bodyCompensator = this.$(".jr-mDatatable-bodyContainer .jr-uCompensator");
            this.$emptyMessageWidth = 0;
        },

        _initPerfectScrollbar: function () {
            // JRS-14512: Added horizontal scrollbar for bottomContainer if bodyContainer was table is empty.
            if (this._hasPs){
                this.$tableBodyContainer.width() === 0 ? this.$bottomDataContainer.perfectScrollbar("update") : this.$bodyDataContainer.perfectScrollbar("update");
            } else {
                this.$tableBodyContainer.width() === 0 ? this.$bottomDataContainer.perfectScrollbar() : this.$bodyDataContainer.perfectScrollbar();
                this._hasPs = true;
            }
        },

        _loadNewPortion: function () {
            var offset = this.currentLoadedOffset + this.defaultPageSize,
                total = this.adHocModel.dataSet.get("totalCounts"),
                result;

            if (total <= offset) {
                result = new $.Deferred().resolve(this.adHocModel.dataSet).promise();
            } else {
                this.currentLoadedOffset = offset;
                result = this.adHocModel.dataSet.set({
                    "params": {
                        offset: [offset],
                        pageSize: [this.defaultPageSize]
                    }
                }).data()
                    .done(_.bind(this._acquireDataSet, this))
                    .fail(_.bind(this.adHocModel.trigger, this.adHocModel, "component:error"));
            }

            return result;
        },

        _acquireDataSet: function (dataSet) {
            dataSet || (dataSet = this.adHocModel.dataSet.get("dataset"));

            this.rows = this.rows.concat(this.dataConverter.convert(this.adHocModel, dataSet));
            this.columnWidths || (this.columnWidths = this._getColumnWidths());
        },

        _getColumnWidths: function () {
            return this.tableModel.components.findComponentDeep("column").map(function (column) {
                return column.attributes.width;
            });
        },

        _getHeaderRow: function () {
            var columns = this.dataConverter.getColumns();

            return _.map(this.tableModel.components.findComponentDeep("column"), function (column, columnIdx) {
                return {label: column.label(), hyperlink: {
                    id: 'h_'+columnIdx,
                    type: TableDataConverter.linkTypes.HEADER,
                    value: column.label(),
                    column: columns[columnIdx],
                    row: {relativeIndex: -1}
                }};
            });
        },

        _loadNewActiveRows: function(force) {

            var visibleRows = Math.ceil(this.$bodyDataContainer.height() / this.rowHeight),
                scrollTop = this.$bodyDataContainer.scrollTop(),
                scrollPosition = 0,
                scrolledRowsHeight = 0,
                self = this;

            while (scrolledRowsHeight < scrollTop) {
                scrolledRowsHeight += this.rowHeights[scrollPosition++];
            }

            if(force || ((this.activeRowsStart >= scrollPosition && scrollPosition !== 0) || scrollPosition + visibleRows >= this.activeRowsEnd)) {
                this.activeRowsEnd = Math.min(scrollPosition + visibleRows * 2, this.rows.length);

                if (this.activeRowsEnd > this.rowHeights.length){
                    this.activeRowsStart = Math.max(0, scrollPosition - 1);
                    this.activeRowsEnd = Math.min(scrollPosition + visibleRows * 3, this.rows.length);
                } else {
                    this.activeRowsStart = Math.max(0, scrollPosition - visibleRows);
                }

                this.renderData = this.rows.slice(this.activeRowsStart, this.activeRowsEnd);

                self.$tableBodyContainer.html(tableBodyTemplateFn({
                    data: this.renderData,
                    widths: this.columnWidths,
                    cellTypesFactory: cellTypesFactory
                }));

                this._processLinks();

                //JRS-14233 was causing an issue, so added this for re-calculation.
                this._updateTableSize();
                this._calculateSizes();
            }
        },

        _processLinks: function () {
            var view = this,
                linkOptions = view.options.options.linkOptions,
                extendedData, linkData;

            if (linkOptions && linkOptions.beforeRender) {
                linkOptions.beforeRender(view.$el.find(".jr-jHyperLink").map(function(key, element) {
                    extendedData = getExtendedLinkData(view, element);
                    linkData = getLinkData(view, element);

                    return {
                        element: element,
                        data: linkData || stripExtendedData(extendedData)
                    };
                }).toArray());
            }

            if (linkOptions && linkOptions.events) {
                view.events = _.reduce(linkOptions.events, function(events, handler, eventName) {
                    events[eventName + " .jr-jHyperLink"] = function (event) {
                        extendedData = getExtendedLinkData(view, event.currentTarget);
                        linkData = getLinkData(view, event.currentTarget);

                        handler.call(this, event, linkData, null, stripExtendedData(extendedData));
                    };

                    return events;
                }, {});

                view.delegateEvents();
            }

            function getLinkData(view, elem) {
                var result = {},
                    extendedData = getExtendedLinkData(view, elem);

                if (extendedData.column && extendedData.column.kind === "measure") {
                    result["Measures"] = [extendedData.column.id];
                }

                _.each(extendedData.column && extendedData.row && extendedData.row.cells, function (cell) {
                    if (cell.kind === "level") {
                        if (extendedData.linkType === TableDataConverter.linkTypes.GROUP_TOTAL || extendedData.linkType === TableDataConverter.linkTypes.GRAND_TOTAL) {
                            result[cell.id] = "total_node";
                        } else if (extendedData.linkType === TableDataConverter.linkTypes.DATA) {
                            result[cell.id] = cell.initialValue;
                        }
                    }
                });

                _.each(extendedData.group, function (group) {
                    if (extendedData.linkType === TableDataConverter.linkTypes.GRAND_TOTAL) {
                        result[group.id] = "total_node";
                    } else {
                        result[group.id] = group.value;
                    }
                });

                return result;
            }

            function getExtendedLinkData(view, elem) {
                var hyperlinkId = elem.getAttribute("data-hyperlink-id"),
                    links = getLinks(view);

                return _.findWhere(links, {id: hyperlinkId});
            }

            function getLinks(view) {
                var links = [];

                _.each(view.renderData || view.rows, function (row) {
                    _.each(row, function (cell) {
                        links.push(cell.hyperlink);
                    });
                });

                _.each(view.dataConverter.grandTotalRow, function (cell) {
                    links.push(cell.hyperlink);
                });

                _.each(view.headerRow, function (cell) {
                    links.push(cell.hyperlink);
                });

                return links;
            }
        },

        _setTableResizeValue : function(parentWidth) {
            this.$bodyDataContainer.width(parentWidth);
            this.$headerDataContainer.width(parentWidth);
            this.$bottomDataContainer.width(parentWidth);
            this.$el.css({maxWidth: parentWidth});
        },

        _checkloadActiveRows : function(load) {
            var currentTableOffset = +this.$tableBodyContainer.css("top").replace("px", ""),
                currentTableHeight = this.$tableBodyContainer.height(),
                currentOffsetTop = this.$bodyDataContainer.scrollTop(),
                viewportHeight = this.$el.height();

            if (currentOffsetTop < currentTableOffset
                || currentTableOffset + currentTableHeight < currentOffsetTop + viewportHeight) {
                if(load) {
                    this._loadNewActiveRows(true);
                }

                var emptyMessageHeight = this.$emptyMessage[0].clientHeight;
                var headerContainerHeight = this.$headerDataContainer.outerHeight();
                if (!this.$emptyMessage.hasClass("jr-isHidden")) {
                    if(this.$el.height() < this.$(".jr-jEmptyMessage > div").height() + headerContainerHeight && emptyMessageHeight <= this.$el.height() ) {
                        this.$el.height(emptyMessageHeight + headerContainerHeight);
                        this.$emptyMessage.css('top', headerContainerHeight / 2);
                    } else {
                        this.$el.height(emptyMessageHeight);
                    }
                } else {
                    this.$el.height(this.$bodyDataContainer[0].clientHeight + headerContainerHeight);
                }
            }
        },

        _updateTableSize: function() {
            var finalHeight = this.$el.parent().height() - (this.$el.parent().outerHeight(true) - this.$el.parent().outerHeight());
            if(!this.$emptyMessage.hasClass("jr-isHidden")) {
                if(finalHeight < this.emptyMessageHeight) {
                    this.$emptyMessage.height(finalHeight);
                }
            }
            else {
                if(finalHeight - this.$tableHeaderContainer[0].offsetHeight < this.$tableBodyContainer[0].offsetHeight + this.$bodyCompensator.height()){
                    this.$bodyDataContainer.height(finalHeight - this.$tableHeaderContainer[0].offsetHeight);
                    this.$el.css({height: ""});
                }
            }

            var tableWidth = this.$tableBodyContainer[0].offsetWidth == 0 ?
                (this.$tableHeaderContainer[0].offsetWidth == 0 ? this.$tableBottomContainer[0].offsetWidth : this.$tableHeaderContainer[0].offsetWidth) :
                this.$tableBodyContainer[0].offsetWidth;

            if (this.$emptyMessage.hasClass("jr-isHidden")) {
                if($(this.options.options.container).width() > tableWidth
                    && this.$bodyDataContainer[0].offsetWidth !== tableWidth) {
                    this._setTableResizeValue(tableWidth);
                } else if($(this.options.options.container).width() <= tableWidth) {
                    this._setTableResizeValue(this.$el.parent().outerWidth() - (this.$el.parent().outerWidth(true) - this.$el.parent().outerWidth()));

                }
            } else {
                this.$emptyMessageWidth = Math.max(this.$emptyMessageWidth, tableWidth);
                tableWidth<this.$el.parent().width() ? this._setTableResizeValue(this.$emptyMessageWidth) : this._setTableResizeValue(this.$el.parent().width());
            }

        },

        onScroll: function () {
            var currentTableBodyHeight = this.$bodyBackground.height(),
                currentTableBodyScrollTop = this.$bodyDataContainer.scrollTop(),
                currentTableBodyScrollLeft = this.$bodyDataContainer.scrollLeft();

            if (currentTableBodyScrollTop + this.$el.height() >= currentTableBodyHeight - (10 * this.rowHeight)) {
                this.trigger("scroll:loading");
            }

            this.trigger("scroll:scroll");

            if (currentTableBodyScrollTop + this.$el.height() >= currentTableBodyHeight) {
                this.trigger("scroll:bottom");
            }
            this.$(".jr-mDatatable-headerContainer").scrollLeft(currentTableBodyScrollLeft);
            this.$(".jr-mDatatable-bottomContainer").scrollLeft(currentTableBodyScrollLeft);
        },

        onBottomScroll: function () {
            var currentTableBottomScrollLeft = this.$bottomDataContainer.scrollLeft();

            this.$(".jr-mDatatable-headerContainer").scrollLeft(currentTableBottomScrollLeft);
            this.$(".jr-mDatatable-bodyContainer").scrollLeft(currentTableBottomScrollLeft);
        },

        refresh: function (dfd) {
            var self = this;

            this.adHocModel.dataSet.resetDataset();

            this.render().done(function () {
                self.$bodyDataContainer.scrollTop(0);

                dfd.resolve.apply(dfd, arguments);

            }).fail(_.bind(dfd.reject, dfd));
        },

        resize: function(){
            this._checkloadActiveRows(true);
            this._updateTableSize();
            this._initPerfectScrollbar();
        },

        remove: function () {
            this.$bodyDataContainer.off("scroll", this.onScroll);
            this.$bottomDataContainer.off("scroll", this.onBottomScroll);
            return Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return TableView;
});