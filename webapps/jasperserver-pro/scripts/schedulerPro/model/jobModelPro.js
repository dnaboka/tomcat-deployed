/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
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
 * @version: $Id: jobModel.js 9551 2015-10-13 14:09:03Z dgorbenk $
 */

define(function (require) {

    var jQuery = require('jquery'),
        jobModel = require('scheduler/model/jobModel'),
        dashboardSettings = require("dashboard/dashboardSettings"),
        resourceType = require('schedulerPro/enum/scheduledResourceTypeEnum');

    return jobModel.extend({

        loadParameters: function(){
            if (this.resourceType == resourceType.DASHBOARD){
                this.update('source', {parameters: {parameterValues: {}}});
            } else {
                jobModel.prototype.loadParameters.apply(this, arguments);
            }
        },

        validate: function (model, options) {
            var results = jobModel.prototype.validate.apply(this, arguments);

            if (this.resourceType == resourceType.DASHBOARD){
                var width = model.source.referenceWidth,
                    height = model.source.referenceHeight,
                    errorCode, errorArguments;

                if (!width) {
                    errorCode = "dashboard.error.dashboard.width.required";
                } else if (!height) {
                    errorCode = "dashboard.error.dashboard.height.required";
                } else if (!jQuery.isNumeric(width)) {
                    errorCode = "dashboard.error.dashboard.width.integer";
                } else if (!jQuery.isNumeric(height)) {
                    errorCode = "dashboard.error.dashboard.height.integer";
                } else if (width < dashboardSettings.DASHBOARD_MIN_WIDTH || width > dashboardSettings.DASHBOARD_MAX_WIDTH) {
                    errorCode = "dashboard.error.dashboard.width.range";
                    errorArguments = [dashboardSettings.DASHBOARD_MIN_WIDTH, dashboardSettings.DASHBOARD_MAX_WIDTH];
                } else if (height < dashboardSettings.DASHBOARD_MIN_HEIGHT || height > dashboardSettings.DASHBOARD_MAX_HEIGHT) {
                    errorCode = "dashboard.error.dashboard.height.range";
                    errorArguments = [dashboardSettings.DASHBOARD_MIN_HEIGHT, dashboardSettings.DASHBOARD_MAX_HEIGHT];
                }

                if (errorCode) {
                    results.push({field: "outputSize", errorCode: errorCode, errorArguments: errorArguments});
                }
            }

            if (results.length)
                this.trigger('invalid', results);
            else
                this.trigger('valid', []);

            return results;
        }
    });
});
