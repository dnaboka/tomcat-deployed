/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


define(function(require){
    "use strict";

    /**
     * Returns specific set of title bar controls depend of dashboard component type
     */

    var showTitleBarElementsControlTemplate = require("text!dashboard/template/properties/controls/titleBarElements/showTitleBarElementsControlTemplate.htm"),
        showMaximizeButtonControlTemplate = require("text!dashboard/template/properties/controls/titleBarElements/showMaximizeButtonControlTemplate.htm"),
        showRefreshButtonControlTemplate = require("text!dashboard/template/properties/controls/titleBarElements/showRefreshButtonControlTemplate.htm"),
        showExportButtonControlTemplate = require("text!dashboard/template/properties/controls/titleBarElements/showExportButtonControlTemplate.htm"),
        dashboardComponentTypes = require("dashboard/enum/dashboardComponentTypes");

    return function(componentType) {
        switch (componentType) {
            case dashboardComponentTypes.TABLE:
            case dashboardComponentTypes.CROSSTAB:
            case dashboardComponentTypes.REPORT:
            case dashboardComponentTypes.ADHOC_VIEW:
            case dashboardComponentTypes.CHART:
                return showTitleBarElementsControlTemplate.replace("{{controls}}", [
                    showRefreshButtonControlTemplate,
                    showMaximizeButtonControlTemplate,
                    showExportButtonControlTemplate
                ].join("\n"));
            default:
                return showTitleBarElementsControlTemplate.replace("{{controls}}", [
                    showRefreshButtonControlTemplate,
                    showMaximizeButtonControlTemplate
                ].join("\n"));
        }
    };
});