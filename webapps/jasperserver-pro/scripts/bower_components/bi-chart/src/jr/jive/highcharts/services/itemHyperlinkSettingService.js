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
 * @version $Id: itemHyperlinkSettingService.js 3728 2016-06-15 12:34:32Z inestere $
 */

define(["jquery", "underscore"], function($, _) {

    var JRItemHyperlinkHighchartsSettingService = function (chartInstance, chartOptions, serviceData) {
        this.chartInstance = chartInstance;
        this.chartOptions = chartOptions;
        this.serviceData = serviceData;

    };

    JRItemHyperlinkHighchartsSettingService.prototype = {
        perform: function() {
            var it = this;
            if (it.serviceData.seriesId) {
                this.configureHyperlinks(it.serviceData.seriesId);
            } else if (it.serviceData.chartHyperlink) {
                this.configureChartHyperlink(it.serviceData.chartHyperlink);
            }
        },

        configureHyperlinks: function(seriesId) {
            var it = this,
                series = null,
                linkOptions = this.serviceData && this.serviceData.linkOptions ?  this.serviceData.linkOptions : {};

            for (var idx = 0; idx < it.chartOptions.series.length; ++idx) {
                if (it.chartOptions.series[idx]._jrid == seriesId) {
                    series = it.chartOptions.series[idx];
                    break;
                }
            }

            if (!series) {
                return;
            }

            series.cursor = 'pointer';
            series.point = series.point || {};
            series.point.events = createEvents(series.point.events, wrapHyperlinkEvents(linkOptions.events, it.serviceData.hyperlinkProperty));
        },

        configureChartHyperlink: function(hyperlink) {
            var it = this,
                options = it.chartOptions,
                linkOptions = this.serviceData && this.serviceData.linkOptions ?  this.serviceData.linkOptions : {};

            options.chart = options.chart || {};
            options.chart.style = options.chart.style || {};
            options.chart.style.cursor = 'pointer';

            options.chart.events = createEvents(options.chart.events, wrapChartEvents(linkOptions.events, hyperlink.id));
        }
    };

    return JRItemHyperlinkHighchartsSettingService;

    function createEvents(pointEvents, linkEvents, id){
        pointEvents || (pointEvents = {});
        linkEvents || (linkEvents = {});

        var events = {
            click: mergeHandlers(linkEvents.click, pointEvents.click),
            mouseOut: mergeHandlers(linkEvents.mouseout || linkEvents.mouseOut, pointEvents.mouseOut),
            mouseOver: mergeHandlers(linkEvents.mouseover || linkEvents.mouseOver, pointEvents.mouseOver)
        };

        _.each(events, function(event, eventName){
            if (_.isUndefined(events[eventName])) {
                delete events[eventName];
            }
        });

        return events;
    }

    function wrapChartEvents(linkEvents, id){
        linkEvents || (linkEvents = {});

        return {
            click: wrapHandler(linkEvents.click, id),
            mouseOut: wrapHandler(linkEvents.mouseout || linkEvents.mouseOut, id),
            mouseOver: wrapHandler( linkEvents.mouseover || linkEvents.mouseOver, id)
        }
    }

    function wrapHandler(handler, id) {
        if (handler){
            return function(event) {
                handler.call(this, id, event);
            }
        }
    }

    function wrapHyperlinkEvents(linkEvents, hyperlinkProperty){
        linkEvents || (linkEvents = {});

        return {
            click: wrapHyperlinkHandler(linkEvents.click, hyperlinkProperty),
            mouseOut: wrapHyperlinkHandler(linkEvents.mouseout || linkEvents.mouseOut, hyperlinkProperty),
            mouseOver: wrapHyperlinkHandler(linkEvents.mouseover || linkEvents.mouseOver, hyperlinkProperty)
        }
    }

    function wrapHyperlinkHandler(handler, hyperlinkProperty) {
        if (handler) {
            return function(event) {
                handler.call(this, this.options[hyperlinkProperty].id, event);
            }
        }
    }

    function mergeHandlers(h1, h2){
        if (h1 && !h2){
            return h1;
        }

        if (!h1 && h2){
            return h2;
        }

        if (h1 && h2){
            return function(){
                h1.apply(this, arguments);
                h2.apply(this, arguments);
            }
        }
    }
});
