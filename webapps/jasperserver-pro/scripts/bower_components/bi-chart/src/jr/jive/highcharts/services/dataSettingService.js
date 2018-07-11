/*
 * Copyright (C) 2005 - 2015 Jaspersoft Corporation. All rights reserved.
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
 * @version $Id: dataSettingService.js 3009 2015-02-24 15:30:13Z psavushchik $
 */

define(["jquery", "./defaultSettingService"], function($, DefaultSettingService) {

    var JRDataSettingService = {

        perform: function(highchartsOptions, data) {
            var service = this;

            // chart properties
            service.setProperties(highchartsOptions, data.properties);

            // axis categories
            data.xCategories && DefaultSettingService.setProperty(highchartsOptions, "xAxis.categories", data.xCategories);
            data.yCategories && DefaultSettingService.setProperty(highchartsOptions, "yAxis.categories", data.yCategories);

            // series
            highchartsOptions.series = [];
            $.each(data.series, function(i, dataSeries) {
                var series = {};
                service.copyObject(series, dataSeries, ["name", "_jrid"]);
                service.setProperties(series, dataSeries.properties);

                // data points
                series.data = [];
                $.each(dataSeries.data, function(i, dataPoint) {
                    var point = {};
                    service.copyObject(point, dataPoint, ["name", "x", "y", "z", "value", "id", "parent", "fullName", "colorValue"]);
                    service.setProperties(point, dataPoint.properties);

                    series.data.push(point);
                });

                highchartsOptions.series.push(series);
            });
        },

        copyObject: function(target, source, names) {
            $.each(names, function(i, name) {
                if (source[name] !== undefined) {
                    target[name] = source[name];
                }
            });
        },

        setProperties: function(obj, properties) {
            properties && $.each(properties, function(i, property) {
                DefaultSettingService.setProperty(obj, property.prop, property.val, property.isFunction);
            });
        }
    };

    return JRDataSettingService;
});