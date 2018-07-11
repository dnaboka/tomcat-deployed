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
        log = require("logger").register(module);

    return Backbone.Collection.extend({

        initialize: function(){
            this.measures = {};
            this.multiAxisItems = {};
        },

        reset: function (values, options) {
            return Backbone.Collection.prototype.reset.call(this, _.map(values, function(value){
                if (!value.member && !value.level && !value.bottomN && !value.topN){
                    return {level: value}
                }
                return value;
            }), options);
        },

        toJSON: function (multiLevel) {
            if (this.length) {
                if (multiLevel) {
                    return this.reduce(function (memo, model) {
                        if (model.has("level") && !model.get("level").aggregation) {
                            memo.push(_.clone(model.get("level")));
                        }
                        return memo;
                    }, []);
                } else {
                    var measures = this.measures,
                        multiAxisItems = this.multiAxisItems;
                    return _.filter(Backbone.Collection.prototype.toJSON.apply(this, arguments), function(item){
                        return !item.level || item.level.aggregation || !(measures[item.level.fieldRef] || !multiAxisItems[item.level.fieldRef]);
                    });
                }
            }
        }
    });
});