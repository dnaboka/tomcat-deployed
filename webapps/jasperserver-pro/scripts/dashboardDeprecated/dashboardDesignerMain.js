/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

/* global Hash */
define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        _ = require("underscore"),
        dashboardDesigner = require("dashboard.designer"),
        designerBase = require("designer.base"),
        baseControls = require("controls.base"),
        jrsConfigs = require("jrs.configs");

    domReady(function() {
        if(window.Prototype) {
            delete Object.prototype.toJSON;
            delete Array.prototype.toJSON;
            delete Hash.prototype.toJSON;
            delete String.prototype.toJSON;
        }

        _.extend(dashboardDesigner, jrsConfigs.dashboardDesigner.localContext);
        _.extend(baseControls, jrsConfigs.inputControlConstants);

        designerBase.superInitAll();
    });
});