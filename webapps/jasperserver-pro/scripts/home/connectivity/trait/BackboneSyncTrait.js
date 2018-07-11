/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function (require) {

    "use strict";

    var _ = require("underscore");

    var backboneMethodMap = {
            "create": "save",
            "update": "update",
            "delete": "remove",
            "read": "fetch"
     };

    return {

        dataProvider: null,

        defaultParams: null,

        initialize: function(options){
            if (options && options.defaultParams){
                this.defaultParams = options.defaultParams;
            }
        },

        sync: function(method, model, options) {

            // DataProvider should not execute any callbacks, so remove them from options
            //TODO: not sure that it's right, callback api could be useful
            var successCb = options.success,
                errorCb = options.error;

            delete options.success;
            delete options.error;

            var providerMethod = backboneMethodMap[method];

            if (this.defaultParams && "read" == method){
                var params = {};
                if (options && options.params){
                    params = options.params;
                }
                params = _.extend(params, this.defaultParams);
                options.params = params;
            }

            return this.dataProvider[providerMethod](options).then(successCb, errorCb);
        }
    }
});
