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
        log = require("logger").register(module),
        Backbone = require("backbone"),
        ChartTypeCollection = require("../collection/ChartTypeCollection");

    return Backbone.Model.extend({
        defaults: {
            id: undefined,
            name: undefined,
            bundleName: undefined,
            chartTypes: []
        },

        initialize: function() {
            this.chartTypesCollection = new ChartTypeCollection(this.get("chartTypes"));
        },
        toJSON: function() {
            var json = Backbone.Model.prototype.toJSON.call(this);
            json.chartTypes = this.chartTypesCollection.toJSON();
            return json;
        }

    });
});