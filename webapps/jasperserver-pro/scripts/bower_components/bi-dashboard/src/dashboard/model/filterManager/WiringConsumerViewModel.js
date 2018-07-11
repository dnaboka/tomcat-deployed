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
        i18n = require("bundle!js-sdk/DashboardBundle"),
        i18nMessage = require("common/util/i18nMessage").extend({bundle: i18n});

    require("backbone.validation");

    return Backbone.Model.extend(_.extend({}, Backbone.Validation.mixin, {
        idAttribute: undefined,

        defaults: {
            id: undefined,
            name: undefined,
            parameter: undefined,
            parameterLabel: undefined
        },

        validation: {
            id: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.filterManager.error.component.required")
                }
            ],

            parameter: [
                {
                    required: true,
                    msg: new i18nMessage("dashboard.filterManager.error.parameter.required")
                }
            ]
        },

        initialize: function(attrs, options) {
            options || (options = {});

            this.component = options.component;

            this.on("change:id", function() {
                this.set({
                    "parameter": undefined,
                    "parameterLabel": undefined
                });
            }, this);
        }
    }));
});
