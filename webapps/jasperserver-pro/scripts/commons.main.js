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
    var domReady = require("!domReady");
    require("commons.minimal.main");
    require("namespace");
    require("core.accessibility");
    require("core.events.bis");
    require("core.key.events");
	require("create.report");

    require("logger");
    require("resource.base");
    require("components.pickers");
    require("common/component/list/view/ListWithSelection");
    require("common/component/dialog/Dialog");
    require("common/component/dialog/AlertDialog");
    require("common/component/dialog/ConfirmationDialog");

    var actionModel = require("actionModel.modelGenerator"),
        primaryNavigation = require("actionModel.primaryNavigation"),
        globalSearch = require("repository.search.globalSearchBoxInit"),
        layoutModule = require("core.layout"),
        jrsConfigs = require("jrs.configs"),
        $ = require("jquery");

    domReady(function(){

        // add information about locale into body's class
        $("body").addClass("locale-" + jrsConfigs.userLocale);

        layoutModule.initialize();

        // NOTE: Standard Navigation is initialized before these systems, in
        // commons.minimal.main.js, for possible automation use, and to
        // pre-empt these systems where appropriate.
        primaryNavigation.initializeNavigation(); // global keyboard navigation setup

        // *!* FIXME: Is this being called twice?  see core.initialize.js
        actionModel.initializeOneTimeMenuHandlers(); // menu setup

        jrsConfigs.initAdditionalUIComponents && globalSearch.initialize();
        //isNotNullORUndefined(window.accessibilityModule) && accessibilityModule.initialize();

        //trigger protorype's dom onload manualy
        document.fire("dom:loaded");
    });

});
