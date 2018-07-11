/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Igor.Nesterenko
 * @version: $Id$
 */

define(function(require) {
    "use strict";

    var BaseDataProvider = require("home/connectivity/provider/BaseDataProvider"),
        jQuery = require("jquery"),
        Class = require("home/util/Class"),
        _ = require("underscore");


    return  Class(BaseDataProvider).extend({

        getUrl: function(){
            return this.url;
        },

        fetch: function (options) {

            var dfr = new jQuery.Deferred(),
                ajaxOptions = this.prepareRequestOptions(options),
                relation = this.rel;

            jQuery
                .ajax(_.extend(ajaxOptions, options))
                .done(function (dto) {
                    var result = [];

                    if (dto._embedded && dto._embedded[relation]) {
                        result = dto._embedded[relation];
                    }

                    dfr.resolve(_.isArray(result) ? result: [result]);
                })
                .fail(function (error) {
                    dfr.reject(error);
                });

            return dfr;
        }

    });
});
