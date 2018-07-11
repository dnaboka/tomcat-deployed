/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var Backbone = require("backbone"),
        FilterModel = require("adhoc/filter/FilterModel"),
        _ = require("underscore");

    return Backbone.Collection.extend({
        model : FilterModel,

        addFromField : function(field) {
            return this.add(this.createFilter(field));
        },

        createFilter : function(field) {
            return new this.model({
                filterDataType: field.type,
                id: field.name,
                label: field.defaultDisplayName,
                operatorName: "equals",
                filterLetter: this.nextLetter(),
                value : "",
                state : {
                    value : ""
                }
            });
        },

        initialize: function(models, options) {
            this.service = options.service;
            this.isOlap = options.isOlap;
        },

        set: function(models, options) {
            options = options || {};
            _.extend(options, { service: this.service, isOlap: this.isOlap });
            return Backbone.Collection.prototype.set.call(this, models, options);
        },

        nextLetter : function() {
            return this.length > 0 ? this.incLetter(this.at(this.length - 1).get("filterLetter")) : "A";
        },

        incLetter : function(letter) {
            if (_.isEmpty(letter)){
                return letter;
            }
            return String.fromCharCode(letter.charCodeAt(0) + 1);
        },

        editableFilters : function() {
            return this.filter(function(model){ return model.get("editable"); });
        },

        toExpression : function() {
            return _(this.editableFilters()).map(function(filterModel) {
                return {
                    filterId: filterModel.get("id"),
                    filterExpression: filterModel.toExpression()
                };
            });
        }
    });
});
