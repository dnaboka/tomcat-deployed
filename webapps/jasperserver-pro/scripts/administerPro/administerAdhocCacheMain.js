/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function(require){

    "use strict";

    var domReady = require("!domReady"),
        Administer = require("administer.base"),
        cacheSettings = require("administer.cache"),
        jrsConfigs = require("jrs.configs");

    domReady(function() {
        Administer.urlContext = jrsConfigs.urlContext;
        cacheSettings.initialize();
    });
});
