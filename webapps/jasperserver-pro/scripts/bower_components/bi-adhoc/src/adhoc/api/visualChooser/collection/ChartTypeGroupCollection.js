/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        ChartTypeGroupModel = require("../model/ChartTypeGroupModel"),
        log = require("logger").register(module);

    return Backbone.Collection.extend({
        model: ChartTypeGroupModel,

        initialize: function(models, options) {

        }
    });
});