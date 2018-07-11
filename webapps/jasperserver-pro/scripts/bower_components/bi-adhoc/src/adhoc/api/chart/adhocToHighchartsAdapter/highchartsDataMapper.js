/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

////////////////////////////////////////////////////////
//
//  HighChartDataMapper
//
//  Works on the dataset that is wrapped in an AdhocDataProcessor
//
//  Set up to recognize 3 styles of AdhocState data:
//
//    Style 0:
//
//       Measure Axis only.  All grouping on the Measure Axis, no groups on the non-Measure Axis.
//
//
//    Style 1:
//
//       Measure on one Axis.  All groups on the non-Measure Axis.
//
//
//    Style 2:
//
//      'Crosstab Style'  Groups on Measure Axis and groups on non-Measure Axis.
//
//
//
//   The chart renderers for various chart types (column, pie, etc), recognize these Styles
//   and handle them each in chart specific manner.
//
//
//
//   2012-08-01  thorick    created:  this thing actually works !
//
//
///////////////////////////////////////////////////////////

/**
 * Maps data to Highcharts options for specified chart type.
 *
 * @type {Object}
 */
//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory, globalScope) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([
            "underscore",
            "jquery",
            "adhoc/api/chart/adhocToHighchartsAdapter/adhocDataProcessor",
            "adhoc/api/chart/adhocToHighchartsAdapter/palette/defaultPalette",
            "adhoc/api/chart/adhocToHighchartsAdapter/enum/dateTimeFormats",
            "adhoc/api/chart/adhocToHighchartsAdapter/enum/adhocToHighchartsTypes",
            "highcharts"
        ], factory);
    } else {
        // Browser globals.
        globalScope.highchartsDataMapper = factory(_, jQuery, AdhocDataProcessor, hcDefaultPalette, hcDateTimeFormats, // jshint ignore: line
            adhocToHighchartsTypes, Highcharts); // jshint ignore: line
    }
}(function (_, $, adhocDataProcessor, defaultPalette, dateTimeFormats, adhocToHcTypeMap, Highcharts) {
    "use strict";

    var HDM = _.chain({})
        .extend(_.cloneDeep(defaultPalette))
        .extend(dateTimeFormats)
        .value();


    _.extend(HDM, {
        SeriesType: {
            COMMON: 0,
            PIE: 1,
            DUAL_LEVEL_PIE: 2,
            HEAT_MAP: 3,
            HEAT_MAP_TIME_SERIES: 4,
            SEMI_PIE: 5,
            DUAL_MEASURE_TREE_MAP: 6,
            TREE_MAP: 7,
            ONE_PARENT_TREE_MAP: 8
        },

        chartType: null,
        fullGroupHierarchyNames: true,
        //containerWidth: 0,

        ////////////////////
        //  pie constants
        //

        defaultPiesPerRow: 8,
        maxPieRows: 4,

        HEATMAP_LEGEND_TICK_INTERVAL: 150,


        categories: [],
        categoryNames: {},
        groupedCategories: false,
        highchartsCategories: [],


        //
        //  track measure boundaries
        //
        measureMin: null,
        measureMax: null,

        /**
         * Extends default colors palette if advanced colors are specified.
         * @param extraOptions
         */
        extendDefaultPalette: function (extraOptions) {
            var advancedColorsProperty,
                advancedColors;

            //check advanced color property
            advancedColorsProperty = _.find(extraOptions.chartState.advancedProperties, function (property) {
                return property.name === "colors";
            });

            if (advancedColorsProperty) {
                try {
                    advancedColors = JSON.parse(advancedColorsProperty.value);
                    HDM.colors = $.extend(_.clone(defaultPalette.colors), advancedColors);
                } catch (e) {
                    //reset to use default palette
                    HDM.colors = _.clone(defaultPalette.colors);
                }
            } else {
                //reset to use default palette
                HDM.colors = _.clone(defaultPalette.colors);
            }

        },

        getSeriesByType: function (type, rowSlider, columnSlider, extraOptions) {
            var rowAxisLeafArray;
            var columnAxisLeafArray;

            this.extendDefaultPalette(extraOptions);

            if (extraOptions.metadata.isOLAP) {
                rowAxisLeafArray = adhocDataProcessor.getNodeListForDimLevelRadio(0, rowSlider);
                columnAxisLeafArray = adhocDataProcessor.getNodeListForDimLevelRadio(1, columnSlider);
            } else {
                rowAxisLeafArray = adhocDataProcessor.getNodeListForSliderLevel(0, rowSlider);
                columnAxisLeafArray = adhocDataProcessor.getNodeListForSliderLevel(1, columnSlider);
            }

            var series;

            switch (type) {
                case HDM.SeriesType.COMMON:
                    series = HDM.getCommonSeries(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.PIE:
                    series = HDM.getPieSeries(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions);
                    break;

                case HDM.SeriesType.SEMI_PIE:
                    series = HDM.getSemiPieSeries(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions);
                    break;

                case HDM.SeriesType.DUAL_LEVEL_PIE:
                    series = HDM.getDualLevelPieSeries(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions);
                    break;

                case HDM.SeriesType.HEAT_MAP:
                    series = HDM.getHeatMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.HEAT_MAP_TIME_SERIES:
                    series = HDM.getHeatMapTimeSeriesOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.DUAL_MEASURE_TREE_MAP:
                    series = HDM.getDualMeasureSingleFieldTreeMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.TREE_MAP:
                    series = HDM.getTreeMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                case HDM.SeriesType.ONE_PARENT_TREE_MAP:
                    series = HDM.getTreeMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions);
                    break;

                default:
                    throw "Unknown series type!";
            }

            return series;
        },

        getColor: function (num) {
            return HDM.colors[num % HDM.colors.length];
        },

        getColorWithAlpha: function (num, alpha) {
            var rgb = HDM.rgbColors[num % HDM.colors.length];

            return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha + ")";
        },

        generateXAxisLabelsOptions: function (options) {
            var labelsOptions = {
                step: options.step,
                //keep default charts behaviour since 2.3.2
                maxStaggerLines: 1,
                style: {
                    fontSize: "1em"
                }
            };

            if (options.rotation !== 0) {
                _.extend(labelsOptions, {
                    rotation: options.rotation
                });

                // add some shift for labels if they are rotated vertically. Fixes bug #35881
                if (options.adjustPosition && options.rotation === 90) {
                    labelsOptions.x = -4;
                } else if (options.rotation === 270) {
                    labelsOptions.x = 4;
                }
            }

            return labelsOptions;
        },

        doAxisSwap: function (chartType) {
            return chartType.indexOf("bar") != -1;
        },

        getLegendOptions: function (extraOptions) {
            var legend = {
                borderWidth: extraOptions.chartState.legendBorder ? 1 : 0,
                itemStyle: {
                    fontWeight: "normal",
                    fontSize: "1em"
                }
            };

            if (extraOptions.chartState.legend === "none") {
                legend.enabled = false;
            } else if (HDM.isScatterOrBubbleChart(extraOptions.chartState.chartType)) {
                legend.enabled = !HDM.isTotalSelectedOnly(extraOptions, 1);
            } else {
                legend.enabled = true;
            }

            switch (extraOptions.chartState.legend) {
                case "top":
                    legend.align = "center";
                    legend.verticalAlign = "top";
                    break;

                case "left":
                case "right":
                    legend.align = extraOptions.chartState.legend;
                    legend.verticalAlign = "middle";
                    legend.layout = "vertical";
                    break;
            }

            return legend;
        },

        getGeneralOptions: function (extraOptions) {
            return {
                chart: {
                    renderTo: 'chartContainer',
                    zoomType: 'xy',
                    type: HDM.adHocToHighchartsChartTypeMap[extraOptions.chartState.chartType],
                    polar: HDM.isSpiderChart(extraOptions.chartState.chartType),
                    style: {
                        fontSize: "1em"
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    // Skip internal Highcharts title.
                    text: null
                },
                tooltip: {
                    valueDecimals: 2,
                    useHTML: true,
                    style: {
                        fontSize: "1em"
                    }
                }
            };
        },

        getCommonSeriesGeneralOptions: function (extraOptions) {
            var doAxisSwap = HDM.doAxisSwap(extraOptions.chartState.chartType);

            var options = _.extend(HDM.getGeneralOptions(extraOptions), {
                xAxis: HDM.getXAxisOptions(doAxisSwap, extraOptions),
                yAxis: HDM.isDualOrMultiAxisChart(extraOptions.chartState.chartType) ? [] :
                    HDM.getYAxisOptions(doAxisSwap, extraOptions),
                plotOptions: {
                    series: {
                        marker: {
                            enabled: extraOptions.chartState.showDataPoints
                        },

                        tooltip: {
                            dateTimeLabelFormats: extraOptions.isTimeSeries ?
                                HDM.getDateTimeLabelFormats(extraOptions.chartState.timeSeriesCategorizerName) : undefined,
                            xDateFormat: extraOptions.isTimeSeries ?
                                HDM.getDateTimeTooltipFormats(extraOptions.chartState.timeSeriesCategorizerName) : undefined
                        }
                    }
                },
                series: [],
                legend: HDM.getLegendOptions(extraOptions)
            });

            if (HDM._isTooltipFollowPointerEnabled(extraOptions.chartState.chartType)) {
                options.tooltip.followPointer = true;
            }

            if (HDM.isDualOrMultiAxisChart(extraOptions.chartState.chartType) || HDM.isSpiderChart(extraOptions.chartState.chartType)) {
                options.tooltip.shared = true;
            } else {
                options.tooltip.shared = false;
            }

            return options;
        },

        isTotalSelectedOnly: function (extraOptions, axisIndex) {
            var selectedLevels = axisIndex === 0 ? extraOptions.chartState.rowsSelectedLevels :
                extraOptions.chartState.columnsSelectedLevels;

            var totalOnly = true;
            if (extraOptions.metadata.isOLAP) {
                _.each(selectedLevels, function (level) {
                    if (level.name != "(All)") {
                        totalOnly = false;
                    }
                });
            } else {
                totalOnly = selectedLevels.length === 0;
            }

            return totalOnly;
        },

        getXAxisOptions: function (doAxisSwap, extraOptions) {
            var options = {
                categories: [],
                title: {
                    // First measure goes to X axis for Scatter and Bubble.
                    text: HDM.isScatterOrBubbleChart(extraOptions.chartState.chartType) ?
                        extraOptions.metadata.measures[0] : ""
                }
            };
            if (HDM.isSpiderChart(extraOptions.chartState.chartType)) {
                options.tickmarkPlacement = "on";
                options.lineWidth = 0;
            }
            options.labels = HDM.generateXAxisLabelsOptions({
                rotation: doAxisSwap ? extraOptions.chartState.yAxisRotation : extraOptions.chartState.xAxisRotation,
                adjustPosition: !doAxisSwap,
                step: doAxisSwap ? extraOptions.chartState.yAxisStep : extraOptions.chartState.xAxisStep
            });

            // workaround for HC bug #2973, JS HC patch #16. Set y-axis labels align to the left. Because HC lib stops
            // calculating valid size for labels when they rotated for more than 74 degrees for bar chart
            if (doAxisSwap && Math.abs(extraOptions.chartState.xAxisRotation) >= 75) {
                options.labels.align = "right";
            }
            options.offset = Math.abs(extraOptions.chartState.xAxisRotation) > 60 ? 5 : 0;

            if (extraOptions.isTimeSeries) {
                options.dateTimeLabelFormats = HDM.getDateTimeLabelFormats(extraOptions.chartState.timeSeriesCategorizerName);
                options.type = "datetime";
            }

            return options;
        },

        getYAxisOptions: function (doAxisSwap, extraOptions) {
            var options = {
                title: {
                    text: " "
                },
                labels: {
                    rotation: doAxisSwap ? extraOptions.chartState.xAxisRotation : extraOptions.chartState.yAxisRotation,
                    step: doAxisSwap ? extraOptions.chartState.xAxisStep : extraOptions.chartState.yAxisStep,
                    style: {
                        fontSize: "1em"
                    }
                }
            };

            //workaround to prevent truncating of labels - #35709
            if (HDM.isScatterOrBubbleChart(extraOptions.chartState.chartType)) {
                // Second measure goes to X axis for Scatter and Bubble.
                options.title.text = extraOptions.metadata.measures[1];
            } else if (extraOptions.chartState.showMeasureOnValueAxis && extraOptions.metadata.measures.length == 1) {
                options.title.text = extraOptions.metadata.measures[0];
            }

            if (HDM.isSpiderChart(extraOptions.chartState.chartType)) {
                options.gridLineInterpolation = "polygon";
                options.lineWidth = 0;
                options.min = 0;
                if (options.labels.rotation > 0) {
                    options.labels.x = -(options.labels.rotation / 90 * 10);
                }
            }

            return options;
        },

        getDateTimeLabelFormats: function (categorizerName) {
            return HDM.dateTimeLabelFormatsMap[categorizerName];
        },

        getDateTimeTooltipFormats: function (categorizerName) {
            return HDM.dateTimeTooltipFormatsMap[categorizerName];
        },

        /**
         * Generates Highcharts options for common series charts (no pie charts).
         *
         * Items (measures only) or items combination (groups or measures + groups) from Columns axis go to series.
         * Items (measures only) or items combination (groups or measures + groups) from Rows axis go to categories of
         * X-axis (except bar chart).
         *
         * @param rowAxisLeafArray
         * @param columnAxisLeafArray
         * @param extraOptions
         *
         * @returns highcharts options object.
         */
        getCommonSeries: function (rowAxisLeafArray, columnAxisLeafArray, extraOptions) {
            var isTimeSeries = extraOptions.isTimeSeries,
                chartType = extraOptions.chartState.chartType;

            // Data reset.
            HDM.groupedCategories = false;
            HDM.highchartsCategories = [];
            HDM.measureMin = null;
            HDM.measureMax = null;

            var result = this.getCommonSeriesGeneralOptions(extraOptions);

            HDM.setupOptionsSeries(columnAxisLeafArray, result, chartType, extraOptions);
            HDM.setupOptionsYAxis(columnAxisLeafArray, result, chartType, extraOptions);
            HDM.populateOptionsDataAndCategories(rowAxisLeafArray, columnAxisLeafArray, result, chartType, isTimeSeries,
                extraOptions);

            HDM.setCategories(result, isTimeSeries || HDM.isScatterOrBubbleChart(chartType), chartType);

            return result;
        },

        /**
         * Setups series data of highcharts options for common series charts.
         *
         * @param columnAxisLeafArray
         * @param result
         * @param chartType
         * @param extraOptions
         */
        setupOptionsSeries: function (columnAxisLeafArray, result, chartType, extraOptions) {
            var isScatterOrBubble = HDM.isScatterOrBubbleChart(chartType),
                measuresNumber = extraOptions.metadata.measures.length;
            var seriesNumber = isScatterOrBubble ? columnAxisLeafArray.length / measuresNumber :
                columnAxisLeafArray.length;

            // Column groups are legend items, one legend per series item.
            for (var i = 0; i < seriesNumber; i++) {
                // For Scatter and Bubble charts not all nodes are used as series.
                // Here we take specific node to extract labels from.
                var columnLeafNode = isScatterOrBubble && !HDM._isMeasureFirst(extraOptions.metadata) ?
                    columnAxisLeafArray[i * measuresNumber] : columnAxisLeafArray[i];

                var label = HDM.assembleFullGroupLinearName(1, columnLeafNode, extraOptions);

                var isLastSeries = i == seriesNumber - 1;

                var tooltip;
                if (HDM.isScatterOrBubbleChart(chartType)) {
                    var hasSelectedColumnsGroups = extraOptions.chartState.columnsSelectedLevels.length > 0;
                    var hasSelectedRowsGroups = extraOptions.chartState.rowsSelectedLevels.length > 0;

                    tooltip = {
                        headerFormat: hasSelectedRowsGroups ? '{point.key}<br/>' : "",
                        pointFormat: HDM.constructTooltipPointFormat(chartType, extraOptions),
                        followPointer: true
                    };
                }

                result.series.push({
                    name: label,
                    data: [],
                    color: isScatterOrBubble ? HDM.getColorWithAlpha(i, 0.75) : HDM.getColor(i),
                    type: HDM.isDualOrMultiAxisChart(chartType) ?
                        HDM.getDualOrMultiAxisHighchartsType(chartType, isLastSeries) : undefined,
                    yAxis: HDM.isMultiAxisChart(chartType) ? i : 0,
                    tooltip: tooltip,
                    columnsOutputParams: HDM.createOutputParameters(columnLeafNode, 1, extraOptions)
                });
            }
        },

        createOutputParameters: function (leafNode, axisNumber, extraOptions) {
            var measures = extraOptions.metadata.measures,
                chartType = extraOptions.chartState.chartType;

            var groups = HDM.getActiveAxisLevels(axisNumber, extraOptions);
            var groupsValues = adhocDataProcessor.getLabelNameArray(axisNumber, leafNode).reverse();
            groupsValues.splice(0, groupsValues.length - groups.length);

            var outputParameters = [];
            for (var i = 0; i < groups.length; i++) {
                outputParameters.push({
                    name: groups[i],
                    value: (HDM._isMeasuresDimension(groups[i].dimension) && HDM.isScatterOrBubbleChart(chartType)) ?
                        measures : groupsValues[i]
                });
            }

            return outputParameters;
        },

        getActiveAxisLevels: function (axisNumber, extraOptions) {
            var axis = extraOptions.metadata.axes[axisNumber];

            var axisGroups;

            if (extraOptions.metadata.isOLAP) {
                // Find selected levels.
                var selectedLevels = (axisNumber === 0) ? extraOptions.chartState.rowsSelectedLevels :
                    extraOptions.chartState.columnsSelectedLevels;

                axisGroups = _.filter(selectedLevels, function (level) {
                    return level.name != "(All)";
                });

            } else {
                // Find selected level.
                var selectedLevel = (axisNumber === 0) ? extraOptions.chartState.rowsSelectedLevels[0] :
                    extraOptions.chartState.columnsSelectedLevels[0];

                // Cut visible levels.
                var cutStartPosition = selectedLevel ? 1 : 0;
                while (selectedLevel && !(axis[cutStartPosition - 1].dimension == selectedLevel.dimension &&
                axis[cutStartPosition - 1].name == selectedLevel.name)) {
                    cutStartPosition++;
                }

                axisGroups = [].concat(axis);
                axisGroups.splice(cutStartPosition, axisGroups.length - cutStartPosition);
            }

            // Add measure level if necessary.
            if (extraOptions.metadata.measureAxis == axisNumber) {
                var measureLevelNumber = adhocDataProcessor.getMeasureLevelNumber(extraOptions.metadata);
                var measuresLevel = axis[measureLevelNumber - 1];

                if (extraOptions.metadata.isOLAP) {
                    if (measureLevelNumber > axisGroups.length) {
                        axisGroups.push(measuresLevel);
                    } else {
                        axisGroups.splice(measureLevelNumber - 1, 0, measuresLevel);
                    }
                } else {
                    if (measureLevelNumber > axisGroups.length) {
                        axisGroups.push(measuresLevel);
                    }
                }
            }

            return axisGroups;
        },

        constructTooltipPointFormat: function (chartType, extraOptions) {
            var hasSelectedColumnsGroups = extraOptions.chartState.columnsSelectedLevels.length > 0,
                onlyTotalsInColumns = HDM.isTotalSelectedOnly(extraOptions, 1),
                pointFormat = "";

            // do not show additional info in tooltip if we have no column groups
            // or we are in OLAP mode and only (All) levels are selected in column levels
            if (hasSelectedColumnsGroups && !onlyTotalsInColumns) {
                pointFormat += "<span style=\"color:{series.color}\">{series.name}</span> <br/>";
            }

            pointFormat += (extraOptions.metadata.measures[0] + " : <b>{point.x:,.2f}</b><br/>" +
            extraOptions.metadata.measures[1] + " : <b>{point.y:,.2f}</b>" +
            (HDM.isBubbleChart(chartType)
                ? ("<br/>" + extraOptions.metadata.measures[2] + " : <b>{point.z:,.2f}</b> ")
                : ""));

            return pointFormat;
        },

        /**
         * Setups Y-axis of highcharts options for common series charts.
         *
         * @param columnAxisLeafArray
         * @param result
         * @param chartType
         * @param extraOptions
         */
        setupOptionsYAxis: function (columnAxisLeafArray, result, chartType, extraOptions) {
            // Setup axes.
            if (HDM.isDualAxisChart(chartType)) {
                // Set reference to Y axis for last series.
                result.series[columnAxisLeafArray.length - 1].yAxis = 1;

                // Create 2 axes.
                // Title on the first axis should be first series (measure) name if there are only 2 series (measures).
                var firstAxisTitle = extraOptions.chartState.showMeasureOnValueAxis && result.series.length == 2 ?
                    result.series[0].name : "";

                result.yAxis.push(HDM.getYAxisForDualOrMultiAxisChart(extraOptions, 0, firstAxisTitle));
                result.yAxis.push(HDM.getYAxisForDualOrMultiAxisChart(extraOptions, columnAxisLeafArray.length - 1,
                    result.series[columnAxisLeafArray.length - 1].name));
            } else if (HDM.isMultiAxisChart(chartType)) {
                // Create an axis for each series.
                for (var i = 0; i < columnAxisLeafArray.length; i++) {
                    result.yAxis.push(HDM.getYAxisForDualOrMultiAxisChart(extraOptions, i, result.series[i].name));
                }
            }
        },

        /**
         * Populates series data and X-axis categories of highcharts options for common series charts.
         *
         * @param rowAxisLeafArray
         * @param columnAxisLeafArray
         * @param result
         * @param chartType
         * @param isTimeSeries
         * @param extraOptions
         */
        populateOptionsDataAndCategories: function (rowAxisLeafArray, columnAxisLeafArray, result, chartType, isTimeSeries, extraOptions) {
            var isScatterOrBubble = HDM.isScatterOrBubbleChart(chartType),
                measuresNumber = extraOptions.metadata.measures.length,
                seriesNumber = isScatterOrBubble
                    ? columnAxisLeafArray.length / measuresNumber
                    : columnAxisLeafArray.length;

            // Go through each measure leaf (set on the x axis) and generate the series for each.
            for (var i = 0; i < rowAxisLeafArray.length; i++) {
                var rowAxisLeafNode = rowAxisLeafArray[i];

                for (var j = 0; j < seriesNumber; j++) {
                    var currSeries = result.series[j];

                    // Value extraction and population of series data array.
                    // Scatter and Bubble charts.
                    if (isScatterOrBubble) {
                        // For Scatter and Bubble charts we should extract measure values for each group (group combination)
                        // and put them into one array.
                        var values = [];

                        //set scatter line width if it was enabled
                        if (extraOptions.chartState.showScatterLine) {
                            currSeries.lineWidth = 1;
                        }

                        // There are two cases of measure values extraction.
                        if (HDM._isMeasureFirst(extraOptions.metadata)) {
                            // 1: Measures first.
                            for (var mIdx = 0; mIdx < measuresNumber; mIdx++) {
                                var val = HDM.getDataValue(rowAxisLeafNode, columnAxisLeafArray[j + mIdx * seriesNumber],
                                    true);
                                values.push(val);
                            }
                        } else {
                            // 2: Measures last.
                            for (var groupIdx = 0; groupIdx < measuresNumber; groupIdx++) {
                                values.push(HDM.getDataValue(rowAxisLeafNode,
                                    columnAxisLeafArray[j * measuresNumber + groupIdx], true));
                            }
                        }

                        var hasNullValuesOnly = _.every(values, function (value) {
                            return value == null;
                        });

                        // Skip null value arrays.
                        if (!hasNullValuesOnly) {
                            // Replace null value to 0. Sometimes (when x is null) Highcharts may not render null values.
                            values = _.map(values, function (num) {
                                return num == null ? 0 : num;
                            });

                            HDM.measureMinMax(values[0]);
                            HDM.measureMinMax(values[1]);

                            var objectValue;
                            if (HDM.isScatterChart(chartType)) {
                                objectValue = {
                                    x: values[0],
                                    y: values[1],
                                    name: HDM.assembleFullGroupHierarchyName(0, rowAxisLeafNode, extraOptions),
                                    rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                                };
                            } else if (HDM.isBubbleChart(chartType)) {
                                objectValue = {
                                    x: values[0],
                                    y: values[1],
                                    z: values[2],
                                    name: HDM.assembleFullGroupHierarchyName(0, rowAxisLeafNode, extraOptions),
                                    rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                                };
                            } else {
                                throw "Unexpected chart type";
                            }

                            currSeries.data.push(objectValue);
                        }
                    } else {
                        var value = HDM.getDataValue(rowAxisLeafNode, columnAxisLeafArray[j], true);

                        // Time series charts.
                        if (isTimeSeries) {
                            if (value.value != null && value.timestamp != null) {
                                HDM.measureMinMax(value.value);

                                var rowsOutputParams = HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions);

                                rowsOutputParams[0].value = value.timestamp;

                                currSeries.data.push({
                                    x: value.timestamp, y: value.value,
                                    rowsOutputParams: rowsOutputParams
                                });
                            }
                        } else {
                            // Other series charts.
                            HDM.measureMinMax(value);

                            // Highcharts handles NULL data in series data. So set whatever we get back.
                            currSeries.data.push({
                                y: value,
                                rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                            });
                            //currSeries.data.push(value);
                        }
                    }
                }

                if (!isTimeSeries && !isScatterOrBubble) {
                    // Row groups are categories across the x-axis.
                    var label = HDM.assembleFullGroupHierarchyName(0, rowAxisLeafNode, extraOptions);

                    result.xAxis.categories.push({name: label});
                }
            }

            // if there is only one "bubble" in bubble chart it may be displayed incorrectly if x value has some decimal digits
            // to fix bug #35757 we force xAxis to start on ticks
            if (HDM.isBubbleChart(chartType) && seriesNumber === 1) {
                result.xAxis.startOnTick = true;
                result.xAxis.endOnTick = true;
            }
        },

        /**
         * Generates Y-axis for dual axis or multi-axis charts.
         *
         * @param extraOptions
         * @param axisNumber
         * @param titleText
         * @returns {*}
         */
        getYAxisForDualOrMultiAxisChart: function (extraOptions, axisNumber, titleText) {
            var yAxis = HDM.getYAxisOptions(HDM.doAxisSwap(extraOptions.chartState.chartType), extraOptions);

            yAxis.opposite = (axisNumber !== 0);
            yAxis.labels.style = {
                color: HDM.getColor(axisNumber),
                fontSize: "1em"
            };
            yAxis.title = {
                text: titleText,
                style: {
                    color: HDM.getColor(axisNumber)
                }
            };

            if (yAxis.opposite === false) {
                yAxis.offset = Math.abs(extraOptions.chartState.yAxisRotation) > 60 ? 5 : 0;
            }

            return yAxis;
        },

        /**
         * Sets categories for X-axis.
         *
         * @param result
         * @param eraseCategories
         */
        setCategories: function (result, eraseCategories, chartType) {
            // 'categories' property should be undefined for some chart types. Otherwise chart will hang.
            if (eraseCategories) {
                result.xAxis.categories = undefined;
            } else if (HDM.groupedCategories) {
                if (this.areCategoriesSupported(chartType)) {
                    result.xAxis.categories = HDM.highchartsCategories;
                }
            }
        },

        /**
         * Checks if categories are supported for current chart type.
         *
         * @returns {boolean} true if categories are supported, false otherwise.
         */
        areCategoriesSupported: function (chartType) {
            return chartType.indexOf("spider") == -1 && (
                chartType.indexOf('column') >= 0 ||
                chartType.indexOf('area') >= 0 ||
                chartType.indexOf('line') >= 0 ||
                chartType.indexOf('spline') >= 0);
        },

        //
        //  The Pie chart is completely axis based
        //
        //  The general principle is that there is 1 pie per Column Axis group
        //  and an individual pie's slices correspond to the Row Axis groups
        //
        //
        getPieSeries: function (rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions) {
            HDM.measureMin = null;
            HDM.measureMax = null;

            var titleLines = (_.isArray(columnSlider) ? columnSlider.length : columnSlider) + extraOptions.metadata.measureAxis;
            var titleTextLineHeight = 15;
            var textTopBottomPadding = 10;
            var titleHeight = titleTextLineHeight * titleLines + textTopBottomPadding;
            var containerWidth = extraOptions.width;
            var containerHeight = extraOptions.height;
            var chartType = extraOptions.chartState.chartType;

            var dataStyle = adhocDataProcessor.getDataStyle();
            var label;

            var result = _.extend(HDM.getGeneralOptions(extraOptions), {
                xAxis: {
                    categories: []
                },
                plotOptions: {
                    pie: {
                        slicedOffset: 0,
                        point: {
                            events: {
                                legendItemClick: HDM._getLegendItemClickHandler
                            }
                        }
                    }
                },
                series: [],
                labels: {
                    items: []
                },
                legend: HDM.getLegendOptions(extraOptions)
            });

            //
            // single axis ONLY.
            //
            //  1 cases:
            //      0.  data on rows only
            //      1.  data on columns only
            //
            //
            //
            //
            if (dataStyle === 0) {
                //
                //  data on rows only
                //
                //  in all cases there is a single pie with slices = row groups
                //
                if (extraOptions.metadata.axes[0].length > 0) {

                    // since there's only 1 'live' axis the non-live axis should have only one node and this is it
                    var columnNode = columnAxisLeafArray[0];
                    var pieSetSize = 1;
                    var pieMaxPositionCount = pieSetSize + 1;
                    var xAxisPositionIncrement = 100 / pieMaxPositionCount;
                    var xAxisPosition = xAxisPositionIncrement;
                    var yAxisPosition = 50;

                    //  nonMeasure groups contain measure subgroups.
                    //  the label is for nonMeasure groups so it spans all of its measure pies
                    var labelMaxPositionCount = pieSetSize + 1;
                    var labelAbsolutePositionIncrement = containerWidth / labelMaxPositionCount;
                    var labelAbsolutePosition = labelAbsolutePositionIncrement - (labelAbsolutePositionIncrement / pieMaxPositionCount);

                    var centerArray = [];
                    var xAxis = xAxisPosition + "%";
                    var yAxis = yAxisPosition + "%";
                    centerArray.push(xAxis);
                    centerArray.push(yAxis);

                    var name = adhocDataProcessor.getMessage("totalsLabelForChart");
                    if (extraOptions.metadata.measures[0].name) {
                        name = extraOptions.metadata.measures[0].name;
                    }
                    result.series.push({
                        type: 'pie',
                        name: name,
                        data: [],
                        center: centerArray,
                        size: (xAxisPositionIncrement * 2) + "%",
                        showInLegend: true,
                        dataLabels: {enabled: false},
                        columnsOutputParams: HDM.createOutputParameters(columnNode, 1, extraOptions)
                    });

                    for (var i = 0; i < rowAxisLeafArray.length; i++) {
                        var rowAxisLeafNode = rowAxisLeafArray[i];
                        var value = HDM.getDataValue(rowAxisLeafNode, columnNode);
                        HDM.measureMinMax(value);

                        label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNode, extraOptions);

                        result.series[0].data.push({
                            name: label,
                            y: value,
                            rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                        });
                    }
                }

                //
                // data on columns only
                //
                //  if it's measures only , then there is 1 pie with measure slices
                //
                //  for groups it's 1 pie per group with measure slices
                //
                //  we distinguish 2 cases:
                //      0.  measures in axis leaves:
                //              In this case the number of pies is the (number of axis leaves) / (number of measures)
                //              The slices are the measures
                //
                //
                //      1.  measures NOT in axis leaves:
                //              In this case tne number of pies is the number of axis leaves
                //
                //
                else {
                    var rowAxisNode = rowAxisLeafArray[0];
                    var isMeasureOnly = (extraOptions.metadata.axes[1].length <= 1 ? true : false);
                    var measureIsLast = adhocDataProcessor.isMeasuresLastOnAxis(1);
                    var numberOfMeasures = extraOptions.metadata.measures.length;

                    // determine how many pies there are
                    var pieSetSize = 1;     // measure only case
                    if (!isMeasureOnly) {
                        if (measureIsLast) {
                            pieSetSize = columnAxisLeafArray.length / numberOfMeasures;
                        }
                        else {
                            // for measures not at the leaf level
                            // the number of pies is the number of leaf level members
                            pieSetSize = columnAxisLeafArray.length;

                        }
                    }

                    var squareSideLength = HDM.getSquareSideLength(pieSetSize, containerWidth, containerHeight);
                    for (var m = 0; m < pieSetSize; m++) {
                        var pieInfo = HDM.computePieParams(m + 1, squareSideLength, containerWidth, containerHeight,
                            titleHeight, pieSetSize);
                        var index = m;

                        label = adhocDataProcessor.getMessage("allLabelForChart");
                        if (!isMeasureOnly) {
                            if (measureIsLast) {
                                index = m * numberOfMeasures;             // 1 pie per group of measures
                                var node = columnAxisLeafArray[index];    // this label is measure name
                                label = node.parent.label;                // parent of measure
                            }
                            else {
                                label = columnAxisLeafArray[m].label;
                            }
                        }

                        var centerArray = [];
                        var xAxis = pieInfo.xAxisPositionPercent + "%";
                        var yAxis = pieInfo.yAxisPositionPercent + "%";
                        centerArray.push(xAxis);
                        centerArray.push(yAxis);
                        var index = m;
                        if (measureIsLast) {
                            if (!isMeasureOnly) {
                                index = m * numberOfMeasures;
                            }
                        }
                        // only show the legend once
                        var showInLegendValue = m > 0 ? false : true;
                        result.series.push({
                            type: 'pie',
                            name: columnAxisLeafArray[index].label,
                            data: [],
                            center: centerArray,
                            size: pieInfo.pieSizePercent + "%",
                            showInLegend: showInLegendValue,
                            dataLabels: {enabled: false},
                            title: {
                                text: label,
                                verticalAlign: 'top',
                                y: -titleHeight
                            },
                            columnsOutputParams: HDM.createOutputParameters(columnAxisLeafArray[index], 1, extraOptions)
                        });
                    }


                    //
                    //  case:  measures only (no groups)
                    //      single pie with measures as slices
                    //
                    //  case:  measures are leaves:
                    //      all leaves are grouped by common lowest non-measure group
                    //      we have to cycle through the labels
                    //      e.g.  Canada-Sales, Canada-Cost, Mexico-Sales, Mexico-Cost, etc..
                    //
                    //      so we take advantage of this ordering to know when to switch pies
                    //      switch on a change in the non-measure group  'Country'
                    //
                    //  case:  measures are NOT leaves:
                    //      one pie per column leaf group
                    //
                    if (isMeasureOnly) {     // single pie only
                        for (var i = 0; i < columnAxisLeafArray.length; i++) {
                            var columnAxisLeafNode = columnAxisLeafArray[i];

                            var value = HDM.getDataValue(rowAxisNode, columnAxisLeafNode);
                            HDM.measureMinMax(value);

                            label = HDM.assembleFullGroupLinearName(1, columnAxisLeafNode, extraOptions);

                            result.series[0].data.push({
                                x: label,
                                y: value,
                                rowsOutputParams: HDM.createOutputParameters(rowAxisNode, 0, extraOptions)
                            });
                        }
                    }
                    else if (measureIsLast) {   // pie per non-measure group
                        var currLeafLabel = columnAxisLeafArray[0].label;
                        var pieIndex = 0;
                        var measureCounter = 0;
                        for (var i = 0; i < columnAxisLeafArray.length; i++) {
                            var columnAxisLeafNode = columnAxisLeafArray[i];
                            measureCounter++;

                            if (measureCounter > numberOfMeasures) {
                                pieIndex++;
                                if (pieIndex >= pieSetSize)  throw "highchart.datamapper getPieSeries: exceeded numberOfPies=" + numberOfPies; // jshint ignore: line
                                measureCounter = 1;
                            }
                            var value = HDM.getDataValue(rowAxisNode, columnAxisLeafNode);
                            HDM.measureMinMax(value);

                            label = columnAxisLeafNode.label;    // measure name only

                            result.series[pieIndex].data.push({
                                name: label,
                                y: value,
                                rowsOutputParams: HDM.createOutputParameters(rowAxisNode, 0, extraOptions)
                            });
                        }
                    }
                    else {           // pie per leaf node
                        for (var i = 0; i < columnAxisLeafArray.length; i++) {
                            var columnAxisLeafNode = columnAxisLeafArray[i];
                            var value = HDM.getDataValue(rowAxisNode, columnAxisLeafNode);
                            HDM.measureMinMax(value);

                            label = HDM.assembleFullGroupHierarchyName(1, columnAxisLeafNode, extraOptions);

                            result.series[i].data.push({
                                name: label,
                                y: value,
                                rowsOutputParams: HDM.createOutputParameters(rowAxisNode, 0, extraOptions)
                            });
                        }
                    }
                }
            }
            //
            // full on crosstab
            //
            // one pie per column group
            //
            // 1 slice per row group
            //
            //
            if (dataStyle == 2 || dataStyle == 1) {

                // setup each individual pie  in the highcharts  series
                //
                // There is a single pie for each column group
                //   so we iterate on the column axis
                //
                var squareSideLength = HDM.getSquareSideLength(columnAxisLeafArray.length, containerWidth, containerHeight);
                for (var m = 0; m < columnAxisLeafArray.length; m++) {
                    var pieInfo = HDM.computePieParams(m + 1, squareSideLength, containerWidth, containerHeight,
                        titleHeight, columnAxisLeafArray.length);

                    var columnGroupName = columnAxisLeafArray[m].label;
                    //
                    // column axis is the measure axis so we want the label to
                    //  be  previous-level-label + measure name
                    //
                    var label = HDM.assembleFullGroupHierarchyName(1, columnAxisLeafArray[m], extraOptions);
                    var pieName = columnGroupName;
                    var centerArray = [];
                    var xAxis = pieInfo.xAxisPositionPercent + "%";
                    var yAxis = pieInfo.yAxisPositionPercent + "%";
                    centerArray.push(xAxis);
                    centerArray.push(yAxis);

                    // only show the legend once
                    var showInLegendValue = m > 0 ? false : true;
                    result.series.push({
                        type: 'pie',
                        name: pieName,
                        data: [],
                        center: centerArray,
                        size: pieInfo.pieSizePercent + "%",
                        showInLegend: showInLegendValue,
                        dataLabels: {enabled: false},
                        title: {
                            text: label,
                            verticalAlign: 'top',
                            y: -titleHeight
                        },
                        columnsOutputParams: HDM.createOutputParameters(columnAxisLeafArray[m], 1, extraOptions)
                    });
                }


                // for each columnGroup's pie:
                //  go through the row groups to fill in the slices

                var pieSeriesIndex = 0;      // be really careful with the use of this.  It MUST match the series initialization above !
                for (var i = 0; i < columnAxisLeafArray.length; i++) {
                    var columnAxisLeafNode = columnAxisLeafArray[i];      // for this nonMeasure axis group a set of pies for each measure

                    for (var j = 0; j < rowAxisLeafArray.length; j++) {
                        var rowAxisLeafNode = rowAxisLeafArray[j];
                        var value = HDM.getDataValue(rowAxisLeafNode, columnAxisLeafNode);
                        HDM.measureMinMax(value);

                        label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNode, extraOptions);

                        result.series[i].data.push({
                            name: label,
                            y: value,
                            rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                        });
                    }
                }
            }
            return result;
        },


        //
        //  The Semi-Pie chart is completely axis based
        //
        //  The general principle is that there is 1 pie per Column Axis group
        //  and an individual pie's slices correspond to the Row Axis groups
        //
        //
        getSemiPieSeries: function (rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions) {
            var centerY, size;
            var series = this.getPieSeries(rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions);

            series.plotOptions.pie.startAngle = -90;
            series.plotOptions.pie.endAngle = 90;

            for (var i = 0; i < series.series.length; i++) {
                size = parseFloat(series.series[i].size);
                centerY = parseFloat(series.series[i].center[1]);
                centerY = (centerY + (centerY * size / 100) / 2);
                series.series[i].center[1] = centerY + "%";
            }

            return series;
        },

        //
        //  The Dual-Level Pie chart
        //
        //
        //
        //
        getDualLevelPieSeries: function (rowAxisLeafArray, columnAxisLeafArray, rowSlider, columnSlider, extraOptions) {
            HDM.measureMin = null;
            HDM.measureMax = null;

            var rowAxisLeafArrayInner = [],
                columnNode = columnAxisLeafArray[0],
                columnName = columnNode.label === "(empty axis)" ? "Value" : columnNode.label,
                label, value,
                rowAxisLeafNode, rowAxisLeafNodeInner,
                colors = HDM.colors,
                colorsCount = colors.length,
                brightness,
                outerPiecesCounter = 0,
                innerPiecesCounter = -1,
                calcInnerPie = false,
                chartType = extraOptions.chartState.chartType;

            if (extraOptions.metadata.isOLAP) {
                // skip if only "All" field selected
                if (extraOptions.metadata.axes[0][0].name !== "(All)") {
                    rowSlider[0].level -= 1;
                    rowAxisLeafArrayInner = adhocDataProcessor.getNodeListForDimLevelRadio(0, rowSlider);
                }
            } else {
                if (HDM._isMeasureFirst(extraOptions.metadata)) {
                    rowAxisLeafArrayInner = adhocDataProcessor.getNodeListForSliderLevel(0, rowSlider - 1);
                }
            }

            var result = _.extend(HDM.getGeneralOptions(extraOptions), {
                xAxis: {
                    categories: []
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            style: {
                                "fontWeight": "normal",
                                "textShadow": "none"
                            }
                        },
                        slicedOffset: 0,
                        point: {
                            events: {
                                legendItemClick: HDM._getLegendItemClickHandlerDisabled
                            }
                        }
                    }
                },
                series: [],
                labels: {
                    items: []
                },
                legend: HDM.getLegendOptions(extraOptions)
            });


            // fill innermost pie
            result.series.push({
                name: columnName,
                data: [],
                center: ["50%", "50%"],
                size: "60%",
                showInLegend: false,
                dataLabels: {
                    color: 'white',
                    distance: -50,
                    style: {
                        fontSize: "1em"
                    }

                },
                columnsOutputParams: HDM.createOutputParameters(columnNode, 1, extraOptions)
            });

            for (var i = 0; i < rowAxisLeafArrayInner.length; i++) {
                rowAxisLeafNodeInner = rowAxisLeafArrayInner[i];

                value = HDM.getDataValue(rowAxisLeafNodeInner, columnAxisLeafArray[0]);
                label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNodeInner, extraOptions);
                rowAxisLeafNodeInner.parent.color = colors[i % colorsCount];

                result.series[0].data.push({
                    name: label,
                    y: value,
                    color: colors[i % colorsCount],
                    rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNodeInner, 0, extraOptions)
                });

            }

            // if innermost pie data did not filled, do it from outermost data
            if (result.series[0].data.length === 0) {
                calcInnerPie = true;
            }

            // fill outermost pie
            result.series.push({
                name: columnName,
                data: [],
                center: ["50%", "50%"],
                size: "90%",
                innerSize: "60%",
                showInLegend: true,
                dataLabels: {
                    enabled: false,
                    style: {
                        fontSize: "1em"
                    }
                },
                columnsOutputParams: HDM.createOutputParameters(columnNode, 1, extraOptions)
            });

            for (var i = 0; i < rowAxisLeafArray.length; i++) {
                rowAxisLeafNode = rowAxisLeafArray[i];

                if (rowAxisLeafNode === rowAxisLeafNode.parent.children[0] ||
                    (extraOptions.metadata.isOLAP && rowAxisLeafNode === rowAxisLeafNode.parent.children[0].children[0])) {
                    outerPiecesCounter = 0;
                    innerPiecesCounter++;
                    if (calcInnerPie) {
                        result.series[0].data.push({
                            name: HDM.assembleFullGroupLinearName(0, rowAxisLeafNode.parent, extraOptions),
                            y: 0,
                            color: colors[innerPiecesCounter % colorsCount],
                            rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                        });
                        rowAxisLeafNode.parent.color = colors[innerPiecesCounter % colorsCount];
                    }
                } else {
                    outerPiecesCounter++;
                }

                value = HDM.getDataValue(rowAxisLeafNode, columnNode);
                label = HDM.assembleFullGroupLinearName(0, rowAxisLeafNode, extraOptions);

                brightness = 0.2 - (outerPiecesCounter / rowAxisLeafNode.parent.children.length) / 5;

                result.series[1].data.push({
                    name: label,
                    y: value,
                    color: Highcharts.Color(rowAxisLeafNode.parent.color || colors[0]).brighten(brightness).get(),
                    rowsOutputParams: HDM.createOutputParameters(rowAxisLeafNode, 0, extraOptions)
                });

                if (calcInnerPie) {
                    result.series[0].data[innerPiecesCounter].y += value;
                }
            }

            if (!rowAxisLeafArray.length) {
                result.series[0].data = [];
            }

            return result;
        },

        getCommonHeatMapOptions: function (rowAxisLeafArray, columnAxisLeafArray, extraOptions, showNull) {
            var result = HDM.getCommonSeriesGeneralOptions(extraOptions);
            var legendHorizontal = _.include(["bottom", "top"], extraOptions.chartState.legend);

            result = _.extend(result, {
                colorAxis: _.extend(_.clone(HDM.colorAxis), {
                    labels: {
                        style: {
                            fontSize: "1em"
                        }
                    },
                    // Workaround for heat map legend ticks positioning. Provide the same settings for horizontal
                    // and vertical legend for render the same number of ticks
                    tickPixelInterval: HDM.HEATMAP_LEGEND_TICK_INTERVAL
                }),
                series: [{
                    borderWidth: 1,
                    data: [],
                    dataLabels: {
                        enabled: false
                    },
                    chartType: "heatmap",
                    columnsOutputParams: HDM.createOutputParameters(columnAxisLeafArray[0], 1, extraOptions)
                }],
                tooltip: {
                    "valueDecimals": 2,
                    formatter: function () {
                        return this.series.yAxis.categories[this.point.y] + ", " + this.series.xAxis.categories[this.point.x] +
                            "<br/>" + columnAxisLeafArray[0].label + ": <b>" +
                            (showNull && this.point.value === null ? null : Highcharts.numberFormat(this.point.value, 2)) +
                            "</b>";
                    },
                    useHTML: true,
                    style: {
                        fontSize: "1em"
                    }
                }
            });
            result.yAxis.title = null;
            result.xAxis.gridLineWidth = result.yAxis.gridLineWidth = showNull ? 0 : 1;

            return result;
        },

        getHeatMapOptions: function (rowAxisLeafArray, columnAxisLeafArray, extraOptions) {
            // showNull - allow rendering empty cells with null values
            var showNull = true;

            HDM.measureMin = null;
            HDM.measureMax = null;

            var result = HDM.getCommonHeatMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions, showNull);
            result.legend.padding = 15;

            var matrixData = HDM.computeHeatMapMatrixData(rowAxisLeafArray, columnAxisLeafArray, showNull, extraOptions);
            result.series[0].data = matrixData.data;
            result.series[0].heatmapXCategories = matrixData.xCategories;
            result.xAxis.categories = matrixData.xCategories;
            result.yAxis.categories = matrixData.yCategories;

            if (matrixData.xCategories.length !== 1) {
                result.xAxis.minRange = 1;
            }
            if (matrixData.yCategories.length !== 1) {
                result.yAxis.minRange = 1;
            }

            result.colorAxis.min = HDM.measureMin;
            result.colorAxis.max = HDM.measureMax;

            return result;

        },

        computeHeatMapMatrixData: function (rowAxisLeafArray, columnAxisLeafArray, showNull, extraOptions) {
            var value, col, yCategoriesFilled = false,
                result = {
                    data: [],
                    xCategories: [],
                    yCategories: []
                };

            _.each(columnAxisLeafArray, function (measure, x) {
                col = measure.parent;

                result.xCategories.push(col.label);

                _.each(rowAxisLeafArray, function (row, y) {
                    if (!yCategoriesFilled) {
                        result.yCategories.push(row.label);
                    }
                    value = HDM.getDataValue(row, col.children[0], true);
                    if (value !== null || showNull) {
                        HDM.measureMinMax(value);
                        result.data.push({
                            x: x,
                            y: y,
                            value: value,
                            rowsOutputParams: HDM.createOutputParameters(row, 0, extraOptions)
                        });
                    }
                });

                yCategoriesFilled = true;
            });

            return result;
        },

        getHeatMapTimeSeriesOptions: function (rowAxisLeafArray, columnAxisLeafArray, extraOptions) {
            // showNull - allow rendering empty cells with null values
            var showNull = true;
            var result = HDM.getCommonHeatMapOptions(rowAxisLeafArray, columnAxisLeafArray, extraOptions, showNull);
            result.series[0].chartType = "timeseries_heatmap";
            result.legend.padding = 15;

            if (!rowAxisLeafArray.length) return result;

            var hashedData = {},
                tmpTime = new Date(),
                xMin, xMax,
                zValue,
                yValue, yLabels = {},
                colSize = 24 * 36e5,
                firstItem = HDM.getDataValue(rowAxisLeafArray[0], columnAxisLeafArray[0]);

            HDM.measureMin = HDM.measureMax = firstItem.value;
            xMin = xMax = firstItem.timestamp;


            // create hash 'timestamp'=value
            // find min/max for X and Z
            _.each(rowAxisLeafArray, function (item) {
                var itemData = HDM.getDataValue(item, columnAxisLeafArray[0], true);
                var zValue = itemData.value;

                hashedData[itemData.timestamp] = zValue;
                xMin = Math.min(xMin, itemData.timestamp);
                xMax = Math.max(xMax, itemData.timestamp);

                HDM.measureMinMax(zValue);
            });

            var rowsOutputParamTemplate = HDM.createOutputParameters(rowAxisLeafArray[0], 0, extraOptions);

            // create series data array for each hour
            var timeEndDate = new Date(xMax);
            tmpTime.setTime(xMin);
            do {
                if (hashedData.hasOwnProperty(tmpTime.getTime())) {
                    zValue = hashedData[tmpTime.getTime()];
                } else if (showNull) {
                    zValue = null;
                } else {
                    tmpTime.setUTCHours(tmpTime.getUTCHours() + 1);
                    continue;
                }

                yValue = tmpTime.getUTCHours();
                yLabels[yValue] = true;

                tmpTime.setUTCHours(0);
                rowsOutputParamTemplate[0].value = tmpTime.getTime();
                result.series[0].data.push({
                    x: tmpTime.getTime(),
                    y: yValue,
                    value: zValue,
                    rowsOutputParams: _.cloneDeep(rowsOutputParamTemplate)
                });

                tmpTime.setUTCHours(yValue + 1);
            } while (tmpTime <= timeEndDate);

            // values settings
            result.colorAxis.min = HDM.measureMin;
            result.colorAxis.max = HDM.measureMax;

            // Y axis settings
            yLabels = _.map(yLabels, function (item, key) {
                return parseInt(key, 10);
            });
            result.yAxis = _.extend(result.yAxis, {
                startOnTick: false,
                endOnTick: false,
                reversed: true,
                tickPositioner: function (min, max) {
                    return yLabels.slice(Math.round(min), Math.round(max) + 1);
                },
                minRange: 8,
                labels: _.extend(result.yAxis.labels, {
                    format: "{value}:00"
                })
            });

            // X axis settings
            result.series[0].name = columnAxisLeafArray[0].label;
            result.series[0].colsize = colSize;
            result.series[0].borderWidth = 0;

            tmpTime.setTime(xMin);
            tmpTime.setUTCHours(0);
            result.xAxis.min = tmpTime.getTime();
            tmpTime.setTime(xMax);
            tmpTime.setUTCHours(0);
            result.xAxis.max = tmpTime.getTime();
            result.xAxis.minRange = 30 * colSize;
            result.xAxis.type = "datetime";
            result.xAxis.categories = null;
            result.xAxis.endOnTick = false;
            result.xAxis.labels = _.extend(result.xAxis.labels, {
                format: '{value:%B}' // long month
            });

            // calc tick positions for x axis
            result.xAxis.tickPositions = [];
            tmpTime.setTime(xMin);
            do {
                result.xAxis.tickPositions.push(tmpTime.getTime());
                if (tmpTime.getUTCDate() !== 1) {
                    tmpTime.setUTCDate(1);
                }
                tmpTime.setUTCMonth(tmpTime.getUTCMonth() + 1);
            } while (tmpTime.getTime() <= xMax);

            result.tooltip = _.extend(result.tooltip, {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                style: {
                    padding: 0,
                    color: 'black',
                    fontSize: "1em"
                },
                formatter: function () {
                    return '<span style="color:{series.color}">\u25CF</span> ' + columnAxisLeafArray[0].label +
                        "<br/>" + Highcharts.dateFormat("%e %b %Y", this.point.x) + " " + this.point.y + ":00 <b>" +
                        (showNull && this.point.value === null ? null : Highcharts.numberFormat(this.point.value, 2)) +
                        "</b>";
                }
            });

            // provide indicator for time series heat map for rendering by canvas
            result.chart.isHeatMapTimeSeriesChart = true;
            return result;
        },

        // ==================================================================================
        // TREE MAP Charts

        getDualMeasureSingleFieldTreeMapOptions: function (rowAxisLeafArray, columnAxisLeafArray, extraOptions) {

            var commonOptions = HDM.getCommonSeriesGeneralOptions(extraOptions);

            delete commonOptions.xAxis;
            delete commonOptions.yAxis;
            delete commonOptions.legend;
            delete commonOptions.plotOptions;

            // In this chart we are implementing a special case
            // then the first measure will be a "normal" weight of the cell on chart
            // (and it will determine it's size), and the second measure will determine
            // a color of the cell.
            // So, we don't need to loop over each measure in this case.

            var data = [];
            // loop for data from one Field in Row
            _.each(rowAxisLeafArray, function (row, y) {

                var
                    label,
                    value = HDM.getDataValue(row, columnAxisLeafArray[0], true),
                    colorValue = HDM.getDataValue(row, columnAxisLeafArray[1], true);

                // Next goes the fix for issue found in ticket
                // http://jira.jaspersoft.com/browse/JRS-15516
                // In some cases we get empty strings from server as a column names and it makes
                // 'name' key empty as well. This forces HC library use 'id' key instead of 'name'
                // which we don't want and to overcome this we change empty string into one space
                label = row.label;
                if (label === "") {
                    label = " ";
                }

                data.push({
                    id: "row_" + y,
                    name: label,
                    measure1Name: columnAxisLeafArray[0].label,
                    measure2Name: columnAxisLeafArray[1].label,
                    value: value,
                    colorValue: colorValue
                });
            });

            var formatter = function () {
                var measure1Value = this.point.value;
                var measure2Value = this.point.colorValue;
                var measure1Name = this.point.measure1Name;
                var measure2Name = this.point.measure2Name;

                measure1Value = (measure1Value === null ? null : Highcharts.numberFormat(measure1Value, 2));
                measure2Value = (measure2Value === null ? null : Highcharts.numberFormat(measure2Value, 2));

                return this.key + "</br>" +
                    measure1Name + ": <b>" + measure1Value + "</b></br>" +
                    measure2Name + ": <b>" + measure2Value + "</b>";
            };

            var legendEnabled = true;
            var legendAlign = "center";
            var legendVerticalAlign = "bottom";
            var legendLayout = "horizontal";
            switch (extraOptions.chartState.legend) {
                case "top":
                    legendAlign = "center";
                    legendVerticalAlign = "top";
                    legendLayout = "horizontal";
                    break;
                case "right":
                    legendAlign = "right";
                    legendVerticalAlign = "middle";
                    legendLayout = "vertical";
                    break;
                case "bottom":
                    legendAlign = "center";
                    legendVerticalAlign = "bottom";
                    legendLayout = "horizontal";
                    break;
                case "left":
                    legendAlign = "left";
                    legendVerticalAlign = "middle";
                    legendLayout = "vertical";
                    break;
                case "none":
                    legendEnabled = false;
                    break;
            }

            return _.extend(commonOptions, {
                plotOptions: {
                    treemap: {}
                },
                legend: {
                    title: {
                        text: columnAxisLeafArray[1].label
                    },
                    enabled: legendEnabled,
                    align: legendAlign,
                    layout: legendLayout,
                    borderWidth: extraOptions.chartState.legendBorder ? 1 : 0,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    verticalAlign: legendVerticalAlign,
                    padding: 15
                },
                colorAxis: {
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0],
                    maxPadding: 2,
                    tickWidth: 1
                },
                series: [{
                    borderWidth: 1,
                    data: data,
                    dataLabels: {
                        enabled: false
                    },
                    layoutAlgorithm: 'squarified',
                    chartType: "treemap",
                    allowDrillToNode: true,
                    levels: [{
                        level: 1,
                        dataLabels: {
                            enabled: true
                        },
                        borderWidth: 3
                    }]
                    // this is our custom field
                }],
                tooltip: {
                    valueDecimals: 2,
                    formatter: formatter,
                    useHTML: true,
                    style: {
                        fontSize: "1em"
                    }
                }
            });
        },

        getTreeMapOptions: function (rowAxisLeafArray, columnAxisLeafArray, extraOptions) {

            // In default algo we add as many parent's layers as we have.
            // In "one parent" algo we add only one level of "parent" layer
            var oneParentChart = false;
            if (extraOptions.chartState.chartType === "one_parent_tree_map") {
                oneParentChart = true;
            }

            var measureName = columnAxisLeafArray[0].label;

            // an data array for HC library
            var HCData = [];

            // map of parents with their data
            var parents = {};

            // a helper function to build the path which will be used in HD data as "id"
            var getId = function (labels, level) {
                // it builds from array
                // ["Canned Foods", "Canada", "F"]
                // with level parameter "0" a string "/F/Canada/Canned Foods"
                // with level parameter "1" a string "/F/Canada"
                // with level parameter "2" a string "/F"
                // with level parameter "3" a string "/"
                // with level parameter "4" a string "/"
                // ...etc
                return "/@#/" + _.clone(labels).slice(level).reverse().join("/@#/");
            };

            // a helper function to get name of some label
            var getItsNameOrParentsName = function (labels, level) {

                // 'labels' is the array like this one: ["Anchorage", "AK", "USA"]
                // or like this one: ["Barcelona", " ", "Spain"]
                // and the 'name' is the element of the 'labels' with index 'level' or bigger.

                // The idea behind getting 'Name' is to get parent's name for some index (level).
                // Like for "Anchorage" the parent's name is "AK", and for "AK" is "USA".

                // And the problem of getting name is what some levels don't have direct parent (like "Barcelona").
                // In this case we need to go upper and find its most close parent (for "Barcelona"
                // it would be the "Spain").

                // Note: while 'levels' array may have empty strings in the middle, but first and
                // the last index should not be an empty string.
                // But because anything may happen we have a return in the end.

                var
                    i, name;

                for (i = level; i < labels.length; i++) {
                    name = labels[i];
                    if (name !== " ") {
                        return name;
                    }
                }

                return " ";
            };

            _.each(rowAxisLeafArray, function (item) {

                var
                    i,
                    id,
                    parentId,
                    someParentId,
                    someParentOfParentId,

                    dataValues,

                    name,
                    labels = adhocDataProcessor.getLabelNameArray(null, item),
                    value = HDM.getDataValue(item, columnAxisLeafArray[0], true);

                // Next goes the fix for issue found in ticket
                // http://jira.jaspersoft.com/browse/JRS-15516
                // In some cases we get empty strings from server as a column names
                // which are used to build relations between levels.
                // In this case 'name' key (see code below) becomes like this one: "//Austria"
                // Which is wrong. To deal with this we replace '' with ' ' (a one space), and the name becomes
                // '/ /Austria' which makes HC library build correct relations between levels
                _.each(labels, function (label, key) {
                    if (label === "") {
                        labels[key] = " ";
                    }
                });

                // get an ID for HD data array
                id = getId(labels, 0);
                parentId = getId(labels, 1);

                // Now processing parents.
                // To do this we need to take labels of the item (which has in array all parents)
                // and skip the first-level label (because it's a label of the item)
                for (i = 1; i < labels.length; i++) {
                    name = getItsNameOrParentsName(labels, i);
                    someParentId = getId(labels, i);
                    someParentOfParentId = getId(labels, i + 1);

                    if (!parents[someParentId]) {
                        parents[someParentId] = {
                            id: someParentId,
                            name: name,
                            value: 0,
                            measureName: measureName,
                            tooltipLabel: _.clone(labels).slice(i).join(", ")
                        };

                        // build links to parents of parents only in "Algo 0"
                        if (oneParentChart === false) {
                            if (someParentOfParentId !== "/@#/") {
                                parents[someParentId].parent = someParentOfParentId;
                            }
                        }
                    }

                    parents[someParentId].value += value;

                    // handle only one-level parents
                    if (oneParentChart) {
                        break;
                    }
                }

                // build an item for HC data array
                dataValues = {
                    id: id,
                    name: labels[0],
                    value: value,
                    measureName: measureName,
                    tooltipLabel: _.clone(labels).join(", ")
                };

                // install parent link if it exists
                if (parentId !== "/@#/") {
                    dataValues.parent = parentId;
                }

                // and add it
                HCData.push(dataValues);
            });

            // now, add each parent we created into HC data array
            _.each(parents, function (parent) {
                HCData.push(parent);
            });


            // now, form the colors in the top-level cells
            var colorIndex = 0, colorPalette = Highcharts.getOptions().colors;
            for (var cell, i = 0, l = HCData.length; i < l; i++) {
                cell = HCData[i];
                if (!cell.parent) {
                    cell.color = colorPalette[colorIndex % colorPalette.length];
                    colorIndex++;
                }
            }


            var commonOptions = HDM.getCommonSeriesGeneralOptions(extraOptions);

            delete commonOptions.xAxis;
            delete commonOptions.yAxis;
            delete commonOptions.legend;
            delete commonOptions.plotOptions;

            if (Object.keys(parents).length !== 0) {
                // If we have "parents" n the chart, it means user can Drill-Down.
                // During the drill-down HC displays a "Back" button to get back to upper level in chart.
                // this button appears above the chart. So we need to make sure it will be visible.
                commonOptions.chart.marginTop = 50;
            }


            var formatter = function () {
                var tooltipLabel = this.point.tooltipLabel ? (this.point.tooltipLabel + "</br>") : "";
                var value = this.point.value;
                var measureName = this.point.measureName;

                value = (value === null ? null : Highcharts.numberFormat(value, 2));

                return tooltipLabel +
                    measureName + ": <b>" + value + "</b>";
            };

            return _.extend(commonOptions, {
                plotOptions: {
                    treemap: {},
                    series: {
                        dataLabels: {
                            overflow: "none"
                        }
                    }
                },
                series: [{
                    borderWidth: 1,
                    data: HCData,
                    dataLabels: {
                        enabled: false
                    },
                    layoutAlgorithm: 'squarified',
                    chartType: "treemap",
                    allowDrillToNode: true,
                    drillUpButton: {
                        relativeTo: 'plotBox',
                        position: {
                            y: -45
                        }
                    },
                    levels: [{
                        level: 1,
                        dataLabels: {
                            enabled: true
                        },
                        borderWidth: 3
                    }],
                    levelIsConstant: false
                }],
                tooltip: {
                    valueDecimals: 2,
                    formatter: formatter,
                    useHTML: true,
                    style: {
                        fontSize: "1em"
                    }
                }
            });
        },

        //==============================================================================
        // listeners and helpers functions

        _getLegendItemClickHandler: function (event) {
            event.preventDefault();
            var dataArray = _.flatten(_.pluck(this.series.chart.series, "data"));
            var self = this;
            _.each(dataArray, function (data) {
                if (data.name == self.name) {
                    data.setVisible(!data.visible);
                }
            });
        },

        _getLegendItemClickHandlerDisabled: function (event) {
            event.preventDefault();
        },

        getSquareSideLength: function (squaresCount, width, height) {
            // Test for invalid input.
            if (width * height < squaresCount) {
                return 0;
            }

            // Initial guess.
            var aspect = height / width;
            var xf = Math.sqrt(squaresCount / aspect);
            var yf = xf * aspect;
            var x = Math.max(1.0, Math.floor(xf));
            var y = Math.max(1.0, Math.floor(yf));
            var x_size = Math.floor(width / x);
            var y_size = Math.floor(height / y);
            var squareSideLength = Math.min(x_size, y_size);

            // Test our guess:
            x = Math.floor(width / squareSideLength);
            y = Math.floor(height / squareSideLength);
            // We guessed too high.
            if (x * y < squaresCount) {
                if (((x + 1) * y < squaresCount) && (x * (y + 1) < squaresCount)) {
                    // Case 2: the upper bound is correct compute the squareSideLength that will result in (x+1)*(y+1) tiles.
                    x_size = Math.floor(width / (x + 1));
                    y_size = Math.floor(height / (y + 1));

                    squareSideLength = Math.min(x_size, y_size);
                } else {
                    // Case 3: solve an equation to determine the final x and y dimensions and then compute
                    // the squareSideLength that results in those dimensions.
                    var test_x = Math.ceil(squaresCount / y);
                    var test_y = Math.ceil(squaresCount / x);
                    x_size = Math.min(Math.floor(width / test_x), Math.floor(height / y));
                    y_size = Math.min(Math.floor(width / x), Math.floor(height / test_y));

                    squareSideLength = Math.max(x_size, y_size);
                }
            }

            return squareSideLength;
        },

        computePieParams: function (pieNumber, squareSideLength, width, height, titleHeight, totalPiesNumber) {
            var paddingTop = 10;
            var globalPaddingTop = 5;

            var piesInRow = Math.min(Math.floor(width / squareSideLength), totalPiesNumber);
            var piesInColumn = Math.min(Math.floor(height / squareSideLength), totalPiesNumber);
            var widthGap = (width - squareSideLength * piesInRow) / piesInRow;
            var heightGap = (height - squareSideLength * piesInColumn) / piesInColumn;

            var xAxisPositionNumber = pieNumber % piesInRow === 0 ? piesInRow : pieNumber % piesInRow;
            var yAxisPositionNumber = Math.floor(pieNumber / piesInRow) + (pieNumber % piesInRow === 0 ? 0 : 1);

            var xAxisPosition = squareSideLength * xAxisPositionNumber - squareSideLength / 2 +
                widthGap * xAxisPositionNumber / 2;
            var yAxisPosition = squareSideLength * yAxisPositionNumber - squareSideLength / 2 +
                heightGap * yAxisPositionNumber / 2;

            var additionalSpaceCutFromPieSize = titleHeight + paddingTop;

            return {
                xAxisPositionPercent: 100 * (xAxisPosition - additionalSpaceCutFromPieSize / 2) / width,
                yAxisPositionPercent: 100 * (yAxisPosition + additionalSpaceCutFromPieSize / 2 + globalPaddingTop) / height,
                pieSizePercent: 100 * (squareSideLength - additionalSpaceCutFromPieSize) / (width < height ? width : height)
            };
        },

        //
        //  keep track of the min and max measure values that we charted
        //
        measureMinMax: function (currVal) {
            if (currVal === null) {
                return;
            }

            if (HDM.measureMin === null) {
                HDM.measureMin = currVal;
                HDM.measureMax = currVal;
            } else {
                HDM.measureMin = Math.min(currVal, HDM.measureMin);
                HDM.measureMax = Math.max(currVal, HDM.measureMax);
            }
        },

        /**
         * Post Processing of the generated yAxis.
         *
         * For line or spline charts, highcharts can default to showing a negative y-axis tick even when all the
         * charted measures are greater than zero. We get around this by setting the y-axis 'min' property
         * if there are no negative measures.
         *
         * @param result
         */
        yAxisTickAdjust: function (result) {
            if (HDM.measureMin < 0)   return;
            if (result.yAxis) {
                var yAxes = _.isArray(result.yAxis) ? result.yAxis : [result.yAxis];

                if (HDM.measureMin !== 0) {
                    // In case all measures have the same values chart's bars/lines may not be rendered.
                    // Because of that we should make minimal Y-axis value less then minimal data value.
                    HDM.measureMin--;
                }
                _.each(yAxes, function (yAxis) {
                    // do NOT overwrite any pre-existing 'min' value
                    if (!yAxis.min) {
                        yAxis.min = HDM.measureMin;
                        yAxis.startOnTick = true;
                    }
                });
            }
        },

        assembleFullGroupName: function (axisIndex, leafNode, groupLineBreaks, extraOptions) {
            var chartType = extraOptions.chartState.chartType;
            var label = '';
            var groupValueArray = adhocDataProcessor.getLabelNameArray(axisIndex, leafNode);
            var metadata = extraOptions.metadata;

            if (axisIndex == 1 && HDM.isScatterOrBubbleChart(chartType)) {
                // For Scatter and Bubble charts we should remove measure label.
                HDM._isMeasureFirst(metadata) ? groupValueArray.pop() : groupValueArray.shift();
            }

            // exclude single measure labels from array
            if (
                !extraOptions.chartState.showSingleMeasuresLabels &&
                metadata.measures.length === 1 &&
                metadata.measureAxis === axisIndex
            ) {
                groupValueArray = groupValueArray.reverse();

                var measureAxis = metadata.axes[metadata.measureAxis];
                for (var i = 0, l = measureAxis.length; i < l; i++) {
                    if (measureAxis[i].dimension === "Measures") {
                        i < groupValueArray.length ? groupValueArray.splice(i, 1) : groupValueArray.pop();
                    }
                }
                groupValueArray = groupValueArray.reverse();
                if (!groupValueArray.length) {
                    groupValueArray.push(" ");
                }
            }

            var lineBreaker = '<br>';
            if (HDM.isBarChart(chartType)) {
                groupValueArray = groupValueArray.reverse();
                lineBreaker = ", ";
            } else if (HDM.isScatterOrBubbleChart(chartType)) {
                lineBreaker = ", ";
            }
            var len = groupValueArray.length;

            for (var j = 0; j < len; j++) {
                label = label + groupValueArray[j];
                if (j < (len - 1)) {
                    if (groupLineBreaks) {
                        label = label + lineBreaker;
                    }
                    else {
                        label = label + ', ';
                    }
                }
            }

            //  grouped hierarchy labels are for x axis only
            if (axisIndex === 0 && len > 1) {
                HDM.groupedCategories = true;
                HDM.addLeaf2HighchartsCategory(groupValueArray);
            }

            return label;
        },

        assembleFullGroupHierarchyName: function (axisIndex, leafNode, extraOptions) {
            return HDM.assembleFullGroupName(axisIndex, leafNode, true, extraOptions);
        },

        assembleFullGroupLinearName: function (axisIndex, leafNode, extraOptions) {
            return HDM.assembleFullGroupName(axisIndex, leafNode, false, extraOptions);
        },

        addLeaf2HighchartsCategory: function (groupValueArray) {
            if (HDM.highchartsCategories == null) HDM.highchartsCategories = [];

            if (groupValueArray.length <= 1) {
                HDM.highchartsCategories.push(groupValueArray[0]);
                return;
            }
            var currCategory = HDM.highchartsCategories;

            for (var i = (groupValueArray.length - 1); i >= 0; i--) {
                var name = groupValueArray[i];
                if (i === 0) {
                    currCategory.push(name);
                    return;
                }
                var theCategory = null;

                for (var j = 0; j < currCategory.length; j++) {
                    if (currCategory[j].name === groupValueArray[i]) {
                        theCategory = currCategory[j];
                    }
                }
                if (theCategory == null) {
                    theCategory =
                    {
                        name: groupValueArray[i],
                        categories: []
                    };
                    currCategory.push(theCategory);
                }
                currCategory = theCategory.categories;
            }
        },

        getDataValue: function (rowLeaf, columnLeaf, returnNullValues) {
            var value = adhocDataProcessor.getDataFromRowColumn(rowLeaf, columnLeaf);

            if (typeof value !== 'object' && isNaN(value)) {
                value = null;
            }

            if (returnNullValues) {
                return value;
            } else {
                return value == null ? 0 : value;
            }
        }
    });

    /**
     * Private utility methods.
     */
    _.extend(HDM, {
        _isTooltipFollowPointerEnabled: function (chartType) {
            return !_.contains([
                "line",
                "spline",
                "area",
                "stacked_area",
                "percent_area",
                "spline_area",
                "line_time_series",
                "spline_time_series",
                "area_time_series",
                "spline_area_time_series",
                "pie",
                "semi_pie",
                "dual_level_pie",
                "heat_map",
                "heat_map_time_series",
                "dual_measure_tree_map",
                "tree_map",
                "one_parent_tree_map"
            ], chartType);
        },
        _isMeasureFirst: function (metadata) {
            var measureAxisArray = metadata.axes[metadata.measureAxis];

            return measureAxisArray.length > 0 && HDM._isMeasuresDimension(measureAxisArray[0].dimension);
        },
        _isMeasuresDimension: function (name) {
            return name === "Measures";
        }
    });

    /**
     * Public utility methods. Should be exported when converted to AMD.
     */
    _.extend(HDM, {
        isDualOrMultiAxisChart: function (chartType) {
            return HDM.isDualAxisChart(chartType) || HDM.isMultiAxisChart(chartType);
        },

        isDualLevelPieChart: function (chartType) {
            return chartType === "dual_level_pie";
        },

        isSpiderChart: function (chartType) {
            return _.contains([
                "spider_column",
                "spider_line",
                "spider_area"
            ], chartType);
        },

        isDualAxisChart: function (chartType) {
            return _.contains([
                "column_line",
                "column_spline",
                "stacked_column_line",
                "stacked_column_spline"
            ], chartType);
        },

        isMultiAxisChart: function (chartType) {
            return _.contains([
                "multi_axis_line",
                "multi_axis_spline",
                "multi_axis_column"
            ], chartType);
        },

        isScatterChart: function (chartType) {
            return _.contains([
                "scatter"
            ], chartType);
        },

        isBubbleChart: function (chartType) {
            return _.contains([
                "bubble"
            ], chartType);
        },

        isScatterOrBubbleChart: function (chartType) {
            return HDM.isScatterChart(chartType) || HDM.isBubbleChart(chartType);
        },

        isBarChart: function (chartType) {
            return chartType.indexOf("bar") != -1;
        },

        isHeatMapChart: function (chartType) {
            return chartType === "heat_map";
        },

        isHeatMapTimeSeriesChart: function (chartType) {
            return chartType === "heat_map_time_series";
        },

        isDualMeasureTreeMapChart: function (chartType) {
            return chartType === "dual_measure_tree_map";
        },

        isTreeMapChart: function (chartType) {
            return chartType === "tree_map";
        },

        isOneParentTreeMapChart: function (chartType) {
            return chartType === "one_parent_tree_map";
        }

        /*
         isSpeedometerChart: function(chartType) {
         return chartType === "speedometer";
         },

         isArcGaugeChart: function(chartType) {
         return chartType === "arc_gauge";
         }*/
    });

    /**
     * Type routing and highcharts options generation entry point.
     */
    _.extend(HDM, {
        /**
         * Generates highcharts options.
         *
         * @param type JRS chart type.
         * @param dataProcessorRow data processor row.
         * @param dataProcessorCol data processor column.
         * @param extraOptions extra options.
         * @returns {*}
         */
        getHighchartsOptions: function (type, dataProcessorRow, dataProcessorCol, extraOptions) {
            var highchartsOptions = HDM.typeToOptionsMap[type](dataProcessorRow, dataProcessorCol, extraOptions);

            HDM.setTurboThreshold(highchartsOptions);

            HDM.defaultPlotShadow(highchartsOptions,
                !HDM.isDualLevelPieChart(type) && !HDM.isHeatMapChart(type) && !HDM.isBubbleChart(type) && !HDM.isDualMeasureTreeMapChart(type) && !HDM.isTreeMapChart(type) && !HDM.isOneParentTreeMapChart(type));

            var truncateAndEscapeCategories = function (categories) {
                var categoryLength = HDM.isSpiderChart(type) || HDM.isBarChart(type) ? 150 : 150;

                if (categories.length > 0) {
                    if (_.isObject(categories[0])) {
                        _.each(categories, function (category) {
                            category.name = truncateAndEscapeCategory(category.name, categoryLength);

                            if (category.categories) {
                                truncateAndEscapeCategories(category.categories);
                            }
                        });
                    } else {
                        for (var i = 0; i < categories.length; i++) {
                            categories[i] = truncateAndEscapeCategory(categories[i], categoryLength);
                        }
                    }
                }
            };

            var truncateAndEscapeCategory = function (category, length) {
                if (category){
                    category = category.substring(0, length);
                    // Because of HC library's strange escaping we have to manually to escape that they
                    // are de-escaping. See function unescapeAngleBrackets() in highcharts.js
                    category = category.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                    // Because of HC library's line splitting (see function buildText() in highcharts.js)
                    // by "<br>" characters we have to de-escape only "&lt;br&gt;" into "<br>"
                    category = category.replace(/&lt;br&gt;/g, "<br>");
                } else {
                    category = "";
                }

                return category;
            };

            _.each(["xAxis", "yAxis"], function (axisName) {
                var axes = _.isArray(highchartsOptions[axisName]) ? highchartsOptions[axisName] :
                    [highchartsOptions[axisName]];

                _.each(axes, function (axis) {
                    if (!axis) {
                        return;
                    }

                    if (axis.categories) {
                        truncateAndEscapeCategories(axis.categories);
                    }

                    // because of HC library's strange escaping we have to manually escape that they
                    // are de-escaping. See function unescapeAngleBrackets() in HC
                    if (axis.title && axis.title.text) {
                        axis.title.text = axis.title.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    }
                });
            });

            // setup top padding for rotated labels #36936
            if (HDM.isSpiderChart(type)) {
                highchartsOptions.chart.spacingTop = (highchartsOptions.xAxis.categories[0].name.split("<br>").length - 1) * 1.8;
                highchartsOptions.chart.spacingTop *= 8 * (1 + Math.abs(Math.sin((highchartsOptions.xAxis.labels.rotation || 0 ) * Math.PI / 180)));
            }

            if (!HDM.isTreeMapChart(type)) {
                highchartsOptions.colors = HDM.colors;
            }

            // please, take a look inside this function to get some notes about what it does
            highchartsOptions = HDM.correctEmptySeriesNames(highchartsOptions);

            return highchartsOptions;
        },

        // set turboThreshold option
        setTurboThreshold: function (highchartsOptions) {

            if (!highchartsOptions.plotOptions) {
                return;
            }

            var maxSeriesLength = -Infinity;

            _.each(highchartsOptions.series, function (serie) {
                maxSeriesLength = Math.max(serie.data.length, maxSeriesLength);
            });

            if (maxSeriesLength > 1000) {
                (highchartsOptions.plotOptions.series || highchartsOptions.plotOptions.pie || highchartsOptions.plotOptions.treemap).turboThreshold = maxSeriesLength + 1;
            }
        },

        //setup default shadows for plotting
        defaultPlotShadow: function (highchartsOptions, shadowOptions) {

            var plotOptions = highchartsOptions.plotOptions,
                chartType = highchartsOptions.chart ? highchartsOptions.chart.type : undefined,
                chartTypes = !chartType ? [] : [chartType];

            if (chartTypes.length === 0) {
                chartTypes = _.pluck(highchartsOptions.series, "type");
            }

            if (!plotOptions) {
                plotOptions = {};
            }

            _.each(chartTypes, function (type) {
                if (!plotOptions[type]) {
                    plotOptions[type] = {};
                }
                plotOptions[type].shadow = shadowOptions;
            });

        },

        // Chart type routing.
        typeToOptionsMap: {
            column: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            stacked_column: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";

                return result;
            },

            percent_column: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "percent";

                return result;
            },

            bar: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            stacked_bar: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";

                return result;
            },

            percent_bar: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "percent";

                return result;
            },

            spider_column: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.pointPlacement = "on";

                return result;
            },

            line: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            area: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            spline_area: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            stacked_area: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";

                return result;
            },

            percent_area: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "percent";

                return result;
            },

            spider_line: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.pointPlacement = "on";

                return result;
            },

            spider_area: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.pointPlacement = "on";

                return result;
            },

            pie: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.PIE, rowIndex, columnIndex, extraOptions);
            },

            semi_pie: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.SEMI_PIE, rowIndex, columnIndex, extraOptions);
            },

            dual_level_pie: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.DUAL_LEVEL_PIE, rowIndex, columnIndex, extraOptions);
            },

            spline: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            // Time series types mappers.
            line_time_series: function (rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            spline_time_series: function (rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            area_time_series: function (rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            spline_area_time_series: function (rowIndex, columnIndex, extraOptions) {
                extraOptions.isTimeSeries = true;

                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            column_line: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            column_spline: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            stacked_column_line: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";
                HDM.yAxisTickAdjust(result);

                return result;
            },

            stacked_column_spline: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                result.plotOptions.series.stacking = "normal";
                HDM.yAxisTickAdjust(result);

                return result;
            },

            multi_axis_line: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            multi_axis_spline: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            multi_axis_column: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },

            scatter: function (rowIndex, columnIndex, extraOptions) {
                var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

                HDM.yAxisTickAdjust(result);

                return result;
            },

            bubble: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
            },
            /*
             scatter_line: function(rowIndex, columnIndex, extraOptions) {
             var result = HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);

             HDM.yAxisTickAdjust(result);

             return result;
             },
             */
            heat_map: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.HEAT_MAP, rowIndex, columnIndex, extraOptions);
            },

            heat_map_time_series: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.HEAT_MAP_TIME_SERIES, rowIndex, columnIndex, extraOptions);
            },
            /*
             speedometer: function(rowIndex, columnIndex, extraOptions) {
             return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
             },

             arc_gauge: function(rowIndex, columnIndex, extraOptions) {
             return HDM.getSeriesByType(HDM.SeriesType.COMMON, rowIndex, columnIndex, extraOptions);
             }
             */

            dual_measure_tree_map: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.DUAL_MEASURE_TREE_MAP, rowIndex, columnIndex, extraOptions);
            },
            tree_map: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.TREE_MAP, rowIndex, columnIndex, extraOptions);
            },
            one_parent_tree_map: function (rowIndex, columnIndex, extraOptions) {
                return HDM.getSeriesByType(HDM.SeriesType.ONE_PARENT_TREE_MAP, rowIndex, columnIndex, extraOptions);
            }

        },

        adHocToHighchartsChartTypeMap: adhocToHcTypeMap,

        getDualOrMultiAxisHighchartsType: function (chartType, isLastSeries) {
            var highchartsType;

            var dualAxisType = {
                column_line: 'column',
                column_spline: 'column',
                stacked_column_line: 'column',
                stacked_column_spline: 'column'
            };
            var dualAxisLastSeriesType = {
                column_line: 'line',
                column_spline: 'spline',
                stacked_column_line: 'line',
                stacked_column_spline: 'spline'
            };
            var multiAxisType = {
                multi_axis_line: 'line',
                multi_axis_spline: 'spline',
                multi_axis_column: 'column'
            };

            if (HDM.isDualAxisChart(chartType)) {
                highchartsType = isLastSeries ? dualAxisLastSeriesType[chartType] : dualAxisType[chartType];
            } else if (HDM.isMultiAxisChart(chartType)) {
                highchartsType = multiAxisType[chartType];
            } else {
                throw "Unsupported chart type [chartType=" + chartType + "]";
            }

            return highchartsType;
        },

        correctEmptySeriesNames: function (highchartsOptions) {

            // This is the fix for issue found in ticket
            // https://jira.tibco.com/browse/JS-33467
            // see comment about "Series 3" issue

            // So, basically, for some cases we get empty strings from server as a column names
            // and if we pass these empty column names to HC it would convert it to "Series X" format
            // We don't need it and that's why we convert it to one space.

            // Since the column names goes to Series configuration of HC we need to check each series
            // against empty .name key

            _.each(highchartsOptions.series, function (series) {
                if (series.name === "") {
                    series.name = " ";
                }
            });

            return highchartsOptions;
        }

    });

    return {
        getHighchartsOptions: HDM.getHighchartsOptions,

        // Utility methods.
        isDualOrMultiAxisChart: HDM.isDualOrMultiAxisChart,
        isDualAxisChart: HDM.isDualAxisChart,
        isMultiAxisChart: HDM.isMultiAxisChart,
        isScatterChart: HDM.isScatterChart,
        isBubbleChart: HDM.isBubbleChart,
        isScatterOrBubbleChart: HDM.isScatterOrBubbleChart,
        isBarChart: HDM.isBarChart,
        isSpiderChart: HDM.isSpiderChart,
        isDualLevelPieChart: HDM.isDualLevelPieChart,
        isHeatMapChart: HDM.isHeatMapChart,
        isHeatMapTimeSeriesChart: HDM.isHeatMapTimeSeriesChart,
        //isSpeedometerChart: HDM.isSpeedometerChart,
        //isArcGaugeChart: HDM.isArcGaugeChart,
        isDualMeasureTreeMapChart: HDM.isDualMeasureTreeMapChart,
        isTreeMapChart: HDM.isTreeMapChart,
        isOneParentTreeMapChart: HDM.isOneParentTreeMapChart,

        // Protected methods.
        _getLegendItemClickHandler: HDM._getLegendItemClickHandler,
        _getLegendItemClickHandlerDisabled: HDM._getLegendItemClickHandlerDisabled,

        // TODO refactoring
        _HDM: HDM
    };
}, this));

