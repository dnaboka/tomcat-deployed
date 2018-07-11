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

    var Backbone = require("backbone"),
        dashboardSettings = require("../dashboardSettings"),
        DashboardFoundationModel = require("../model/DashboardFoundationModel");

    return Backbone.Collection.extend({
        model: DashboardFoundationModel,

        addDefaultFoundation: function () {
            return this.add(new DashboardFoundationModel({
                id: dashboardSettings.DEFAULT_FOUNDATION_ID,
                components: dashboardSettings.DEFAULT_FOUNDATION_COMPONENTS_ID,
                layout: dashboardSettings.DEFAULT_FOUNDATION_LAYOUT_ID,
                wiring: dashboardSettings.DEFAULT_FOUNDATION_WIRING_ID
            }));
        },

        getDefaultFoundation: function () {
            return this.get(dashboardSettings.DEFAULT_FOUNDATION_ID);
        }
    });
});