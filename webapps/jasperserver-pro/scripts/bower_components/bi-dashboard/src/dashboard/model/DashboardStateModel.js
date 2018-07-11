/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Kostiantyn Tsaregradskyi
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone");

    return Backbone.Model.extend({
        defaults: {
            timestamp: undefined,
            state: undefined
        },

        initialize: function(atts, options) {
            options || (options = {});

            this.set("timestamp", (new Date()).getTime());

            this.dashboardModel = options.dashboardModel;
        },

        applyState: function() {
            this.dashboardModel.applyJsonState(this.get("state"));
        }
    });
});
