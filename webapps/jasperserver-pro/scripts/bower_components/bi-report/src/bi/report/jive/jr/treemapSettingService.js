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
 * @version $Id$
 */

define(["highcharts-treemap"], function(Highcharts) {

    var JRTreemapSettingService = {
        perform: function(highchartsOptions, serviceData) {
            this.setupTreemap(highchartsOptions);
        },

        setupTreemap: function(options) {
            if (options.series.length < 1) {
                return;
            }

            this.set(options, "tooltip", {});
            this.set(options.tooltip, "valueDecimals", 2);

            this.set(options, "plotOptions", {});
            this.set(options.plotOptions, "treemap", {});
            this.set(options.plotOptions.treemap, "borderWidth", 1);
            this.set(options.plotOptions.treemap, "layoutAlgorithm", "squarified");
            this.set(options.plotOptions.treemap, "allowDrillToNode", true);
            this.set(options.plotOptions.treemap, "levelIsConstant", false);
            this.set(options.plotOptions.treemap, "dataLabels", {});
            this.set(options.plotOptions.treemap.dataLabels, "enabled", false);

            //TODO check if already present?
            options.plotOptions.treemap.levels = [{level: 1,
                dataLabels: {enabled: true},
                borderWidth: 3}];

            var defaultColors = Highcharts.getOptions().colors;
            if (options.colorAxis) {
                this.set(options.colorAxis, "minColor", "#FFFFFF");
                this.set(options.colorAxis, "maxColor", defaultColors[0]);

                this.set(options.tooltip, "pointFormat",
                    "{point.fullName}<br/>{series.name}: <b>{point.value}</b><br/>"
                    + "{series.options.colorMeasureName}: <b>{point.colorValue}</b>");
            } else {
                this.set(options.tooltip, "pointFormat",
                    "{point.fullName}<br/>{series.name}: <b>{point.value}</b>");

                var series = options.series[0];
                var defaultColorsIdx = 0;
                for (var i = 0; i < series.data.length; ++i) {
                    if (!series.data[i].parent) {
                        var seriesItemColor = series.data[i].color;
                        if (!seriesItemColor) {
                            seriesItemColor = defaultColors[defaultColorsIdx];
                            defaultColorsIdx = (defaultColorsIdx + 1) % defaultColors.length;
                            series.data[i].color = seriesItemColor;
                        }
                    }
                }
            }
        },

        set: function(object, property, value) {
            if (!(property in object)) {
                object[property] = value;
            }
        }
    };

    return JRTreemapSettingService;
});