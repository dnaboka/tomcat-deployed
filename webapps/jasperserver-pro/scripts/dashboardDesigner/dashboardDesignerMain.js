/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

define(function(require) {
    var config = require("jrs.configs"),
        $ = require("jquery"),
        dashboardSettings = require('dashboard/dashboardSettings'),
        webHelpModule = require("components.webHelp"),
        expirationManager = require("session/expirationManager"),
        DashboardDesigner = require("dashboard/DashboardDesigner");

    require("commons.main");

    dashboardSettings.CONTEXT_PATH = config.contextPath;

    expirationManager({timeoutWarningDelay: dashboardSettings.TIMEOUT_WARNING_DELAY});
    webHelpModule.setCurrentContext("dashboard");

    require(["!domReady"], function(){
        new DashboardDesigner({
            el: '#display',
            contextPath: config.contextPath
        });
    });
});
