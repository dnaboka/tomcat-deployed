/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Andriy Godovanets
 * @version: $Id:
 */


define(function(require) {
    "use strict";

    var dashboardComponentTypes = require("../enum/dashboardComponentTypes");


    var adhocDesignerReportTypeToDashboardComponentTypeMap = {
        "olap_ichart": dashboardComponentTypes.CHART,
        "olap_crosstab": dashboardComponentTypes.CROSSTAB,
        "ichart": dashboardComponentTypes.CHART,
        "crosstab": dashboardComponentTypes.CROSSTAB,
        "table": dashboardComponentTypes.TABLE
    };

    return function(viewType) {
        return adhocDesignerReportTypeToDashboardComponentTypeMap[viewType];
    }
});