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

    var _ = require("underscore"),
        Backbone = require("backbone"),
        wiringRemoveConsumerTemplate = require("text!../../../template/filterManager/wiringRemoveConsumerTemplate.htm");

    return Backbone.View.extend({
        events: {
            "click .removeConsumerColumn > .delete": "removeConsumer"
        },

        el: wiringRemoveConsumerTemplate,

        removeConsumer: function (e) {
            e && e.preventDefault();

            this.model.collection.remove(this.model);
        }
    });
});
