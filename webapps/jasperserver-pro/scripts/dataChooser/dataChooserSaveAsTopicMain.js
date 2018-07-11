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
        domain = require("domain.chooser.saveAsTopic"),
        SaveAsTopicModel = require("domainTopic/model/SaveAsTopicModel"),
        jrsConfigs = require("jrs.configs"),
        _ = require("underscore"),
        AlertDialog = require("common/component/dialog/AlertDialog");

    domReady(function(){
        _.extend(domain._messages, jrsConfigs.dataChooser.domain._messages);
        _.extend(window.localContext, jrsConfigs.dataChooser.localContext);

        if(jrsConfigs.dataChooser.errorMessage) {
            var errorDialog = new AlertDialog();
            errorDialog.setMessage(jrsConfigs.dataChooser.errorMessage);
            errorDialog.open();
        }

        domain.chooser.initialize({model: SaveAsTopicModel});
    });
});