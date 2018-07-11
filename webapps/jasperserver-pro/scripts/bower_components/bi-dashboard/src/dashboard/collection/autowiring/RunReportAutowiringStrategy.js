/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zakhar.Tomchenko
 * @version: $Id: RunReportAutowiringStrategy.js 4 2014-08-15 14:51:00Z ktsaregradskyi $
 */


define(function (require) {
    "use strict";

    var _ = require("underscore"),
        BaseAutowiringStrategy = require("./BaseAutowiringStrategy"),
        dashboardWiringStandardIds = require("../../enum/dashboardWiringStandardIds"),
        dashboardComponentTypes = require("../../enum/dashboardComponentTypes");

    return BaseAutowiringStrategy.extend({
        autowire: function(collection, component, metadata){
            if (component.isVisualization() || component.isParametrized()){
                var components = component.collection,
                    dashboardProperties = components.getDashboardPropertiesComponent();

                collection.get(dashboardProperties.id + ":" + dashboardWiringStandardIds.INIT_SIGNAL).consumers.add({ consumer: component.id + ":" + dashboardWiringStandardIds.REFRESH_SLOT });
                collection.get(dashboardProperties.id + ":" + dashboardWiringStandardIds.APPLY_SIGNAL).consumers.add({ consumer: component.id + ":" + dashboardWiringStandardIds.APPLY_SLOT });
            }
        }
    });
});
