/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var DashletModel = require("./DashletModel"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        DashletHyperlinkComponentExtension = require("./extension/DashletHyperlinkComponentExtension"),
        dashboardSettings = require("dashboard/dashboardSettings"),
        scaleStrategies = require("bi/report/enum/scaleStrategies"),
        _ = require("underscore");

    function doAcceptWiringVisitor(wiring){
        var params = this.get("parameters"),
            slots = {},
            model = this;

        if (params && params.length){
            _.each([dashboardWiringStandardIds.REFRESH_SLOT,
                dashboardWiringStandardIds.APPLY_SLOT].concat(_.pluck(params, "id")), function(parameter){

                slots[parameter] = function(name){
                    return function(value, sender){
                        (model.lastPayload || (model.lastPayload = {}))[name] =  value;
                        (model.lastSender || (model.lastSender = {}))[name] = sender;
                        model.trigger("signal", {name:name, value: value}, sender);
                    }
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
        "componentName": i18n["dashboard.component.text.view.component.name"],

        defaults: _.extend({}, DashletHyperlinkComponentExtension.defaults, DashletModel.prototype.defaults, {
            "type": dashboardComponentTypes.FREE_TEXT,
            "alignment": dashboardSettings.DASHLET_TEXT_ALIGNMENT,
            "verticalAlignment": dashboardSettings.DASHLET_TEXT_VERTICAL_ALIGNMENT,
            "bold": dashboardSettings.DASHLET_TEXT_BOLD,
            "text": undefined,
            "italic": dashboardSettings.DASHLET_TEXT_ITALIC,
            "underline": dashboardSettings.DASHLET_TEXT_UNDERLINE,
            "font": dashboardSettings.DASHLET_TEXT_FONT,
            "size": dashboardSettings.DASHLET_TEXT_SIZE,
            "color": dashboardSettings.DASHLET_TEXT_COLOR,
            "backgroundColor": dashboardSettings.DASHLET_TEXT_BACKGROUND_COLOR,
            "scaleToFit": dashboardSettings.DASHLET_TEXT_SCALE_TO_FIT,
            showDashletBorders: dashboardSettings.DASHLET_BORDER,
            borderColor: dashboardSettings.DASHLET_BORDER_COLOR,
            maximized: null,
            toolbar: null
        }),

        validation: _.extend({}, DashletHyperlinkComponentExtension.validation,  DashletModel.prototype.validation, {
            maximized: function (maximized) {
                if (maximized !== null) {
                    return i18n["dashboard.component.error.property.unsupported"].replace("{0}", "maximized");
                }
            },
            toolbar: function (toolbar) {
                if (toolbar !== null) {
                    return i18n["dashboard.component.error.property.unsupported"].replace("{0}", "toolbar");
                }
            },
            alignment: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.alignment.required")
                },
                {
                    oneOf: ["left", "center", "right"],
                    msg: new i18nMessage("dashboard.component.error.alignment.oneOf",
                        i18n["dashboard.component.dialog.properties.alignment.left"], i18n["dashboard.component.dialog.properties.alignment.center"],
                        i18n["dashboard.component.dialog.properties.alignment.right"])
                }
            ],

            font: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.font.required")
                },
                {
                    doesNotContainSymbols: "~!#\\$%^|`@&*()\\+={}\\[\\];\"\"\\<\\>,?\\|\\\\",
                    msg: new i18nMessage("dashboard.component.error.font.forbidden.chars")
                }
            ],

            size: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.font.size.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.component.error.font.size.integer")
                },
                {
                    min: dashboardSettings.DASHLET_MIN_FONT_SIZE,
                    msg: new i18nMessage("dashboard.component.error.font.size.min", dashboardSettings.DASHLET_MIN_FONT_SIZE)
                }
            ],

            scaleToFit: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.scale.to.fit.required")
                },
                {
                    oneOf: [1, scaleStrategies.HEIGHT, scaleStrategies.WIDTH, scaleStrategies.CONTAINER],
                    msg: new i18nMessage("dashboard.component.error.scale.to.fit.oneOf",
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