/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor Nesterenko
 * @version: $Id$
 */

/**
 * This adapter makes adoption of Ad Hoc data, metadata and chart state to Highcharts options.
 */

//TODO: remove non-Amd wrapper after providing AMD support on server-side (chart export)
(function (factory, globalScope) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define([
            "underscore",
            "jquery",
            "json3",
            "bundle!all",
            "adhoc/api/chart/adhocToHighchartsAdapter/Highcharts",
            "adhoc/api/chart/adhocToHighchartsAdapter/highchartsDataMapper",
            "adhoc/api/chart/adhocToHighchartsAdapter/adhocDataProcessor"
        ], factory);
    } else {
        // Browser globals.
        globalScope.AdhocHighchartsAdapter = factory(globalScope._, globalScope.jQuery, globalScope.JSON, {}, globalScope.Highcharts, globalScope.highchartsDataMapper, globalScope.AdhocDataProcessor);
    }
}(function (_, jQuery, JSON, i18n, Highcharts, dataMapper, dataProcessor) {
    "use strict";

    //TODO: remove while moving to full AMD env

    var AdhocHighchartsAdapter = {
        /**
         * Generates Highcharts options based on query data and chart state. This method does not do rendering. It just
         * prepare the options for rendering.
         *
         * @param queryData the query data object.
         * @param chartState the chart state.
         * @param extraOptions the extra options.
         * @return {Object} the options object to be passed to Highcharts.Chart constructor.
         */
        generateOptions: function (queryData, chartState, extraOptions) {
            // optimize plain objects cloning speed
            chartState = JSON.parse(JSON.stringify(chartState));
            queryData = JSON.parse(JSON.stringify(queryData));

            dataProcessor.load(queryData);
            dataProcessor.messages = extraOptions.messages;

            // in the next block we have a non-standard structure: i18n with hard-coded language
            // It's done because of chart exporting tool, which uses this file and it doesn't have access to i18n
            // So by this we can be sure no label will be defected

            var i18nMonths = [
                i18n["months.label.january"] || "January",
                i18n["months.label.february"] || "February",
                i18n["months.label.march"] || "March",
                i18n["months.label.april"] || "April",
                i18n["months.label.may"] || "May",
                i18n["months.label.june"] || "June",
                i18n["months.label.july"] || "July",
                i18n["months.label.august"] || "August",
                i18n["months.label.september"] || "September",
                i18n["months.label.october"] || "October",
                i18n["months.label.november"] || "November",
                i18n["months.label.december"] || "December"
            ];

            var i18nWeekdays = [
                i18n["week.days.label.sunday"] || "Sunday",
                i18n["week.days.label.monday"] || "Monday",
                i18n["week.days.label.tuesday"] || "Tuesday",
                i18n["week.days.label.wednesday"] || "Wednesday",
                i18n["week.days.label.thursday"] || "Thursday",
                i18n["week.days.label.friday"] || "Friday",
                i18n["week.days.label.saturday"] || "Saturday"
            ];

            Highcharts.setOptions({
                lang: {
                    contextButtonTitle: i18n["highcharts.contextButtonTitle"] || "Chart context menu",
                    decimalPoint: ".",
                    downloadJPEG: i18n["highcharts.downloadJPEG"] || "Download JPEG image",
                    downloadPDF: i18n["highcharts.downloadPDF"] || "Download PDF document",
                    downloadPNG: i18n["highcharts.downloadPNG"] || "Download PNG image",
                    downloadSVG: i18n["highcharts.downloadSVG"] || "Download SVG vector image",
                    drillUpButton: i18n["highcharts.drillUpButton"] || "Back",
                    drillUpText: (i18n["highcharts.drillUpText"] || "Back to") + " {series.name}",
                    invalidDate: i18n["highcharts.invalidDate"] || "",
                    loading: (i18n["highcharts.loading"] || "Loading") + "...",
                    months: i18nMonths,
                    noData: i18n["highcharts.noData"] || "No data to display",
                    printChart: i18n["highcharts.printChart"] || "Print chart",
                    resetZoom: i18n["highcharts.resetZoom"] || "Reset zoom",
                    resetZoomTitle: i18n["highcharts.resetZoomTitle"] || "Reset zoom level 1:1",
                    shortMonths: chartState.shortMonths,
                    thousandsSep: ",",
                    weekdays: i18nWeekdays
                }
            });

            var dataProcessorRow = dataProcessor.levelsToLevelNumbers(chartState.rowsSelectedLevels, 0);
            var dataProcessorCol = dataProcessor.levelsToLevelNumbers(chartState.columnsSelectedLevels, 1);

            extraOptions.chartState = chartState;
            extraOptions.metadata = queryData.metadata;

            var highchartsOptions = dataMapper.getHighchartsOptions(chartState.chartType, dataProcessorRow, dataProcessorCol,
                extraOptions);

            if (chartState.advancedProperties.length) {
                this._applyAdvancedProperties(highchartsOptions, chartState.advancedProperties);
            }

            return highchartsOptions;
        },

        _applyAdvancedProperties: function (highchartsOptions, advancedProperties) {
            _.each(advancedProperties, function (property) {
                this._setAdvancedProperty(highchartsOptions, property);
            }, this);

            // While issue https://github.com/highcharts/highcharts/issues/6020 remains open
            // we have to fix the HC config.
            // See details here: http://jira.jaspersoft.com/browse/JRS-11572
            // Remark: be sure to have in our code changes which fix highcharts/issues/6020
            // *before* removing this "if block"
            if (highchartsOptions.chart && highchartsOptions.chart.type === "waterfall") {
                if (highchartsOptions.plotOptions) {
                    if (highchartsOptions.plotOptions.series) {
                        delete highchartsOptions.plotOptions.series.stacking;
                    }
                }
            }

            return highchartsOptions;
        },

        _setAdvancedProperty: function (options, property) {
            var partials = property.name.split('.'),
                tmp = {},
                last = partials.length - 1,
                result = tmp;

            _.each(partials, function (part, index) {
                if (index == last) {
                    tmp[part] = this._parseAdvancedPropertyValue(property.value);
                } else {
                    tmp[part] = {};
                    tmp = tmp[part];
                }

            }, this);

            //if base property is array then apply advanced property to each item
            if (options[partials[0]] && options[partials[0]].length) {
                _(options[partials[0]]).each(function (item) {
                    jQuery.extend(true, item, result[partials[0]]);
                });
            } else {
                jQuery.extend(true, options, result);
            }
        },

        _parseAdvancedPropertyValue: function (value) {
            var result;

            try {
                result = JSON.parse(value);
            } catch (e) {
                result = value;
            }

            return result;
        }
    };

    return AdhocHighchartsAdapter;

}, this));

