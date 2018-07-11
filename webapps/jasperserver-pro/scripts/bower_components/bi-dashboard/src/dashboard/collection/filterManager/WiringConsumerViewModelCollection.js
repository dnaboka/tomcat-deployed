/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 *
 *
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        _ = require("underscore"),
        WiringConsumerViewModel = require("../../model/filterManager/WiringConsumerViewModel");

    return Backbone.Collection.extend({
        model: WiringConsumerViewModel,

        comparator: "parameterLabel",

        initialize: function() {
            this.on("change:parameterLabel", this.sort);
        },

        isValid: function(validate) {
            return _.every(this.invoke("isValid", validate), _.identity);
        }
    });
});
