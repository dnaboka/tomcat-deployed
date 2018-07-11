/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var $ = require("jquery"),
        _ = require("underscore"),
        request = require("request"),
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        dashletTechnicalOutputs = require("../../enum/dashletTechnicalOutputs"),
        DashletModel = require("./DashletModel"),
        ParametersCache = require("../../collection/ReportsParametersCollection").instance,
        dashboardSettings = require("dashboard/dashboardSettings"),
        scaleStrategies = require("bi/report/enum/scaleStrategies"),

        technical = _.values(dashletTechnicalOutputs);

    function convertICDataToWiringInfo(model){
        var parameters = model.get("parameters"),
            outputParameters = model.get("outputParameters"),
            res = {
            signals: _.pluck(outputParameters, "id"),
            slots: {}
        };

        _.each(parameters.concat([
            {id:dashboardWiringStandardIds.APPLY_SLOT},
            {id:dashboardWiringStandardIds.REFRESH_SLOT}]), function(parameter){
            res.slots[parameter.id] = function(name){
                return function(value, sender){
                    (model.lastPayload || (model.lastPayload = {}))[name] =  value;
                    (model.lastSender || (model.lastSender = {}))[name] = sender;
                    model.trigger("signal", {name:name, value: value}, sender);
                }
            }(parameter.id);
        });

        return res;
    }

    function stripFields(parameters){
        return _.map(parameters || [], function(paramObj) {
            return {
                id: paramObj.id,
                uri: paramObj.uri,
                label: paramObj.label
            };
        });
    }

    function extractOutputParameters(outputParameters){
        return _.filter(outputParameters || [], function(parameter){
            return _.indexOf(technical, parameter.id) === -1;
        });
    }

    return DashletModel.extend({
        componentName: i18n['dashboard.component.report.component.name'],

        defaults: _.extend({}, DashletModel.prototype.defaults, {
            type: dashboardComponentTypes.REPORT,

            scaleToFit: dashboardSettings.DASHLET_SCALE_TO_FIT,

            autoRefresh: dashboardSettings.DASHLET_AUTO_REFRESH,
            refreshInterval: dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_DEFAULT_MINUTES,
            refreshIntervalUnit: dashboardSettings.DASHBOARD_REFRESH_INTERVAL_UNIT,

            showTitleBar: dashboardSettings.DASHLET_SHOW_TITLE_BAR,
            showExportButton: dashboardSettings.DASHLET_SHOW_EXPORT_BUTTON,
            showRefreshButton: dashboardSettings.DASHLET_SHOW_REFRESH_BUTTON,
            showMaximizeButton: dashboardSettings.DASHLET_SHOW_MAXIMIZE_BUTTON,
            showPaginationControl: dashboardSettings.DASHLET_SHOW_PAGINATION_CONTROL
        }),

        validation: _.extend({}, DashletModel.prototype.validation, {
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
            ],

            refreshInterval: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.report.refreshInterval.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.error.report.refreshInterval.integer")
                },
                {
                    fn: function(value, attr, computedState){
                        var currentUnits = computedState["refreshIntervalUnit"];
                        var units = {"second": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS,
                                     "minute": dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES};
                        if(value < units[currentUnits]){
                            return "Value must be bigger than " + units[currentUnits];
                        }
                    },
                    msg: new i18nMessage("dashboard.error.report.refreshInterval.min", dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_MINUTES,
                                                                                    dashboardSettings.DASHLET_REFRESH_INTERVAL_TIME_UNIT_SECONDS)
                }
            ],
            refreshIntervalUnit: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.error.report.refreshIntervalUnit.required")
                },
                {
                    oneOf: ["second", "minute"],
                    msg: new i18nMessage("dashboard.error.report.refreshIntervalUnit.oneOf",
                        i18n["dashboard.dialog.properties.refresh.interval.second"], i18n["dashboard.dialog.properties.refresh.interval.minute"])
                }
            ]
        }),

        initialize: function(){
            this.paramsDfd = new $.Deferred();
            this.componentInitializedDfd = new $.Deferred();

            DashletModel.prototype.initialize.apply(this, arguments);

            this.set("dataSourceUri", this._getDataSourceUri());

            this.on("change:autoRefresh", function() {
                if (!this.get("autoRefresh") && !this.isValid(["refreshInterval", "refreshIntervalUnit"])) {
                    this.set({
                        refreshInterval: this.defaults.refreshInterval,
                        refreshIntervalUnit: this.defaults.refreshIntervalUnit
                    });
                }
            }, this);
        },

        getReportResourceUri: function() {
            return this.componentInitializedDfd.resolve(this.resource.resource.get("uri")).promise();
        },

        _getDataSourceUri: function() {
            return (this.resource && this.resource.resource && this.resource.resource.get("uri")) || this.get("dataSourceUri");
        },

        _getWiringMetadata: function(){
            var self = this,
                res = this.paramsDfd;

            if (this.paramsDfd.state() === "pending"){
                if (!this.paramsDfd._running) {
                    if (this.get("parameters")) {
                        this.paramsDfd.resolve(this, convertICDataToWiringInfo(this));
                    } else {
                        this.paramsDfd._running = true;

                        var uriDfd = this.getReportResourceUri(),
                            parametersDfd = new $.Deferred();

                        ParametersCache.getReportParameters(this.resource.resource.get("uri"))
                            .done(function (parameters, outputParameters) {
                                self.set({
                                    outputParameters: stripFields(extractOutputParameters(outputParameters)),
                                    parameters: stripFields(parameters)
                                });
                            })
                            .fail(function () {
                                self.set({
                                    outputParameters: [],
                                    parameters: []
                                });
                            }).always(function () {
                                parametersDfd.resolve();
                        });

                        $.when(uriDfd, parametersDfd).then(function () {
                            self.paramsDfd.resolve(self, convertICDataToWiringInfo(self));
                        });
                    }
                }
            } else {
                res = new $.Deferred();
                res.resolve(this, convertICDataToWiringInfo(this));
            }

            return res.promise();
        }
    });
});