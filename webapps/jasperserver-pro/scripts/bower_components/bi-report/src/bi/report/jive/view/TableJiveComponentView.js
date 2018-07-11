/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Igor Nesterenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var BaseJiveComponentView =  require("./BaseJiveComponentView"),
        _ = require("underscore"),
        i18n = require("bundle!jasperreports_messages"),
        headerToolbarViewFactory = require("bi/report/jive/factory/headerToolbarViewFactory"),
        JiveOverlayView = require("./overlay/JiveOverlayView"),
        ColumnResizeMarkerView = require("./overlay/ColumnResizeMarkerView"),
        TableFilterDialog = require("bi/report/jive/jr/dialogs/TableFilterDialog"),
        TableFormatDialog = require("bi/report/jive/jr/dialogs/TableFormatDialog"),
        jiveActions = require("bi/report/jive/enum/jiveActions"),
        $ = require("jquery"),
        log =  require("logger").register("Report"),

        dragLabelTemplate = require("text!./overlay/template/dragLabelTemplate.htm");

    require("jquery-ui/jquery.ui.draggable");
    require("jquery-ui/jquery.ui.position");

    //needed for proper rendering of calendar in JIVE
    require("css!jquery-ui/jquery-ui");

    function hideVisualElements() {
        this.overlay && this.overlay.hide();
        this.headerToolbar && this.headerToolbar.hide();
        this.resizeMarker && this.resizeMarker.hide();

        this.currentColumnData = null;
    }

    function onHeaderToolbarSelect(buttonView, buttonModel, e) {
        var message = buttonModel.get("message");
        _.isFunction(this[message]) && this[message](buttonModel);
    }

    function onTableClick(e) {
        var $target = $(e.currentTarget);
        var columnData = this.getColumnData($target);

        this.currentColumnData = columnData;

        this.selectColumn(columnData);
    }

    function onMarkerDragStart(evt, ui) {
        this.resizingColumn = true;
    }

    function onMarkerDrag(evt, ui) {
        this.overlay.$el.width(ui.position.left - this.overlay.$el.position().left);
    }

    function onMarkerDragStop(evt, ui) {
        var scaleFactor = this.model.get("scaleFactor") || 1,
            width = (ui.position.left - this.overlay.$el.position().left) / scaleFactor;

        this.currentColumn.resize({
            width: width < 8 ? 8 : Math.floor(width)
        });

        this.resizingColumn = false;
    }

    function computeDropBoundariesForColumnMove() {
        var column, i, left, tableColumns = [], colData, prop, tableUuid = this.model.get("id");

        this.dropPoints = [];
        this.visibleColumnsMoveData = [];
        this.dropColumns = [];

        var firstColumnHeader = this.reportContainer.find("table.jrPage td.jrcolHeader[data-tableuuid='" + tableUuid + "']").first();
        var parentContainer;

        firstColumnHeader.parents("table").each(function(i, v) {
            parentContainer = $(v);
            tableColumns = parentContainer.find("td.jrcolHeader[data-tableuuid='" + tableUuid + "']");
            if (tableColumns.length > 0) {
                return false; //break each
            }
        });

        var colsData = {};

        for (i = 0; i < tableColumns.length; i++) {
            var colUuid = $(tableColumns.get(i)).data("coluuid"),
                cols, firstColHeader, lastCol, realWidth, firstLeft;
            if (colsData[colUuid]) continue;

            cols = parentContainer.find("td.jrcolHeader[data-coluuid='" + colUuid + "']");
            firstColHeader = cols.eq(0);
            if (cols.size() > 0) {
                lastCol = cols.eq(cols.size()-1);
            } else {
                lastCol = firstColHeader;
            }

            realWidth = firstColHeader.outerWidth();
            firstLeft = firstColHeader.position().left;

            cols.each(function(i, v) {
                var it = $(v);
                if (it.position().left < firstLeft) {//should not happen but let's be safe
                    realWidth += firstLeft - it.position().left;
                    firstLeft = it.position().left;
                }
                if (it.position().left + it.outerWidth() > firstLeft + realWidth) {
                    realWidth = it.position().left + it.outerWidth() - firstLeft;
                }
            });

            colsData[colUuid] = {
                width: realWidth,
                height: lastCol.position().top - firstColHeader.position().top + lastCol.height(),
                colidx: lastCol.data("colidx"),
                uuid: firstColHeader.data("coluuid"),
                cellid: firstColHeader.data("cellid"),
                offset: firstColHeader.offset()
            };
        }

        tableColumns = [];
        for (prop in colsData) {	// convert object to array
            if (colsData.hasOwnProperty(prop)) {
                tableColumns.push(colsData[prop]);
            }
        }
        tableColumns.sort(function(col1, col2) {
            return col1.colidx - col2.colidx;
        });

        for (i = 0; i < tableColumns.length; i++) {
            column = tableColumns[i];
            left = column.offset.left;
            colData = _.findWhere(this.model.config.allColumnsData, { uuid: column.uuid });
            if (colData != null) {
                colData.visible = true;	// enable column
            }
            this.dropColumns.push(column.cellid);
            this.dropPoints.push(left);
            this.visibleColumnsMoveData.push({
                left: left,
                right: left + column.width,
                width: column.width,
                index: colData != null ? colData.index : null,
                uuid: column.uuid
            });

            if (i == tableColumns.length - 1) {
                this.dropPoints.push(left + column.width);
            }
        }

        var markers = [];
        for(i = 0; i < this.dropColumns.length; i++) {
            markers.push(this.dropPoints[i]);
            markers.push(this.dropPoints[i] + (this.dropPoints[i+1] - this.dropPoints[i]) / 2);
        }
        markers.push(this.dropPoints[i]);
        this.dropPoints = markers;
    }

    function onOverlayDragStart(evt, ui) {
        this.currentColMoveData = _.findWhere(this.visibleColumnsMoveData, { uuid: this.currentColumn.get("id") });

        var ci = $.inArray(this.currentColumnData.$header.data("cellid"), this.dropColumns) * 2;
        this.lefDropIndex = ci === 0 ? 0 : ci - 1;
        this.rightDropIndex =  ci + 3 === this.dropPoints.length ? ci + 2 : ci + 3;

        this.delta = this.resizeMarker.$el.position().left - this.dropPoints[ci+2];
        this.dropColumnIndex = ci;

        this.colToMoveToIndex = this.currentColMoveData.index;
    }

    function onOverlayDrag(evt, ui) {
        var i = 0, ln = this.visibleColumnsMoveData.length,
            colMoveData, refColIndex, refColMiddle, isLeftToRight,
            markers = this.dropPoints;

        if(evt.pageX < markers[this.lefDropIndex]) {
            if(this.lefDropIndex > 0){
                this.dropColumnIndex = this.lefDropIndex % 2 == 1 ? this.lefDropIndex - 1 : this.lefDropIndex;
                this.resizeMarker.$el.css("left", markers[this.dropColumnIndex] + this.delta + "px").show();
                this.rightDropIndex = this.lefDropIndex;
                this.lefDropIndex--;
            }
        }
        if(evt.pageX > markers[this.rightDropIndex]) {
            if(this.rightDropIndex < (markers.length-1)) {
                this.dropColumnIndex = this.rightDropIndex % 2 == 1 ? this.rightDropIndex + 1 : this.rightDropIndex;
                this.resizeMarker.$el.css("left", markers[this.dropColumnIndex] + this.delta + "px").show();
                this.lefDropIndex = this.rightDropIndex;
                this.rightDropIndex++;
            }
        }

        // determine move direction
        if (evt.pageX > this.currentColMoveData.right) {
            isLeftToRight = true;
        } else if (evt.pageX < this.currentColMoveData.left){
            isLeftToRight = false;
        }

        // find column based on event.pageX
        for (; i < ln; i++) {
            colMoveData = this.visibleColumnsMoveData[i];
            if (evt.pageX <= colMoveData.right) {
                refColIndex = parseInt(colMoveData.index);
                refColMiddle = colMoveData.left + colMoveData.width / 2;

                if (evt.pageX <= refColMiddle) { // move left, relative to column middle
                    if (refColIndex > 0) {
                        if (isLeftToRight === true) {
                            this.colToMoveToIndex = refColIndex - 1;
                        } else if (isLeftToRight === false) {
                            this.colToMoveToIndex = refColIndex;
                        }
                    } else {
                        this.colToMoveToIndex = 0;
                    }
                } else { // move right, relative to column middle
                    if (isLeftToRight === true) {
                        this.colToMoveToIndex = refColIndex;
                    } else if (isLeftToRight === false) {
                        this.colToMoveToIndex = refColIndex + 1;
                    }
                }
                break;
            }
        }

        if (isLeftToRight && this.colToMoveToIndex == null) {	// for maximum drag to right, move to index of last visible column
            this.colToMoveToIndex = parseInt(this.visibleColumnsMoveData[ln-1].index);
        }
    }

    function onOverlayDragStop(evt, ui) {
        if(this.colToMoveToIndex != null && this.colToMoveToIndex != this.currentColumn.get("columnIndex")) {
            this.currentColumn.move({ index: this.colToMoveToIndex });

        }
    }

    return BaseJiveComponentView.extend({

        init: function(){
            this.reportContainer = this.getReportContainer(this.getReportId());

            this.setGenericProperties(this.model.config.genericProperties);

            this.initJiveComponents(this.reportContainer);
            this.initTableEvents();
        },

        initTableEvents: function(){
            var tableID = this.model.get("id");

            this.headerToolbar && this.listenTo(this.headerToolbar, "select", _.bind(onHeaderToolbarSelect, this));

            this.overlay && this.listenTo(this.overlay, "overlayClicked", _.bind(hideVisualElements, this));

            this.tableElement = this.getReportContainer(this.getReportId());

            this.tableElement.on("click touchend", ".jrPage td.jrcolHeader[data-tableuuid=" + tableID + "]",
                _.bind(onTableClick, this));

            this.tableElement.on("click touchend", ".jrPage td.jrcel[data-tableuuid=" + tableID + "]",
                _.bind(onTableClick, this));

            if (this.resizeMarker) {
                this.listenTo(this.resizeMarker, "marker:dragStart", _.bind(onMarkerDragStart, this));
                this.listenTo(this.resizeMarker, "marker:drag", _.bind(onMarkerDrag, this));
                this.listenTo(this.resizeMarker, "marker:dragStop", _.bind(onMarkerDragStop, this));
            }

            if (this.stateModel.isFloatingTableHeaderEnabled() && this.model.get("hasFloatingHeader")) {
                this.$scrollContainer = $(this.stateModel.get("container"));

                // relax the scroll event triggering a bit by throttling it
                this.$scrollContainer.on("scroll", _.throttle(_.bind(this._scrollHeader, this), 100, { leading: true, trailing: true }));

                this.scrollData = {
                    bMoved: false,
                    reportContainerPositionAtMove: null
                };
            }
        },

        initJiveComponents: function(reportContainer){
            var self = this;

            this.overlay = new JiveOverlayView({
                parentElement: reportContainer
            });

            this.filterDialog = new TableFilterDialog({
                i18n: i18n
            });

            this.formatDialog = new TableFormatDialog({
                i18n: i18n
            });

            this.headerToolbar = headerToolbarViewFactory(this.model.get("type"), {
                parentElement: reportContainer,
                children: this.getHoverMenuChildren(),
                testFn: function(){
                    return _.size(self.model.config.allColumnsData) !==
                        _.compact(self.model.columns).length
                }
            });

            this.headerToolbar.$el.addClass("jr_table");

            this.resizeMarker = new ColumnResizeMarkerView({
                parentElement: reportContainer
            });

            // add drag & drop support for table column overlay
            this.overlay.$el.draggable({
                cursorAt: { top: 40, left: -30 },
                start: function(evt, ui) {
                    onOverlayDragStart.call(self, evt, ui);
                },
                drag: function(evt, ui){
                    onOverlayDrag.call(self, evt, ui);
                },
                stop:function(evt, ui) {
                    onOverlayDragStop.call(self, evt, ui);
                },
                helper: function(evt) {
                    return $(_.template(dragLabelTemplate, { i18n: i18n })).show();
                }
            });

            computeDropBoundariesForColumnMove.call(this);
        },

        sort: function(actionModel){
            var order = actionModel.get("order");
            if(order){
                this.currentColumn.sort({ order: order });
            }
        },

        filter: function(actionModel){
            this.filterDialog.open(this.currentColumn);
        },

        format: function(actionModel){
            this.formatDialog.open(this.currentColumn);
        },

        hideColumn: function(actionModel){
            this.currentColumn.hide();
        },

        showColumn: function(actionModel){
            var index = actionModel.get("index");
            this.currentColumn.unhide(_.isArray(index) ? index : [index]);
        },

        setGenericProperties: function(properties){
            this.genericProperties = properties;
        },

        getGenericProperties: function(){
            return this.genericProperties;
        },

        getHoverMenuChildren: function(){
            var defaultIndexArray = [],
                table = this.model;

            var children =  _.map(table.config.allColumnsData, function(column, index){
                if(column){
                    defaultIndexArray.push(column.index);

                    return {
                        label: column.label,
                        id: column.uuid,
                        message: jiveActions.SHOW_COLUMN,
                        action: "select",
                        index: column.index,
                        test: function(){
                            return !_.find(table.columns, function(tableColumn){
                                return tableColumn && (tableColumn.get("id") === column.uuid);
                            });
                        }
                    }
                }
            });

            // default option
            children.unshift({
                label: i18n["net.sf.jasperreports.components.headertoolbar.label.showcolumns.all"],
                action: "select",
                message: jiveActions.SHOW_COLUMN,
                index: defaultIndexArray
            });

            return _.compact(children);
        },

        getColumnData: function($target){
            var headerID = $target.hasClass("jrcolHeader") ? $target.data("cellid") : $target.attr("class").split(" ")[1].substring(4),
                headerCols = this.reportContainer.find("table.jrPage td.jrcolHeader[data-cellid='" + headerID + "']"),
                firstColHeader = headerCols.eq(0),
                widthSoFar, realWidth, realHeight = null,
                firstLeft = firstColHeader.offset().left,
                scaleFactor = this.model.get("scaleFactor");

            widthSoFar = realWidth = firstColHeader.outerWidth();

            headerCols.each(function(i, col) {
                var $col = $(col);
                if ($col.offset().left < firstLeft) { //should not happen but let's be safe
                    realWidth += firstLeft - $col.offset().left;
                    firstLeft = $col.offset().left;
                }
                if ($col.offset().left + $col.outerWidth() > firstLeft + realWidth) {
                    realWidth = $col.offset().left + $col.outerWidth() - firstLeft;
                    widthSoFar += $col.outerWidth()
                }
            });

            // escape dots to prevent class selection
            headerID = ("" + headerID).replace(/\./g,'\\.');

            firstColHeader.parents().each(function(i, parent) {
                var lastCell = $("td.cel_" + headerID + ":last", parent),
                    cssHeight;
                if(lastCell && lastCell.length > 0) {
                    cssHeight = lastCell.css("height");
                    cssHeight = cssHeight.substring(0, cssHeight.indexOf("px"));
                    realHeight = lastCell.offset().top + parseFloat(cssHeight) * scaleFactor - firstColHeader.offset().top;

                    return false; // break each
                }
            });

            return {
                $header: firstColHeader,
                width: widthSoFar * scaleFactor,
                height: realHeight ? realHeight : firstColHeader.outerHeight() * scaleFactor
            };
        },

        setCurrentColumn: function(columnID){
            this.currentColumn = _.find(this.model.columns,
                function(column){
                    return column && (column.get("id") === columnID);
                });
        },

        selectColumn: function(columnData){
            var columnID = columnData.$header.data("coluuid");
            var firstHeader = columnData.$header;

            this.setCurrentColumn(columnID);

            this.overlay.css({
                width: columnData.width,
                height: columnData.height
            }).show().setPosition({
                my: "left top",
                at: "left top",
                of: firstHeader,
                collision: "none"
            });

            if (this.scrollData && this.scrollData.bMoved) {
                this.headerToolbar.show(true);
                this._setToolbarPositionWhenFloating(this._getHeaderTable());
            } else {
                this.headerToolbar.show(true).setPosition({
                    my: "left bottom+1",
                    at: "left top",
                    of: firstHeader,
                    collision: "none"
                });
            }

            // disable sort buttons
            if (!this.currentColumn.get("canSort")) {
                this.headerToolbar.buttons.disable("sortAsc");
                this.headerToolbar.buttons.disable("sortDesc");
            } else {
                this.headerToolbar.buttons.enable("sortAsc");
                this.headerToolbar.buttons.enable("sortDesc");
            }

            // disable filter button
            if (!this.currentColumn.get("canFilter")) {
                this.headerToolbar.buttons.disable("filter");
            } else {
                this.headerToolbar.buttons.enable("filter");
            }

            this.resizeMarker.css({
                height: columnData.height
            }).show().setPosition({
                my: "left top",
                at: "right top",
                of: this.overlay.$el,
                collision: "none"
            });
        },

        render: function($el){
            var dfd = new $.Deferred();

            this.setDataReportId($el, this.getReportId());

            if (!this.stateModel.isDefaultJiveUiEnabled()) {
                dfd.resolve();
                return dfd;
            }

            this.init();

            this.overlay && this.overlay.render();
            this.headerToolbar && this.headerToolbar.render();
            this.resizeMarker && this.resizeMarker.render();

            log.debug("Apply table jive component: ", this.jiveColumn);

            dfd.resolve();

            return dfd;
        },

        detachEvents: function(){
            this.tableElement && this.tableElement.off();
        },

        remove: function() {
            this.overlay && this.overlay.remove();
            this.filterDialog && this.filterDialog.remove();
            this.formatDialog && this.formatDialog.remove();
            this.resizeMarker && this.resizeMarker.remove();
            this.headerToolbar && this.headerToolbar.remove();

            this.$scrollContainer && this.$scrollContainer.find("table.jr_floating_header").remove();

            BaseJiveComponentView.prototype.remove.call(this, arguments);
        },

        _scrollHeader: function(forceScroll) {
            var scrollContainer = this.$scrollContainer,
                scrolledTop = false,
                scrolledLeft = false,
                scrollData = this.scrollData;

            // Determine scroll direction and value
            if (scrollData.scrollTop != null) { // check previous scrollTop
                if (scrollContainer.scrollTop() != scrollData.scrollTop) {
                    scrollData.scrollTop = scrollContainer.scrollTop();
                    scrolledTop = true;
                }
            } else if (scrollContainer.scrollTop() !== 0) {
                scrollData.scrollTop = scrollContainer.scrollTop();
                scrolledTop = true;
            }

            if (scrollData.scrollLeft != null) { // check previous scrollLeft
                if (scrollContainer.scrollLeft() != scrollData.scrollLeft) {
                    scrollData.scrollLeft = scrollContainer.scrollLeft();
                    scrolledLeft = true;
                }
            } else if (scrollContainer.scrollLeft() !== 0) {
                scrollData.scrollLeft = scrollContainer.scrollLeft();
                scrolledLeft = true;
            }

            if (!scrolledLeft && !scrolledTop && !forceScroll) {
                return;
            }

            var firstHeader = scrollContainer.find("td.jrcolHeader").first();
            if (!firstHeader.length) {
                return;
            }

            var floatingTable = this._getHeaderTable(firstHeader),
                tbl = firstHeader.closest("table"),
                containerTop = scrollContainer.offset().top,
                headerTop = firstHeader.closest("tr").offset().top,
                lastTableCel = firstHeader.closest("table").find("td.jrcel").last(),
                diff = lastTableCel.length ? lastTableCel.offset().top - floatingTable.outerHeight() - containerTop: -1, // if last cell is not visible, hide the floating header
                scaleFactor = this.model.get("scaleFactor");


            if (!scrollData.bMoved && headerTop-containerTop < 0 && diff > 0) {
                floatingTable.show();

                if (scaleFactor) {
                    this._applyScaleTransform(floatingTable, scaleFactor);
                    floatingTable.offset({
                        top: containerTop,
                        left: tbl.offset().left
                    });
                    // do this twice for proper positioning
                    floatingTable.offset({
                        top: containerTop,
                        left: tbl.offset().left
                    });
                } else {
                    floatingTable.offset({
                        top: containerTop,
                        left: tbl.offset().left
                    });
                }

                this._setToolbarPositionWhenFloating(floatingTable);

                scrollData.bMoved = true;
                if (!scrollData.reportContainerPositionAtMove) {
                    scrollData.reportContainerPositionAtMove = containerTop;
                }
            } else if (scrollData.bMoved && headerTop-containerTop < 0 && diff > 0) {
                floatingTable.show();
                if (scaleFactor) {
                    this._applyScaleTransform(floatingTable, scaleFactor);
                    floatingTable.offset({
                        top: containerTop,
                        left: tbl.offset().left
                    });
                } else { //if (scrolledLeft) {
                    floatingTable.offset({
                        top: containerTop,
                        left: tbl.offset().left
                    });
                }

                this._setToolbarPositionWhenFloating(floatingTable);
            } else if (scrollData.bMoved) {
                floatingTable.hide();
                scrollData.bMoved = false;

                this._setToolbarDefaultPosition();
            }
        },

        _getHeaderTable: function(firstHeader) {
            var tbl = this.$scrollContainer.find("table.jr_floating_header");

            if (tbl.length === 0) {
                tbl = $("<table class='jr_floating_header' style='display:none'/>").appendTo(this.$scrollContainer);

                tbl.on("click touchend", '.jrcolHeader', function(evt){
                    // keep html links functional
                    if(!$(evt.target).parent().is('._jrHyperLink')) {
                        var jo = $(this);
                        var coluuid = jo.data('coluuid');
                        var reportTableCell = tbl.parent().find('table.jrPage td.jrcolHeader[data-coluuid=' + coluuid + ']:first');
                        reportTableCell.length && reportTableCell.trigger("click");
                        return false;
                    }
                });

                var parentTable = firstHeader.closest("table"),
                    lastColHeader = parentTable.find("td.jrcolHeader").last(),
                    rows = [], clone, cloneWidth = [], row, $row, lastRow,
                    cloneTD, rowTD, rowTDs, i, j, k, ln, tblJrPage, parentTableRows;

                if (firstHeader.length > 0) {
                    row = firstHeader.closest("tr");
                    lastRow = lastColHeader.closest("tr");
                    tblJrPage = firstHeader.closest("table");

                    if (row === lastRow) {
                        rows.push(row);
                    } else {
                        parentTableRows = parentTable.find('tr');
                        i = parentTableRows.index(row);
                        j = parentTableRows.index(lastRow);

                        for (k = i; k <= j; k++) {
                            rows.push(parentTableRows.get(k));
                        }
                    }

                    $.each(rows, function(idx, row) {
                        $row = $(row);
                        rowTDs = $row.find("td");
                        clone = $("<tr></tr>");

                        $row.attr("valign") && clone.attr("valign", $row.attr("valign"));

                        cloneWidth[idx] = 0;

                        // set width and height for each cloned TD
                        for (i = 0, ln = rowTDs.length; i < ln; i++) {
                            rowTD = $(rowTDs.get(i));
                            cloneTD = rowTD.clone();
                            cloneWidth[idx] = cloneWidth[idx] + rowTD.outerWidth();

                            cloneTD.css("width", rowTD.css("width"));
                            cloneTD.css("height", rowTD.css("height"));
                            clone.append(cloneTD);
                        }
                        tbl.append(clone);
                    });

                    tbl.css({
                        position: "relative",
                        width: Math.max.apply(Math, cloneWidth),
                        'empty-cells': tblJrPage.css("empty-cells"),
                        'border-collapse': tblJrPage.css("border-collapse"),
                        'background-color': tblJrPage.css("background-color")
                    });

                    tbl.attr("cellpadding", tblJrPage.attr("cellpadding"));
                    tbl.attr("cellspacing", tblJrPage.attr("cellspacing"));
                    tbl.attr("border", tblJrPage.attr("border"));
                }
            }

            return tbl;
        },

        _setToolbarPositionWhenFloating: function(floatingTable) {
            var headerToolbar = this.headerToolbar,
                floatingHeader, diff;

            if (headerToolbar.$el.is(":visible")) {

                floatingHeader = floatingTable.find("td.jrcolHeader[data-cellid='" + this.currentColumnData.$header.data("cellid") + "']").first();

                if (floatingHeader.offset().top > floatingTable.offset().top) {
                    diff = floatingHeader.offset().top - floatingTable.offset().top - headerToolbar.$el.outerHeight();

                    if (diff < 0) {
                        headerToolbar.setPosition({
                            my: "left bottom+" + Math.abs(diff),
                            at: "left top",
                            of: floatingHeader,
                            collision: "none"
                        });
                    } else {
                        headerToolbar.setPosition({
                            my: "left bottom",
                            at: "left top",
                            of: floatingHeader,
                            collision: "none"
                        });
                    }
                } else {
                    headerToolbar.setPosition({
                        my: "left top",
                        at: "left top",
                        of: floatingHeader,
                        collision: "none"
                    });
                }
            }
        },

        _setToolbarDefaultPosition: function() {
            if (this.headerToolbar.$el.is(":visible")) {
                this.headerToolbar.setPosition({
                    my: "left bottom+1",
                    at: "left top",
                    of: this.currentColumnData.$header
                });
            }
        }
    });
});

