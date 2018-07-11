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

    function addHigherLevels(values, query, axis){
        var members = _.filter(values, function (ex) {
                return ex.member;
            }),

            allLevels = _.reduce(axis.axis.multiAxisMap(function (item) {
                var isMeasure = item.get("kind") === "measure",
                    exp = _.find(values, function (level) {
                    return  level.level && ((isMeasure && level.level.aggregation) || (!isMeasure && item.get("id") === level.level.fieldRef))
                });

                if (!exp) {
                    exp = {
                        level: {
                            expanded: false,
                            aggregation: isMeasure
                        }
                    };

                    if (!isMeasure) {
                        exp.level.fieldRef = item.has("id") ?  item.get("id") : item.get("hierarchicalName")
                    }
                }
                return exp;
            }), function(memo, exp){
                if (exp.level.aggregation){
                    if (!memo.hasMeasure){
                        memo.res.push(exp);
                    }
                    memo.hasMeasure = true;
                } else {
                    memo.res.push(exp);
                }
                return memo;

            }, {hasMeasure: false, res: []}).res;

        return allLevels.concat(members);
    }

    return Backbone.Collection.extend({
        initialize: function(attrs, opts) {
            this.query = opts.query;
            this.axis = opts.axis;
        },

        reset: function (values, options) {
            return Backbone.Collection.prototype.reset.call(this, addHigherLevels(values, this.query, this.axis), options);
        },

        getByGroupByItem: function (item) {
            if (item.level){
                var id = item.level.id || item.level.field;
                return this.find(function (exp) {
                    var level = exp.get("level");
                    if (level){
                        return  level.fieldRef === id;
                    }
                });
            }

            if (item.aggregations) {
                return this.find(function (exp) {
                    var level = exp.get("level");
                    if (level) {
                        return level.aggregation;
                    }
                });
            }
        },

        getByPath: function(path){
            return this.find(function (expansion) {
                var member = expansion.get("member");

                if (member && member.path.length === path.length) {
                    for (var i = 0; i < path.length; i++) {
                        if (member.path[i] !== path[i]) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            });
        },

        getLevelExpansions: function(){
            return this.filter(function (exp) {
                return !exp.has("member");
            });
        },

        getMemberExpansions: function(){
            return this.filter(function (exp) {
                return exp.has("member");
            });
        },

        toJSON: function(options){
            if (options && options.isChartMode){
                return _.compact(this.map(function(expansion){
                    if (expansion.get("level")){
                        return expansion.toJSON(options);
                    }
                }));
            } else {
                return Backbone.Collection.prototype.toJSON.call(this, options);
            }
        }
    });
});