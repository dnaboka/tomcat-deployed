/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone");

    return Backbone.Collection.extend({

        findComponentDeep: function(componentType) {
            var components = this.filter({
                componentType: componentType
            });
            var childComponents = this.reduce(function(res, model) {
                return res.concat(model.components.findComponentDeep(componentType));
            }, []);

            return components.concat(childComponents);
        }
    });
});