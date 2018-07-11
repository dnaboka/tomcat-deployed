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
        _ = require("underscore"),
        i18n = require("bundle!DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n}),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        dashboardSettings = require("dashboard/dashboardSettings");

    return DashletModel.extend({
        componentName: i18n['dashboard.component.filter.group.component.name'],

        defaults: _.extend({}, DashletModel.prototype.defaults, {
            filtersPerRow: dashboardSettings.DASHLET_FILTERS_PER_ROW,
            buttonsPosition: dashboardSettings.DASHLET_BUTTONS_POSITION,
            applyButton: dashboardSettings.DASHLET_FILTER_APPLY_BUTTON,
            resetButton: dashboardSettings.DASHLET_FILTER_RESET_BUTTON,
            floating: false,
            maximized: null,
            toolbar: null
        }),

        validation: _.extend({}, DashletModel.prototype.validation, {
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
            filtersPerRow: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.filters.per.row.required")
                },
                {
                    integerNumber: true,
                    msg: new i18nMessage("dashboard.component.error.filters.per.row.integer")
                },
                {
                    range: [dashboardSettings.DASHLET_FILTERS_PER_ROW_MIN, dashboardSettings.DASHLET_FILTERS_PER_ROW_MAX],
                    msg: new i18nMessage("dashboard.component.error.filtersPerRow.range", dashboardSettings.DASHLET_FILTERS_PER_ROW_MIN, dashboardSettings.DASHLET_FILTERS_PER_ROW_MAX)
                }
            ],
            buttonsPosition: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.component.error.filters.buttons.position.required")
                },
                {
                    oneOf: ["bottom", "right"],
                    msg: new i18nMessage("dashboard.component.error.filters.buttons.position.oneOf",
                        i18n["dashboard.component.filter.group.component.buttons.position.bottom"], i18n["dashboard.component.filter.group.component.buttons.position.right"])
                }
            ]
        }),

        initialize: function(){
            this.isMute = true;

            return DashletModel.prototype.initialize.apply(this, arguments);
        },

        acceptWiringVisitor: function (wiring) {
            wiring.register(this, {
                signals: [dashboardWiringStandardIds.REFRESH_SIGNAL],
                slots: {}
            });
        },

        notify: function(force){
            if (force || (!this.get("applyButton") && !this.isDesigner && !this.isMute)){
                this.collection.pushParametersState();
                this.trigger(dashboardWiringStandardIds.REFRESH_SIGNAL, {});
            }
        },

        isFloating: function() {
            return this.get("floating");
        }
    });
});