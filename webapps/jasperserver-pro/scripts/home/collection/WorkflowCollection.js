/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: ${Id}
 */

define(function (require) {
    "use strict";

    var HalBaseModel = require("home/model/HalBaseModel"),
        relations = require("home/connectivity/relations"),
        providerFactory = require("home/connectivity/dataProviderFactory"),
        HalBaseCollection = require("home/collection/HalBaseCollection");

    return HalBaseCollection.extend({
        modelRel: relations.workflow,
        model: HalBaseModel,
        //Default provider need on admin manage page
        dataProvider: providerFactory(relations.workflows)
    });
});