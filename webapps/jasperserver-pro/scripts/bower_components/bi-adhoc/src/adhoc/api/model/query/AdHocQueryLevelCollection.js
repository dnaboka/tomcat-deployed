/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Zahar Tomchenko
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),

        Model = require("./AdHocQueryLevelModel");

    return Backbone.Collection.extend({
        model: Model,

        initialize: function(attrs, opts) {
            this.adHocModel = opts.adHocModel;
            this._master  = opts.master;
        },

        multiAxisMap: function(fn){
            var hasMeasure = false,
                items = [].concat(this.models),
                existingItems = this._master ? this._master.models.concat(this.models) : this.models;

            for (var i = items.length - 1; i >= 0; i--) {
                if (items[i]) {
                    if (items[i].isMeasure()) {
                        if (hasMeasure) {
                            items[i] = null;
                        } else {
                            hasMeasure = true;
                        }
                    } else {
                        for (var j = existingItems.length - (items.length - i) - 1; items[i] && j > -1; j--) {
                            if ((items[i].get("field") === existingItems[j].get("field") || items[i].get("dimension") === existingItems[j].get("dimension")) &&
                                items[i].get("functionName") === existingItems[j].get("functionName") &&
                                !items[i].isDateTime()) {
                                items[i] = null;
                            }
                        }
                    }
                }
            }

            return _.map(_.compact(items), fn);
        },

        hasMeasures: function () {
            return !!this.find(function(model){
                return model.isMeasure();
            })
        },

        allHasSummaries: function(){
           return !this.find(function(model){
               return !model.get("includeAll");
           })
        },

        toQueryMultiaxisAxisItems: function () {
            return this.multiAxisMap(function (level) {
                return level.toQueryMultiaxisAxisItem();
            });
        }
    });
});