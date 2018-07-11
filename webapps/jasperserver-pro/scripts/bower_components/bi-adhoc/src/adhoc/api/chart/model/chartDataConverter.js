/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */


define(function(require, exports, module) {
    "use strict";
    var _ = require("underscore"),
        log = require("logger").register(module),
        $ = require("jquery"),
        config = require("jrs.configs"),
        moment = require("moment"),
        formatterFactory = require("../../model/factory/formattersFactory"),
        HyperlinkChartHelper = require("../HyperlinkChartHelper"),

        i18n = require("bundle!AdHocBundle");


    /**
     * @deprecated This converter should be removed, after we refactor dataprocessor
     */


    return function(state, dataSetJSON, adHocModel, hyperlinkHelper) {

        var chartComponent = adHocModel.component.getChartComponent(),
            levels = chartComponent.components.findComponentDeep("level"),
            measures = chartComponent.components.findComponentDeep("measure"),
            components = levels.concat(measures);

        var chartState = _.extend(chartComponent.getProperties(), {
            chartType: chartComponent.getLegacyAdhocChartType(),
            columnsSelectedLevels: [],
            rowsSelectedLevels: [],

            decimalPoint: ".",
            shortMonths: getMonths(),
            showXAxisLabels: true,
            showYAxisLabels: true,
            thousandSeparator: "None"
        });

        dataSetJSON.dataset.data = parseData(dataSetJSON.dataset.data);

        delete chartState["type"];
        delete chartState["title"];

        var oldState = {
            "title": state.label,
            "chartState": chartState,
            "queryData": {
                metadata: {
                    axes: [],
                    measureAxis: 0,
                    measures: [],
                    canRender: true,
                    isFullDataQuery: false,
                    isOLAP: false
                },
                treeNodes: [],
                data: _.zip.apply(null, dataSetJSON.dataset.data)
            },
            viewType: "ichart"
        };

        fillMetadata(oldState, chartComponent);
        fillTreeNodes(oldState, dataSetJSON);
        fillLevels(oldState, state.query.multiAxes, adHocModel);

        if (chartComponent.isTimeSeries()) {
            oldState.chartState.timeSeriesCategorizerName = state.query.multiAxes.groupBy.rows.items[0].level.categorizer;

            if (!oldState.chartState.rowsSelectedLevels.length){
                var level = findLevel(adHocModel, state.query.multiAxes.groupBy.rows.expansions[0].level.fieldRef);
                oldState.chartState.rowsSelectedLevels.push({
                    "label": level.label(true),
                    "dimension": level.get("dimension"),
                    "name": level.get("id")
                });
            }

            _.each(oldState.queryData.data, function(value, key, list) {
                list[key] = _.map(value, function(axisValue) {
                    var node = oldState.queryData.treeNodes[0].children[key],
                        rawLabel = normalizeTimeOffset(node.rawLabel),
                        offsetHours,
                        date,
                        timestamp;


                    if (node) {
                        if (oldState.chartState.timeSeriesCategorizerName === "day" && Date.parse(rawLabel)) {
                            date = new Date(rawLabel);
                            offsetHours = 0;
                        }

                        if (_.contains(["hour_by_day", "minute_by_day", "second_by_day", "millisecond_by_day"], oldState.chartState.timeSeriesCategorizerName) && !isNaN(Date.parse(rawLabel))) {
                            date = new Date(rawLabel);
                            offsetHours = parseInt(moment(rawLabel).tz(config.userTimezone).format("Z"));
                        }

                        if (_.contains(["hour", "minute", "second", "millisecond"], oldState.chartState.timeSeriesCategorizerName) && !isNaN(Date.parse("1970-01-01T" + rawLabel))) {
                            date = new Date(Date.parse("1970-01-01T" + rawLabel));
                            offsetHours = parseInt(moment("1970-01-01T" + rawLabel).tz(config.userTimezone).format("Z"));
                        }

                        timestamp = date ? date.getTime() + offsetHours * 60 * 60 * 1000 : NaN;

                        hyperlinkHelper.saveInitialValue(timestamp, rawLabel);
                    }

                    return {
                        timestamp: timestamp,
                        value: parseFloat(axisValue)
                    };
                });
            });
        }

        return oldState;

        // Insert semicolumns into timeoffset. Required by Safari, IE, Edge.
        function normalizeTimeOffset (timestamp) {
            if (timestamp && (timestamp[timestamp.length - 5] === '-' || timestamp[timestamp.length - 5] === '+')) {
                return timestamp.slice(0, timestamp.length - 2).concat(':', timestamp.slice(-2));
            }

            return timestamp;
        }

        function fillMetadata(oldState, chartComponent) {
            var axes = chartComponent.components.findComponentDeep("axis").reverse();
            var measures = chartComponent.components.findComponentDeep("measures");

            _.each(axes, function(axis, index) {

                var axisMetadata = axis.components.map(function(level) {
                    var label;
                    if (level.get("reference") === "Measures") {
                        oldState.queryData.metadata.measureAxis = index;
                        label = i18n["adhoc.node.measures.node"];
                    } else {
                        label = level.label(true);
                    }
                    return {
                        label: label,
                        dimension: level.get("dimension"),
                        name: level.get("reference")
                    };
                });

                oldState.queryData.metadata.axes.push(axisMetadata);
            });

            _.each(measures, function(measure) {
                oldState.queryData.metadata.measures = measure.components.map(function(measureLevel) {
                    return measureLevel.label(true);
                });
            });
        }

        function fillTreeNodes(oldState, dataSetJSON) {
            var axes = dataSetJSON.dataset.axes.reverse();

            for (var axisIdx = 0; axisIdx < axes.length; axisIdx++) {
                // fill treeNodes
                oldState.queryData.treeNodes.push({
                    label: i18n["adhoc.node.total.node"],
                    level: 0,
                    axisCoordinate: getDataIdx(axes[axisIdx].axisNode),
                    children: fillTreeNodesChildren(axes, axes[axisIdx].axisNode, 1, axisIdx),
                    isAll: axes[axisIdx].axisNode.all
                });
            }
        }

        function fillTreeNodesChildren(axes, parentNode, level, axisIdx) {
            return _.map(parentNode.children, function(node) {
                var formattedLabel = getLabelFromDataSet(axes, axisIdx, level - 1, node),
                    rawLabel = getRawLabelFromDataSet(axes, axisIdx, level - 1, node);

                if (formattedLabel !== rawLabel){
                    hyperlinkHelper.saveInitialValue(formattedLabel, rawLabel);
                }

                return {
                    label: formattedLabel,
                    rawLabel: rawLabel,
                    level: level,
                    type: getNodeType(axes, axisIdx, level - 1),
                    axisCoordinate: getDataIdx(node),
                    children: fillTreeNodesChildren(axes, node, level + 1, axisIdx),
                    isAll: node.all
                };
            });
        }

        function getNodeType(axes, axisIdx, levelIdx) {
            var level = axes[axisIdx].levels[levelIdx];

            if (level && level.hasOwnProperty("level")) {
                return level.level.type;
            }
        }

        function getDataIdx(axisNode) {
            return axisNode.hasOwnProperty("dataIdx") ? axisNode.dataIdx : -1;
        }

        function getLabelFromDataSet(axes, axisIdx, levelIdx, node) {
            if (!node.hasOwnProperty("memberIdx")) {
                return i18n["adhoc.node.total.node"];
            }

            var level = axes[axisIdx].levels[levelIdx];

            if (level.hasOwnProperty("level")) {
                return format(level.level.referenceObject.name, level.level.type, level.level.members[node.memberIdx]);
            } else if (level.hasOwnProperty("aggregation")) {
                return adHocModel.component.getMeasureLabelByReference(level.aggregation.fields[node.memberIdx].reference);
            }

            return "";
        }

        function getRawLabelFromDataSet(axes, axisIdx, levelIdx, node) {
            if (!node.hasOwnProperty("memberIdx")) {
                return i18n["adhoc.node.total.node"];
            }

            var level = axes[axisIdx].levels[levelIdx];

            if (level.hasOwnProperty("level")) {
                return level.level.members[node.memberIdx];
            } else if (level.hasOwnProperty("aggregation")) {
                return adHocModel.component.getMeasureLabelByReference(level.aggregation.fields[node.memberIdx].reference);
            }

            return "";
        }

        function format(reference, type, value) {
            var component = _.find(components, function (component) {
                    return component.get("reference") === reference;
                }),
                level = component.level(),
                opts = {
                    format: component.get("format"),
                    categorizer: level && level.get("categorizer"),
                    ignoreTimezone: true
                };

                if (value === "other_node") {
                    value = i18n["adhoc.node.other.node"];
                }

            return formatterFactory(type).format(value, opts.format, opts);
        }

        function fillLevels(oldState, query, adHocModel) {
            var level;
            if (query.groupBy.columns.hasOwnProperty("expansions")) {
                _.each(query.groupBy.columns.expansions, function(expansion) {
                    if (expansion.level && expansion.level.expanded && !expansion.level.aggregation) {
                        level = findLevel(adHocModel, expansion.level.fieldRef);
                        oldState.chartState.columnsSelectedLevels = [toSelectedLevel(level)];

                    }
                });

            }

            if (oldState.chartState.chartType === "dual_measure_tree_map") {
                level = adHocModel.dataSet.query.rows.axis.first();
                oldState.chartState.rowsSelectedLevels = [toSelectedLevel(level)];

            } else if (oldState.chartState.chartType === "dual_level_pie") {
                _.each(query.groupBy.rows.expansions, function (expansion, index) {
                    if (expansion.level && expansion.level.expanded && !expansion.level.aggregation) {
                        var nexExp = query.groupBy.rows.expansions[index + 1];
                        if (nexExp && nexExp.level && !nexExp.level.aggregation) {
                            level = findLevel(adHocModel, nexExp.level.fieldRef);
                            oldState.chartState.rowsSelectedLevels = [toSelectedLevel(level)];
                        }
                    }
                });

                if (!oldState.chartState.rowsSelectedLevels.length) {
                    level = adHocModel.dataSet.query.rows.axis.find(function(level){
                        return level.isLevel();
                    });
                    oldState.chartState.rowsSelectedLevels = [toSelectedLevel(level)];
                }
            } else {
                if (query.groupBy.rows.hasOwnProperty("expansions")) {
                    _.each(query.groupBy.rows.expansions, function (expansion) {
                        if (expansion.level && expansion.level.expanded && !expansion.level.aggregation) {
                            level = findLevel(adHocModel, expansion.level.fieldRef);
                            oldState.chartState.rowsSelectedLevels = [toSelectedLevel(level)];
                        }
                    });
                }
            }
        }

        function toSelectedLevel(level) {
            return {
                label: level.label(true),
                dimension: level.get("dimension"),
                name: level.get("id") || level.get("dimension")
            };
        }

        function findLevel(adHocModel, levelId){
            var levelFilter = function (level) {
                    return levelId === level.get("id");
                };

            return adHocModel.dataSet.query.cols.axis.find(levelFilter) || adHocModel.dataSet.query.rows.axis.find(levelFilter);
        }

        function parseData(data) {
            return _.map(data, function (row) {
                return _.map(row, function (value) {
                    if ($.isNumeric(value)) {
                        return parseFloat(value);
                    }
                    return null;
                });
            });
        }

        function getMonths() {
            return _.map(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"], function (month) {
                return _.capitalize(moment("1970-".concat(month, "-01"))
                    .locale(config.userLocale)
                    .format("MMMM")).slice(0, 3);
            });
        }
    };
});
