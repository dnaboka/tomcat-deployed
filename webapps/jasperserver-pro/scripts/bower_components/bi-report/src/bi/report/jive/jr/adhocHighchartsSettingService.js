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
 * @version $Id$
*/

define(["jquery", "adhoc/api/chart/adhocToHighchartsAdapter", "underscore"], function($, AdhocHighchartsAdapter, _) {

    function attachEvent(eventName, linkOptions, serie, serviceData) {
        if (linkOptions.events[eventName.toLowerCase()]) {
            serie.point.events[eventName] = function(event) {
                var point = this;

                linkOptions.events[eventName.toLowerCase()].call(
                    this,
                    AdhocHighchartsSettingService.getHyperlink(serie, point, serviceData.queryData.metadata.isOLAP),
                    event);
            }
        }
    }

    var AdhocHighchartsSettingService = {

        perform: function(highchartsOptions, serviceData, linkOptions) {

            var chartState = serviceData.chartState, extraOptions = serviceData.extraOptions;

            if (serviceData.chartType) {
                chartState.chartType = serviceData.chartType;
            }

            if (extraOptions) {
                var jrPage = $('table.jrPage');

                if (jrPage.length) {
                    extraOptions.width = jrPage.parent().width();
                    extraOptions.height = jrPage.parent().height() || 400;
                }
            }

            $.extend(highchartsOptions, AdhocHighchartsAdapter.generateOptions(serviceData.queryData, chartState, extraOptions));

            if (linkOptions && linkOptions.events && linkOptions.events) {
                if (highchartsOptions.series[0].chartType == "timeseries_heatmap") {
                    highchartsOptions.chart.events || (highchartsOptions.chart.events = {});

                    if (linkOptions.events.click) {
                        highchartsOptions.chart.events.click = function(event) {
                            var point = this.hoverPoint,
                                serie = point.series.options;

                            linkOptions.events.click.call(
                                this,
                                AdhocHighchartsSettingService.getHyperlink(serie, point, serviceData.queryData.metadata.isOLAP),
                                event);
                        }
                    }
                }

                _.forEach(highchartsOptions.series, function(serie) {
                    serie.cursor = 'pointer';
                    serie.point || (serie.point = {});
                    serie.point.events = {};

                    serie.chartType !== "timeseries_heatmap" && attachEvent.call(this, "click", linkOptions, serie, serviceData);
                    attachEvent.call(this, "mouseOver", linkOptions, serie, serviceData);
                    attachEvent.call(this, "mouseOut", linkOptions, serie, serviceData);
                });
            }
        },

        getOutputParams: function(serie, point) {
            var outputParameters = [];

            // Adding columns parameters.
            if (serie.columnsOutputParams) {
                outputParameters = outputParameters.concat(serie.columnsOutputParams);
            }

            // Adding rows parameters.
            if (point.rowsOutputParams) {
                outputParameters = outputParameters.concat(point.rowsOutputParams);
            }

            // For regular Heatmap only.
            if (serie.chartType == "heatmap" && serie.heatmapXCategories) {
                outputParameters[0].value = serie.heatmapXCategories[point.x];
            }

            return outputParameters;
        },

        getHyperlink: function(serie, point, isOlap) {
            return {
                type: "AdHocExecution",
                parameters: _.reduce(AdhocHighchartsSettingService.getOutputParams(serie, point), function (memo, obj) {
                    if (isOlap && obj.name.dimension !== "Measures") {
                        memo["[" + obj.name.dimension + "]" + obj.name.name] = obj.value;
                    } else {
                        if (obj.name.name === "Measures" || obj.name.name === "MeasuresLevel") {
                            memo[obj.name.name] = _.isArray(obj.value) ? obj.value : [obj.value];
                        } else {
                            memo[obj.name.name] = obj.value;
                        }
                    }

                    return memo;
                }, {})
            }
        }
    };

    return AdhocHighchartsSettingService;
});
