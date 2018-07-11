/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $
 */

define(function (require) {
    "use strict";

    var DashletModel = require("./DashletModel"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        dashboardSettings = require("dashboard/dashboardSettings"),
        Backbone = require("backbone"),
        $ = require("jquery"),
        _ = require("underscore");

    return DashletModel.extend({
        componentName: i18n['dashboard.component.web.page.component.name'],

        defaults: _.extend({}, DashletModel.prototype.defaults, {
            type: dashboardComponentTypes.WEB_PAGE_VIEW,

            timeout: undefined,
            url: dashboardSettings.DASHLET_WEBPAGE_VIEW_DEFAULT_URL,

            autoRefresh: dashboardSettings.DASHLET_AUTO_REFRESH,
            refreshInterval: dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES,
            refreshIntervalUnit: dashboardSettings.DASHBOARD_REFRESH_INTERVAL_UNIT,

            scroll: dashboardSettings.DASHLET_SCROLL,
            showTitleBar: dashboardSettings.DASHLET_SHOW_TITLE_BAR,
            showRefreshButton: dashboardSettings.DASHLET_SHOW_REFRESH_BUTTON,
            showMaximizeButton: dashboardSettings.DASHLET_SHOW_MAXIMIZE_BUTTON
        }),

        validation: _.extend({}, DashletModel.prototype.validation, {
            url: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.url.required")
                }
            ],
            refreshInterval: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.web.page.view.refreshInterval.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.web.page.view.refreshInterval.integer")
                },
                {
                    fn: function(value, attr, computedState) {
                        var currentUnits = computedState["refreshIntervalUnit"];
                        var units = {"second": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS,
                            "minute": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES};
                        if (value < units[currentUnits]) {
                            return "Value must be bigger than " + units[currentUnits];
                        }
                    },
                    msg: new i18nMessage("dashboard.error.web.page.view.refreshInterval.min", dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES,
                        dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS)
                }
            ],
            refreshIntervalUnit: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.web.page.view.refreshIntervalUnit.required")
                },
                {
                    oneOf: ["second", "minute"],
                    msg: new i18nMessage("dashboard.error.web.page.view.refreshIntervalUnit.oneOf",
                        i18n["dashboard.dialog.properties.refresh.interval.second"], i18n["dashboard.dialog.properties.refresh.interval.minute"])
                }
            ]
        }),

        initialize: function() {
            DashletModel.prototype.initialize.apply(this, arguments);

            this.on("change:autoRefresh", function() {
                if (!this.get("autoRefresh") && !this.isValid(["refreshInterval", "refreshIntervalUnit"])) {
                    this.set({
                        refreshInterval: this.defaults.refreshInterval,
                        refreshIntervalUnit: this.defaults.refreshIntervalUnit
                    });
                }
            }, this);
        },

        acceptWiringVisitor: function(wiring){
            this.on("parameters:set", _.bind(doAcceptWiringVisitor, this, wiring));

            doAcceptWiringVisitor.call(this, wiring);
        }
    });

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
            signals:[],
            slots: slots
        });
    }
});

