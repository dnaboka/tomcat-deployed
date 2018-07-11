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

        formatterFactory = require("adhoc/api/model/factory/formattersFactory"),
        cellTypesFactory = require("adhoc/api/model/factory/cellTypesFactory"),

        crosstabBodyTemplate = require("text!../template/crosstabBodyTemplate.htm"),
        crosstabBodyTemplateFn = _.template(crosstabBodyTemplate);

    function validateViewportSize(newData, offset, pageSize, sT, size){
        var res = -1;
        if (newData.resultPixels){
            var res = offset,
                scrollTop = sT,
                scrollBottom = scrollTop + size,
                dataHeight = _.reduce(newData.resultPixels, function(m,n){ return m + n}, 0),
                top = newData.top, bottom = top + dataHeight;

            if (dataHeight < size){
                return -1;
            }

            while (bottom < scrollBottom){
                top = bottom;
                bottom += dataHeight;
                res += pageSize;
            }

            while (top > scrollTop){
                top = Math.max(0, top - dataHeight);
                res = Math.max(0, res - pageSize);
                bottom = top + dataHeight;
            }

            if (bottom < scrollBottom){
                for (var i = 0; i < newData.resultPixels.length && bottom < scrollBottom; i++){
                    bottom += newData.resultPixels[i];
                    top += newData.resultPixels[i];
                    res++;
                }
            }

            if (top <= scrollTop && bottom >= scrollBottom){
                if (res === offset){
                    res = -1;
                }
            } else {
                res = -1;
            }
        }

        return res;
    }

    var CrosstabBodyView = Backbone.View.extend({

        events: {
           "scroll": "onScroll"
        },

        initialize: function (options) {
            this._initElements();

            this.options = options;
            this.$container = this.$("table");
            this.hyperlinkEnabledFor = [];

            this.on("scroll", this.scrollTo, this);
        },

        render: function () {
            if (this.data) {
                if (this.hasData()) {
                    this.$emptyMessage.hide();
                } else {
                    this.$emptyMessage.show();
                }

                this.$container.html(crosstabBodyTemplateFn({
                    data: this.data,
                    cellTypesFactory: cellTypesFactory,
                    hyperlinks: this.hyperlinks
                }));
            }
            return this;
        },

        acquireData: function(data){
            this.data = [];
            this.columnTotalsInx = {};
            this.rowTotalsInx = {};

            var queryGroupBy = this.model.dataSet.query.groupByJSON();

            //Iterate through column and row ranges and grab indexes of totals.
            // If the items are empty, consider the row/column as not total
            if (queryGroupBy.columns.items.length){
                _.each(data.columns.range, function (column, columnIndex) {
                    _.each(column, function (cell) {
                        if (cell.isTotal) {
                            this.columnTotalsInx[columnIndex] = true;
                        }
                    }, this);
                }, this);
            }

            if (queryGroupBy.rows.items.length) {
                _.each(data.rows.range, function (row, rowIndex) {
                    _.each(row, function (cell) {
                        if (cell.isTotal) {
                            this.rowTotalsInx[rowIndex] = true;
                        }
                    }, this);
                }, this);
            }

            var row, index, cell, tmp,
                crosstab = this.model.component.getCrosstabComponent(),
                measureInRows = crosstab.getRowsComponent().hasMeasures(),
                measureComponents = crosstab.getMeasuresComponent().components,
                lastMeasureInList = measureComponents.last().get('reference'),

                axis = this.model.dataSet.query[measureInRows ? "rows" : "cols"].axis,

                measuresMapping = [],
                measureRange = measureInRows ? data.rows.range : data.columns.range,

                typesMapping = measureComponents.reduce(function (memo, measure) {
                    memo[measure.get("reference")] = measure.level() && measure.level().get("aggregationType");
                    return memo;
                }, {}),

                opts = measureComponents.reduce(function (memo, measure) {
                    memo[measure.get("reference")] = {
                        format: measure.get("format"),
                        categorizer: measure.level() && measure.level().get("categorizer"),
                        ignoreTimezone: true
                    };
                    return memo;
                }, {}),

                measureFormatters = axis.reduce(function (memo, level) {
                    if (level.get("kind") === "measure") {
                        memo[level.get("id")] = formatterFactory(level.get("aggregationType"));
                    }
                    return memo;

                }, {});

            if (measureRange.length) {
                for (var measuresRow = 0; measuresRow < measureRange[0].length; measuresRow++) {
                    if (measureRange[0][measuresRow].isMeasure) {
                        break;
                    }
                }

                for (var i = 0; i < measureRange.length; i++) {
                    measuresMapping.push(measureRange[i][measuresRow].value);
                }
                for (var rowIndex = 0; rowIndex < data.data.length; rowIndex++) {
                    row = [];
                    row.totalRow = this.rowTotalsInx[rowIndex];
                    data.data[rowIndex].rowMemberLast && !row.totalRow && (row.rowMemberLast = true);
                    for (var colIndex = 0; colIndex < data.data[rowIndex].length; colIndex++) {
                        tmp = {
                            label: "",
                            totalCell: row.totalRow || this.columnTotalsInx[colIndex]
                        };

                        cell = data.data[rowIndex][colIndex];

                        if (cell.label) {
                            index = measureInRows ? rowIndex : colIndex;
                            tmp.aggregationType = typesMapping[measuresMapping[index]];
                            tmp.label = measureFormatters[measuresMapping[index]].format(cell.label, opts[measuresMapping[index]].format, opts[measuresMapping[index]]);
                        }

                        tmp.totalCell && (tmp.isTotal = true);
                        row.push(tmp);
                    }
                    if(data.rows.range[rowIndex].rowMemberLast && row.totalRow === undefined) {
                        row.lastRowValue = true;
                    }
                    this.data.push(row);

                    if (row.totalRow === true && this.data.length > 1) {
                        if (this.data[this.data.length - 2].totalRow === undefined) {
                            this.data[this.data.length - 2].lastRowValue = true;
                        }
                    }
                }

                // JRS-15214
                for(var rowIndx = 0; rowIndx < data.columns.range.length; rowIndx ++) {
                    for (var colIndx = 0; colIndx< data.columns.range[rowIndx].length; colIndx ++) {
                        if(colIndx-1 > -1 && (data.columns.range[rowIndx][colIndx-1].isTotal || data.columns.range[rowIndx][colIndx-1].istotalCol)) {
                           data.columns.range[rowIndx][colIndx].istotalCol = true;
                        }
                    }
                }
            }
        },

        onScroll: function(event){
            var scrollPos = {
                left: this.$el.scrollLeft(),
                top: this.$el.scrollTop()
            };

            this.trigger("scroll:x", scrollPos.left);
            this.trigger("scroll:y", scrollPos.top);
            this.trigger("scroll", scrollPos);
        }, 
        
        scrollToLeft: function(position){
            this.$el.scrollLeft(position);
        },

        scrollToTop: function(position){
            this.$el.scrollTop(position);
        },

        enableHyperlinks: function (linkOptions) {
            this.hyperlinks = true;
            if (linkOptions.events) {
                var self = this;
                for (var key in linkOptions.events) {
                    this.hyperlinkEnabledFor.push(key);
                    this.$el.on(key, ".jr-jHyperLink", function (ev) {
                        self.trigger("hyperlink", {
                            context: this,
                            event: ev,
                            row: +ev.currentTarget.getAttribute("data-row-index"),
                            column: +ev.currentTarget.getAttribute("data-column-index")
                        })
                    });
                }
            }
        },

        disableHyperlinks: function(){
            this.hyperlinks = true;
            for (var i = 0; i < this.hyperlinkEnabledFor; i++){
                this.$el.off(this.hyperlinkEnabledFor[i], ".jr-jHyperLink");
            }
        },

        validateViewportHeight: function(newData, offset, pageSize){
            return validateViewportSize(newData, offset, pageSize, this.$el.scrollTop(), this.$el.height())
        },

        validateViewportWidth: function(newData, offset, pageSize){
            return validateViewportSize(newData, offset, pageSize, this.$el.scrollLeft(), this.$el.width());
        },

        _initElements: function () {
            this.$emptyMessage = this.$(".jr-jEmptyMessage");
            this.$emptyMessage.hide();
        },

        hasData: function () {
            var hasData = true,
                filter = function(level){ return level.get("kind") === "measure"},
                rowMeasures = this.model.dataSet.query.rows.axis.filter(filter).length,
                colsMeasures = this.model.dataSet.query.cols.axis.filter(filter).length;

            if (!this.data.length || this.data.length === rowMeasures && this.data[0].length === 1 || this.data.length === 1 && this.data[0].length === colsMeasures) {
                hasData = false;

                _.each(this.data, function (row) {
                    _.each(row, function (cell) {
                        if (!_.isUndefined(cell.label) && cell.label !== "") {
                            hasData = true;
                        }
                    });
                });
            }

            return hasData;
        }
    });

    return CrosstabBodyView;
});