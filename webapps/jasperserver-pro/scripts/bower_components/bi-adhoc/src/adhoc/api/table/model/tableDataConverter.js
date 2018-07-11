/*
 * Copyright (C) 2005 - 2016 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author Andriy Godovanets
 * @version: $Id$
 */
define(function(require) {
    var _ = require("underscore"),
        $ = require("jquery"),
        i18n = require("bundle!AdHocBundle"),
        formattersFactory = require("adhoc/api/model/factory/formattersFactory");

    var TableDataConverter = function () {
        this.totalsData = {};
        this.totals = [];
        this.lastGroupLabel = null;
        this.lastRowIndex = 0;
        this.grandTotalRow = null;
        this.nextRowClassName = 'jr-mDatatable-rowOdd';
    };

    TableDataConverter.linkTypes = {
        HEADER: "HEADER",
        DATA: "DATA",
        GROUP_LABEL: "GROUP_LABEL",
        GROUP_TOTAL: "GROUP_TOTAL",
        GRAND_TOTAL: "GRAND_TOTAL"
    };

    TableDataConverter.prototype.reset = function () {
        TableDataConverter.call(this);
    };

    TableDataConverter.prototype.convert = function(metadata, queryResult) {

        this.metadata = metadata;
        this.dataset = queryResult;

        var data = [],
            hasGroups = this.hasGroups(queryResult),
            hasTotals = this.hasTotals(queryResult),
            columns = this.getColumns(),
            totals = hasTotals && this.getTotals(queryResult),
            groupLevels = this.getGroupLevels(),
            tableProperties = this.getTableProperties();

        this.showDetails = tableProperties.showDetails;
        this.showTotals = tableProperties.showTotals;

        if (hasGroups || hasTotals) {
            _.each(queryResult.dataset.levelDataNodes && queryResult.dataset.levelDataNodes[0].all.children, function (child) {
                this.processChild({
                    child: child,
                    data: data,
                    label: "",
                    levels: groupLevels,
                    levelIdx: 0,
                    columns: columns,
                    totals: totals,
                    hyperlink: {}
                });
            }, this);
        } else {
            _.each(queryResult.dataset.levelDataNodes, function (child) {
                this.processChild({
                    child: child,
                    data: data,
                    label: "",
                    levels: groupLevels,
                    levelIdx: 0,
                    columns: columns,
                    totals: totals,
                    hyperlink: {}
                });
            }, this);
        }

        if (hasTotals && queryResult.dataset.levelDataNodes && !this.grandTotalRow) {
            this.grandTotalRow = this.makeGrandTotalRow(queryResult.dataset.levelDataNodes[0].all.data, totals, data.length);
        } else if (!this.grandTotalRow) {
            this.grandTotalRow = [];
        }

        return this.parseOddEven(this.parseLinks(this.parseRows(data, queryResult), columns));
    };

    TableDataConverter.prototype.getTotals = function (dataset) {
        return (_.find(dataset.dataset.levels, function (level) {
            return level.all;
        })).all.aggregations;
    };

    TableDataConverter.prototype.getColumns = function () {
        var columns =  this.metadata.component.findComponentDeep('column'),
            SPACER_REG = /^_spacer/;

        return _.map(columns, function (column, idx) {
            if (column.get("detailFieldReference") === "_artificial" || SPACER_REG.test(column.get("detailFieldReference"))) {
                return _.extend({}, column.attributes, {index: idx});
            } else {
                return _.extend({}, column.attributes, column.level().toJSON(), {index: idx});
            }
        });
    };

    TableDataConverter.prototype.getGroups = function () {
        var groups =  this.metadata.component.findComponentDeep('group');

        return _.map(groups, function (group, idx) {
            return _.extend({}, group.attributes, group.level().toJSON(), {index: idx});
        });
    };

    TableDataConverter.prototype.makeGrandTotalRow = function (data, totals, hasRows) {
        if (!hasRows && TableDataConverter.totalDataEqualsZero(data)){
            return []
        } else {
            var idx = 0,
                columns = this.getColumns(),
                groups = this.getGroups(),
                totalReferences = _.pluck(totals, "reference"),
                columnReferences = _.pluck(columns, "reference"),
                value = "";

            return _.map(columnReferences, function (columnReference, columnIdx) {
                if (!_.contains(totalReferences, columnReference)) {
                    return {label: "", colspan: 1, rowspan: 1, className: "jrs-grid-group", hyperlink: {
                        value: "",
                        id: 'f_'+ columnIdx,
                        linkType: TableDataConverter.linkTypes.GRAND_TOTAL,
                        row: {
                            relativeIndex: -1,
                            cells: columns
                        },
                        column: columns[columnIdx],
                        group: groups
                    }};
                } else {
                    value = columns[columnIdx].showSummary
                        ? formattersFactory(columns[columnIdx].aggregationType).format(data[idx], columns[columnIdx].aggregationFormat)
                        : "";
                    idx++;
                    return {label: value, colspan: 1, rowspan: 1, className: "jrs-grid-group", hyperlink: {
                        value: value,
                        id: 'f_'+ columnIdx,
                        linkType: TableDataConverter.linkTypes.GRAND_TOTAL,
                        column: columns[columnIdx],
                        group: groups,
                        row: {
                            relativeIndex: -1,
                            cells: columns
                        }
                    }};
                }
            });
        }
    };

    TableDataConverter.prototype.makeGroupRow = function (options){
        return [{
            label: this.getGroupLabelParts(options.hyperlink.groupMembers).join(", "),
            colspan: options.columns.length,
            rowspan: 1,
            className: "jr-mDatatable-rowGroup",
            hyperlink: {
                value: this.getRawGroupLabel(options.hyperlink.groupMembers),
                linkType: TableDataConverter.linkTypes.GROUP_LABEL,
                group: this.getGroupRow(options.hyperlink.groupMembers),
                row: {}
            }
        }];
    };

    TableDataConverter.prototype.getRawGroupLabel = function (members) {
        var groups = this.getGroupRow(members);

        return _.map(groups, function (group) {
            return group.value;
        }).join(", ");
    };

    TableDataConverter.prototype.getGroupLabelParts = function (members) {
        var groups = this.getGroupRow(members);

        return _.map(groups, function (group) {
            return formattersFactory(group.type).format(group.value, group.format);
        });
    };

    TableDataConverter.prototype.makeTotalRow = function (options){
        var idx = 0,
            self = this,
            row = [options.levels[options.levelIdx].group.members[options.child.group.memberIdx]].concat(options.child.group.data),
            columns = this.getColumns(),
            value = "",
            totalReferences = _.pluck(options.totals, "reference"),
            columnReferences = _.pluck(options.columns, "reference"),
            label = _.last(this.getGroupLabelParts(options.hyperlink.groupMembers));

        return _.map(columnReferences, function (columnReference, columnIdx) {
            if (columnIdx === 0) {
                value = row[idx++];
                return {
                    label: i18n["adhoc.node.total.node.table"].replace("{0}", label),
                    colspan: 1,
                    rowspan: 1,
                    className: "jr-mDatatable-rowGrouptotal",
                    hyperlink: {
                        value: i18n["adhoc.node.total.node.table"].replace("{0}", value),
                        linkType: TableDataConverter.linkTypes.GROUP_LABEL,
                        group: self.getGroupRow(options.hyperlink.groupMembers),
                        column: columns[columnIdx],
                        row: {cells: columns}
                    }};
            } else if (!_.contains(totalReferences, columnReference)) {
                return {
                    label: "",
                    colspan: 1,
                    rowspan: 1,
                    className: "jr-mDatatable-rowGrouptotal",
                    hyperlink: {
                        value: "",
                        linkType: TableDataConverter.linkTypes.GROUP_TOTAL,
                        group: self.getGroupRow(options.hyperlink.groupMembers),
                        column: columns[columnIdx],
                        row: {cells: columns}
                    }
                };
            } else {
                value = columns[columnIdx].showSummary
                    ? formattersFactory(columns[columnIdx].aggregationType).format(row[idx], columns[columnIdx].aggregationFormat)
                    : "";
                idx++;
                return {
                    label: value,
                    colspan: 1,
                    rowspan: 1,
                    className: "jr-mDatatable-rowGrouptotal",
                    hyperlink: {
                        value: value,
                        linkType: TableDataConverter.linkTypes.GROUP_TOTAL,
                        group: self.getGroupRow(options.hyperlink.groupMembers),
                        column: columns[columnIdx],
                        row: {cells: columns}
                    }
                };
            }
        });
    };

    TableDataConverter.prototype.makeDetailRow = function (row, options){
        var self = this,
            detailRow = this.getDetailRow(row);

        return _.map(detailRow, function (cell) {

            return {
                label: cell.value,
                colspan: 1,
                rowspan: 1,
                hyperlink: {
                    value: cell.initialValue,
                    linkType: TableDataConverter.linkTypes.DATA,
                    group: self.getGroupRow(options.hyperlink.groupMembers),
                    column: cell,
                    row: {
                        cells: detailRow
                    }
                }
            };
        });
    };

    TableDataConverter.prototype.getPresentation = function () {
        return _.pluck(flatElements(this.metadata.schema.attributes.presentation), "element");

        function flatElements(elements, result) {
            if (!result) {
                result = [];
            }

            _.each(elements, function (element) {
                if (element.group) {
                    flatElements(element.group.elements, result);
                } else if (element.element) {
                    result.push(element);
                }
            });

            return result;
        }
    };

    TableDataConverter.prototype.getGroupRow = function (members) {
        var groupLevels = this.getGroupLevels(),
            groups = this.getGroups();

        return _.map(members, function (memberIdx, levelIdx) {
            return _.extend({}, groups[levelIdx], {
                value: groupLevels[levelIdx].group.members[memberIdx]
            });
        });
    };

    TableDataConverter.prototype.getDetailRow = function (row) {
        var idx = 0,
          SPACER_REG = /^_spacer/;

        return _.map(this.getColumns(), function (column, columnIdx) {
            var formattedLabel, label;
            if (column.reference === "_artificial" || SPACER_REG.test(column.reference)) {
                formattedLabel = label = "";
            } else {
                label = row[idx++];
                formattedLabel = formattersFactory(column.type).format(label, column.format);
            }

            return _.extend({}, column, {
                value: formattedLabel,
                initialValue: label
            });
        });
    };

    TableDataConverter.prototype.getGroupLevels = function () {
        return _.filter(this.dataset.dataset.levels, function (level) {
            return level.group;
        });
    };

    TableDataConverter.prototype.hasGroups = function (dataset) {
        return !!this.getGroupLevels(dataset).length;
    };

    TableDataConverter.prototype.hasTotals = function (dataset) {
        var allLevel = _.find(dataset.dataset.levels, function (level) {
            return level.all;
        });

        return !!(allLevel && allLevel.all.aggregations);
    };

    TableDataConverter.prototype.getTableProperties = function () {
        return this.metadata.component.components.findComponentDeep("table")[0].attributes;
    };

    TableDataConverter.prototype.hasDetails = function (dataset) {
        return !!_.find(dataset.dataset.levels, function(level) {
            return level.detail;
        });
    };

    TableDataConverter.prototype.processChild = function (options) {

        if (!options.hyperlink.groupMembers) {
            options.hyperlink.groupMembers = [];
        }

        if (options.child.group) {
            options.hyperlink.groupMembers.push(options.child.group.memberIdx);

            if (options.child.group.data && this.getTableProperties().showTotals) {
                //Totals data mode.
                if (!this.showDetails && this.showTotals) {
                    if (options.levelIdx === options.levels.length - 1) {
                        options.data.push(this.makeTotalRow(options));
                    } else if (this.totalsData[options.levelIdx]) {
                        this.totals.push(this.totalsData[options.levelIdx]);
                    }
                    this.totalsData[options.levelIdx] = this.makeTotalRow(options);
                } else {
                    if (this.totalsData[options.levelIdx]) {
                        this.totals.push(this.totalsData[options.levelIdx]);
                    }
                    this.totalsData[options.levelIdx] = this.makeTotalRow(options);
                }
            }

            //Totals data mode.
            if (!this.showDetails && this.showTotals) {
                if (options.levelIdx === options.levels.length - 2) {
                    _.each(this.totals.reverse(), function (value) {
                        options.data.push(value);
                    }, this);

                    this.totals = [];

                    options.data.push(this.makeGroupRow(options));
                }
            }

            options.label = options.label.concat(options.label ? ", " : "", options.levels[options.levelIdx].group.members[options.child.group.memberIdx]);

            _.each(options.child.group.children, function (child) {
                this.processChild({
                    child: child,
                    data: options.data,
                    label: options.label,
                    levels: options.levels,
                    levelIdx: options.levelIdx + 1,
                    columns: options.columns,
                    totals: options.totals,
                    hyperlink: _.cloneDeep(options.hyperlink)
                });
            }, this);

        }

        if (options.child.detail) {
            if (options.levels.length) {
                _.each(this.totals.reverse(), function (value) {
                    options.data.push(value);
                }, this);

                this.totals = [];

                options.data.push(this.makeGroupRow(options));
            }

            _.each(options.child.detail.data, function (item) {
                options.data.push(this.makeDetailRow(item, options));
            }, this);
        }
    };

    TableDataConverter.prototype.parseRows = function (rows, dataset) {


        if (rows.length && rows[0][0].label === this.lastGroupLabel) {
            rows = rows.slice(1);
        }

        _.each(rows, function (row) {
            if (row[0].className === "jr-mDatatable-rowGroup") {
                this.lastGroupLabel = row[0].label;
            }
        }, this);

        //check last portion of data
        if (dataset.params.pageSize[0] > dataset.dataset.counts) {
            //Totals data mode.
            if (!this.showDetails && this.showTotals) {
                rows = rows.concat(_.values(this.totalsData).reverse().slice(1));
            } else {
                rows = rows.concat(_.values(this.totalsData).reverse());
            }
        }

        return rows;
    };

    TableDataConverter.prototype.parseLinks = function (rows) {
        var offset =  this.lastRowIndex;

        _.each(rows, function (row, rowIdx) {
            _.each(row, function (cell, cellIdx) {
                cell.hyperlink.id = "".concat(offset + rowIdx, "_", cellIdx);
                cell.hyperlink.row.index = offset + rowIdx;
            }, this);
        }, this);

        this.lastRowIndex += rows.length;

        return rows;
    };

    TableDataConverter.prototype.parseOddEven = function (rows) {
        _.each(rows, function (row) {
            if (row[0].className === "jr-mDatatable-rowGroup") {
                this.nextRowClassName = 'jr-mDatatable-rowOdd';
            } else if (row[0].hyperlink.linkType === TableDataConverter.linkTypes.DATA) {
                row.oddEvenClassName = this.nextRowClassName;

                this.nextRowClassName = this.nextRowClassName === 'jr-mDatatable-rowOdd'
                    ? 'jr-mDatatable-rowEven'
                    : 'jr-mDatatable-rowOdd';
            }
        }, this);

        return rows;
    };

    TableDataConverter.totalDataEqualsZero = function (values){
        var hasData = false;

        _.each(values, function(value){
            if ($.isNumeric(value) && parseFloat(value) !== 0) {
                hasData = true;
            }
        });

        return !hasData;
    };

    return TableDataConverter;
});