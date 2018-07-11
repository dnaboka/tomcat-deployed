/*
 * Copyright (C) 2005 - 2016 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id:$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        $ = require("jquery"),
        _ = require("underscore"),
        configs = require("jrs.configs"),
        AdHocBundleModel = require("./AdHocBundleModel");

    return Backbone.Collection.extend({
        model: AdHocBundleModel,

        initialize: function(ms, args){
            if (!args || !args.contextPath){
                throw new Error("contextPath must be specified");
            }

            this.CONTEXT_PATH = args.contextPath;
        },
        
        getByLocale: function(locale){
            var res = this.get(locale);

            if (!res) {
                res = this.get(locale.split("_")[0]);
            }

            if (!res) {
                res = this.get("");
            }

            return res;
        },

        getCurrent: function(){
            return this.getByLocale(configs.userLocale);
        },

        bundle: function (locale) {
            var model, res;

            if (_.isUndefined(locale)) {
                locale = configs.userLocale || "";
            }

            if (!this.models.length) {
                res = new $.Deferred().resolve({})
            } else if (!(model = this.getByLocale(locale))) {
                res = new $.Deferred().reject({
                    errorCode: "bundle.not.found",
                    message: "The bundle for locale is not found",
                    properties: [locale]
                });
            } else if (model._contentDfd) {
                res = model._contentDfd;
            } else {
                res = model._contentDfd = new $.Deferred();
                if (model.resource.contentJSON) {
                    res.resolve(model.resource.contentJSON);
                } else {
                    model.resource.fetchContent().done(function () {
                        res.resolve(model.resource.contentJSON);
                    });
                }
            }

            return res.promise();
        }
    });
});