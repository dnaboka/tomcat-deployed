/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author Zakhar Tomchenko
 * @version: $Id$
 */

define(function (require) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),

        QueryVariableTypes = require("../enum/QueryVariableTypes"),
        DefaultFormatMap = require("../enum/DefaultFormatMap"),
        DefaultFormatBundle = require("../enum/DefaultFormatBundle"),
        TypeKindMap = require("../enum/TypeKindMap"),
        i18n = require("bundle!AdHocBundle"),

        /**
         * @class AdHocQueryModel
         */
        AdHocQueryLevelModel = Backbone.Model.extend({

            defaults: {
                timeBalanceFunctionName: "TimeBalanceDefault",
                includeAll: false
            },

            initialize: function(){
                if (this.isDateTime()){
                    if (!this.has("categorizer")){
                        this.set({categorizer : this.defaultCategorizer()}, {silent: true});
                    }
                } else {
                    if (this.get("categorizer") === "all"){
                        this.unset("categorizer", {silent: true});
                    }
                }

                if (!this.has("aggregationType")){
                    this.set({aggregationType : aggregationType(this)}, {silent: true});
                }

                if (!this.has("format")) {
                    if (this.has("aggregationFormat") && TypeKindMap[this.get("aggregationType")] === TypeKindMap[this.get("type")]) {
                        this.set({format: this.get("aggregationFormat"), formatId: this.get("aggregationFormatId")});
                    } else {
                        this.set({format: DefaultFormatBundle[DefaultFormatMap[this.get("type")]], formatId: DefaultFormatMap[this.get("type")]}, {silent: true});
                    }
                }

                if (!this.has("aggregationFormat")){
                    if (TypeKindMap[this.get("aggregationType")] === TypeKindMap[this.get("type")]){
                        this.set({aggregationFormat: this.get("format"), aggregationFormatId: this.get("formatId")}, {silent: true});
                    } else {
                        this.set({aggregationFormat: DefaultFormatBundle[DefaultFormatMap[this.get("type")]], aggregationFormatId: DefaultFormatMap[this.get("type")]}, {silent: true});
                    }
                }

                // Set default summary function from schema.
                if (!this.has("defaultFunctionName")) {
                    this.set({defaultFunctionName: this.collection.adHocModel.schema.getByReference(this.get("hierarchicalName")).aggregation}, {silent: true});
                }
            },

            label: function (showSummaryFunction) {
                var base;

                if (this.has("labelId") && this.collection.adHocModel.bundles.length){
                    base = this.collection.adHocModel.bundles.getCurrent().toLabel(this.get("labelId"));
                }

                if (_.isUndefined(base)){
                    base =  this.has("label") ? this.get("label") : this.get("dimension");
                }

                if (showSummaryFunction && this.has("functionName") && this.get("functionName") !== this.get("defaultFunctionName")) {
                    base += " (" + i18n['adhoc.function.aggregate.name.' + this.get("functionName")] + ")";
                }

                return base;
            },

            isDateTime: function(){
                return this.isDate() || this.isTime();
            },

            isDate: function(){
                var type = this.get("type");
                return type ===  QueryVariableTypes.DATE || type ===  QueryVariableTypes.TIMESTAMP;
            },

            isTime: function(){
                return this.get("type") ===  QueryVariableTypes.TIME;
            },

            isFloat: function(){
                var type = this.get("type");
                return type === QueryVariableTypes.DECIMAL || type === QueryVariableTypes.BIG_DECIMAL || type === QueryVariableTypes.DOUBLE || type === QueryVariableTypes.FLOAT;
            },

            isString: function(){
                return this.get("type") === QueryVariableTypes.STRING;
            },

            isMeasure: function(){
                return this.get("kind") === "measure";
            },

            isLevel: function(){
                return this.get("kind") === "level";
            },

            isDefaultCategorizer: function(){
               return this.get("categorizer") === this.defaultCategorizer();
            },

            defaultCategorizer: function(){
                if (this.isDateTime()){
                    return this.isTime() ? "minute" : "day";
                }
            },

            toQueryMultiaxisAxisItem: function(){
                var res;
                if (this.isMeasure()) {
                    res = {aggregations: {}};
                } else if (this.isLevel()){
                    res = {level: _.pick(this.attributes, "id", "includeAll", "dimension")};

                    res.level.field = this.get("hierarchicalName");

                    if (this.isDateTime()){
                        res.level.categorizer = this.get("categorizer");
                    }
                } else {
                    throw new Error("Unknown kind: " + this.get("kind"));
                }
                return res;
            }
        });

    function aggregationType(model){
        var functionName = model.get("functionName"),
            medianType = model.isDateTime() ? model.get("type") : QueryVariableTypes.DECIMAL;

        if (functionName === "Sum"){
            return model.isFloat() ? QueryVariableTypes.BIG_DECIMAL : QueryVariableTypes.LONG
        }

        if (functionName === "CountAll" || functionName === "CountDistinct" ){
            return QueryVariableTypes.LONG;
        }

        if (functionName === "Average"){
            return QueryVariableTypes.DOUBLE;
        }

        if (functionName === "Max" || functionName === "Median" || functionName === "Min" ||
            functionName === "Mode" || functionName === "Range" || functionName === "StdDevP" || functionName === "StdDevS"){
            return medianType;
        }

        if (functionName === "RangeDays" || functionName === "RangeHours" || functionName === "RangeMinutes" || functionName === "RangeMonths" ||
            functionName === "RangeQuarters" || functionName === "RangeSemis" || functionName === "RangeWeeks" || functionName === "RangeYears"){
            return QueryVariableTypes.BIG_DECIMAL
        }
    }

    return AdHocQueryLevelModel;
});