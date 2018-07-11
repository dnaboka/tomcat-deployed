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

    var $ = require("jquery"),
        DashboardComponentModel = require("./DashboardComponentModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        dashboardWiringStandardIds = require("dashboard/enum/dashboardWiringStandardIds"),
        dashboardSettings = require("dashboard/dashboardSettings");

    return DashboardComponentModel.extend({
        defaults: {
            "id": dashboardSettings.DASHBOARD_PROPERTIES_COMPONENT_ID,
            "type": dashboardComponentTypes.DASHBOARD_PROPERTIES,
            "name": dashboardSettings.DASHBOARD_PROPERTIES_COMPONENT_ID,
            "autoRefresh": dashboardSettings.DASHBOARD_AUTO_REFRESH,
            "refreshInterval": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES,
            "refreshIntervalUnit": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_UNIT,
            "showDashletBorders": dashboardSettings.DASHLET_BORDER,
            "showExportButton": dashboardSettings.DASHBOARD_SHOW_EXPORT_BUTTON,
            "dashletMargin": dashboardSettings.DASHLET_MARGIN,
            "dashletPadding": dashboardSettings.DASHLET_PADDING,
            "dashletFilterShowPopup": dashboardSettings.DASHLET_FILTER_SHOW_POPUP,
            "useFixedSize": dashboardSettings.USE_FIXED_SIZE,
            "fixedWidth": dashboardSettings.DEFAULT_FIXED_WIDTH,
            "fixedHeight": dashboardSettings.DEFAULT_FIXED_HEIGHT,
            "canvasColor": dashboardSettings.DASHBOARD_CANVAS_COLOR,
            "titleBarColor": dashboardSettings.DASHBOARD_TITLE_BAR_COLOR,
            "titleTextColor": dashboardSettings.DASHBOARD_TITLE_TEXT_COLOR
        },

        validation: {
            refreshInterval: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.refreshInterval.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.refreshInterval.integer")
                },
                {
                    fn: function(value, attr, computedState){
                        var currentUnits = computedState["refreshIntervalUnit"];
                        var units = {"second": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_SECONDS,
                                     "minute": dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_MINUTES};
                        if(value < units[currentUnits]){
                            return "Value must be bigger than " + units[currentUnits];
                        }
                    },
                    msg: new i18nMessage("dashboard.error.refreshInterval.min", dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_MINUTES,
                                                                                    dashboardSettings.DASHBOARD_REFRESH_INTERVAL_TIME_UNIT_SECONDS)
                }
            ],

            refreshIntervalUnit: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.refreshIntervalUnit.required")
                },
                {
                    oneOf: ["second", "minute"],
                    msg: new i18nMessage("dashboard.error.refreshIntervalUnit.oneOf")
                }
            ],

            dashletMargin: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.dashletMargin.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.dashletMargin.integer")
                },
                {
                    range: [dashboardSettings.DASHLET_MIN_MARGIN, dashboardSettings.DASHLET_MAX_MARGIN],
                    msg: new i18nMessage("dashboard.error.dashletMargin.range", dashboardSettings.DASHLET_MIN_MARGIN, dashboardSettings.DASHLET_MAX_MARGIN)
                }
            ],

            dashletPadding: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.dashletMargin.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.dashletPadding.integer")
                },
                {
                    range: [dashboardSettings.DASHLET_MIN_PADDING, dashboardSettings.DASHLET_MAX_PADDING],
                    msg: new i18nMessage("dashboard.error.dashletPadding.range", dashboardSettings.DASHLET_MIN_PADDING, dashboardSettings.DASHLET_MAX_PADDING)
                }
            ],

            fixedWidth: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.dashboard.width.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.dashboard.width.integer")
                },
                {
                    range: [dashboardSettings.DASHBOARD_MIN_WIDTH, dashboardSettings.DASHBOARD_MAX_WIDTH],
                    msg: new i18nMessage("dashboard.error.dashboard.width.range", dashboardSettings.DASHBOARD_MIN_WIDTH, dashboardSettings.DASHBOARD_MAX_WIDTH)
                }
            ],

            fixedHeight: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.dashboard.height.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.dashboard.height.integer")
                },
                {
                    range: [dashboardSettings.DASHBOARD_MIN_HEIGHT, dashboardSettings.DASHBOARD_MAX_HEIGHT],
                    msg: new i18nMessage("dashboard.error.dashboard.height.range", dashboardSettings.DASHBOARD_MIN_HEIGHT, dashboardSettings.DASHBOARD_MAX_HEIGHT)
                }
            ]
        },

        initialize: function() {
            DashboardComponentModel.prototype.initialize.apply(this, arguments);

            this.on("change:autoRefresh", function() {
                if (!this.get("autoRefresh") && !this.isValid(["refreshInterval", "refreshIntervalUnit"])) {
                    this.set({
                        refreshInterval: this.defaults.refreshInterval,
                        refreshIntervalUnit: this.defaults.refreshIntervalUnit
                    });
                }
            }, this);
        },

        isVisible: function(){
            return false;
        },

        applyParameters: function(skipPushParams) {
            skipPushParams || this.collection.pushParametersState();
            this.trigger(dashboardWiringStandardIds.APPLY_SIGNAL, {});
        },

        acceptWiringVisitor: function (visitor) {
            visitor.register(this, {
                signals: [ dashboardWiringStandardIds.INIT_SIGNAL, dashboardWiringStandardIds.APPLY_SIGNAL ],
                slots: {}
            });
        }
    });
});
