/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

/* global define, Administer, layoutModule */

define(function (require) {
	"use strict";

	var domReady = require("!domReady"),
		logging = require("administer.logging"),
		jrsConfigs = require("jrs.configs"),
		LogCollectorsController = require("logCollectors/LogCollectorsController");

	domReady(function () {

		// initialize left admin menu
		logging.initialize();

		// hack, dirty hack...
		Administer.urlContext = jrsConfigs.urlContext;

		new LogCollectorsController({
			container: jrsConfigs.logCollectors.initParams.container
		});

		layoutModule.resizeOnClient('serverSettingsMenu', jrsConfigs.logCollectors.initParams.container.replace("#", ""));
	});
});
