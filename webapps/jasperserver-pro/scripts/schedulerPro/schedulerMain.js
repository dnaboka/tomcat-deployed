/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: Igor.Nesterenko
 * @version: $Id: SchedulerController.js 9551 2015-10-13 14:09:03Z dgorbenk $
 */

define(function (require) {

    "use strict";

	// loading Top Menu
	require("commons.main");

    var $ = require("jquery"),
	    SchedulerAppPro = require("schedulerPro/view/SchedulerAppPro"),
        domReady = require("domReady");

    domReady(function() {
        var schedulerAppPro = new SchedulerAppPro();
        $("#display").append(schedulerAppPro.$el);

        //workraround to make jquery-ui work properly with 'jr' prefix
        $("body").addClass("jr");
    });

});