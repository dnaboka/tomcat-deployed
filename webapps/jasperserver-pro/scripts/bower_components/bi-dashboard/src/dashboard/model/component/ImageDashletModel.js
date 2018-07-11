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
 *
 *
 * @author: Grant Bacon
 * @version: $Id: $
 */

define(function (require) {
    "use strict";

    var DashletModel = require("./DashletModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        scaleStrategies = require("bi/report/enum/scaleStrategies"),
        i18n = require("bundle!DashboardBundle"),
        i18Message = require("common/util/i18nMessage").extend({
            bundle: i18n
        }),
        DashletHyperlinkComponentExtension = require("./extension/DashletHyperlinkComponentExtension"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        _ = require("underscore");


    function doAcceptWiringVisitor(wiring){
        var params = this.get("parameters"),
            slots = {},
            model = this;

        if (params && params.length){
            _.each([dashboardWiringStandardIds.REFRESH_SLOT,
                dashboardWiringStandardIds.APPLY_SLOT].concat(_.pluck(params, "id")), function(parameter){

                slots[parameter] = function(name){
                    return function(value, sender) {
                        (model.lastPayload || (model.lastPayload = {}))[name] =  value;
                        (model.lastSender || (model.lastSender = {}))[name] = sender;
                        model.trigger("signal", {name:name, value: value}, sender);
                    };
                }(parameter);
            });
        }

        wiring.register(this, {
            signals: this.has("outputParameters") ? _.pluck( this.get("outputParameters"), "id") : [],
            slots: slots
        });
    }

    return DashletModel
        .extend(DashletHyperlinkComponentExtension.mixin)
        .extend({
        componentName: i18n["dashboard.component.image.component.name"],

        defaults: _.extend({}, DashletHyperlinkComponentExtension.defaults, DashletModel.prototype.defaults, {
            type: dashboardComponentTypes.IMAGE,

            url: "",

            scaleToFit: dashboardSettings.DASHLET_SCALE_TO_FIT,

            showTitleBar: dashboardSettings.DASHLET_IMAGE_SHOW_TITLE,
            showRefreshButton: dashboardSettings.DASHLET_IMAGE_SHOW_REFRESH,
            showMaximizeButton: dashboardSettings.DASHLET_IMAGE_SHOW_MAXIMIZE,
            showDashletBorders: dashboardSettings.DASHLET_BORDER,
            borderColor: dashboardSettings.DASHLET_BORDER_COLOR
        }),

        validation: _.extend({}, DashletHyperlinkComponentExtension.validation, DashletModel.prototype.validation, {
            url: [
                {
                    required: true,
                    msg: new i18Message("dashboard.component.error.url.required")
                }
            ],

            scaleToFit: [
                {
                    required: true,
                    msg: new i18Message("dashboard.component.error.scale.to.fit.required")
                },
                {
                    oneOf: [1, scaleStrategies.HEIGHT, scaleStrategies.WIDTH, scaleStrategies.CONTAINER],
                    msg: new i18Message("dashboard.component.error.scale.to.fit.oneOf",
                        i18n["dashboard.component.dialog.properties.scale.to.fit.no"], i18n["dashboard.component.dialog.properties.scale.to.fit.width"],
                        i18n["dashboard.component.dialog.properties.scale.to.fit.height"], i18n["dashboard.component.dialog.properties.scale.to.fit.page"])
                }
            ]
        }),

        acceptWiringVisitor: function(wiring) {
            this.on("parameters:set", _.bind(doAcceptWiringVisitor, this, wiring));

            doAcceptWiringVisitor.call(this, wiring);
        }
    });

});
