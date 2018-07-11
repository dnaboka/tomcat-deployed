/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var domReady = require("!domReady"),
        _ = require("underscore"),
        domain = require("domain.components"),
        domainDesigner = require("domain.designer.validators"),
        jrsConfigs = require("jrs.configs");

    require("domain.designer.calculatedFields");

    domReady(function(){
        if (typeof window.localContext === "undefined") {
            window.localContext = {};
        }
        _.extend(window.localContext, jrsConfigs.domainDesigner.localContext);

        _.extend(domain._messages, jrsConfigs.domainDesigner.domain._messages);

        domainDesigner.initialize();
    });
});
