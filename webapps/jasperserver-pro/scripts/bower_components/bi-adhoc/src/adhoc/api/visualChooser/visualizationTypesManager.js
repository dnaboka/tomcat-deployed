/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @author: Pavel Savushchik
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        ChartTypeGroupCollection = require("./collection/ChartTypeGroupCollection"),
        visualizationTypes = require("./enum/visualizationTypes"),
        chartTypeManager;
    
    function ChartTypeManager() {
        this.collection = new ChartTypeGroupCollection(visualizationTypes);
    }

    ChartTypeManager.prototype.getAllTypes = function() {
        var models = this.collection.map(function(groupModel) {
            return groupModel.chartTypesCollection.toJSON();
        });


        return _.flatten(models);
    };
    ChartTypeManager.prototype.getAllGroups = function() {
        return this.collection.toJSON();
    };

    ChartTypeManager.prototype.getAllTypesInGroup = function(groupName) {
        return this.collection.findWhere({
            name: groupName
        }).chartTypesCollection.toJSON();
    };

    ChartTypeManager.prototype.findType = function(filter) {
        return _.findWhere(this.getAllTypes(), filter);
    };

    ChartTypeManager.prototype.isTimeSeriesType = function(type) {
        var typeObj = this.findType({
            name: type
        });

        return typeObj["isTimeSeries"];
    };

    ChartTypeManager.prototype.getTimeseriesAttributes = function(rows) {
        var firstField = rows.first();

        return {
            isDateTime: firstField && firstField.isDateTime(),
            categorizer: firstField && firstField.get("categorizer")
        }
    },

    ChartTypeManager.prototype.getDisabledTypesList = function (columns, rows) {
        var column = toPlacement(columns),
            row = toPlacement(rows),
            categorizerFn = function(e){ return e.isDefaultCategorizer()},
            categorizers = _.compact(columns.pluck("categorizer").concat(rows.pluck("categorizer"))),
            defaultCategorizersOnly =  _.reduce(columns.map(categorizerFn).concat(rows.map(categorizerFn)), function(memo, val){
                return memo && val;
            });

        return this.getDisabledChartTypes(
            column.measureCount + row.measureCount,
            column.fieldsCount + row.fieldsCount, {
                column: column.placement,
                row: row.placement
            }, this.getTimeseriesAttributes(rows),
            columns.allHasSummaries() && rows.allHasSummaries(), categorizers, defaultCategorizersOnly
        );
    };

    ChartTypeManager.prototype.getAllowedTypesList = function (columns, rows) {
        return _.difference(_.pluck(this.getAllTypes(), "name"), this.getDisabledTypesList(columns, rows));
    };

    ChartTypeManager.prototype.getDisabledChartTypes = function(measuresCount, fieldsCount, placement, timeseriesAttr, hasSummaries, categorizers, defaultCategorizersOnly) {
        var types = this.getAllTypes();
        var typesDisabled = [];

        _.each(types, function(typeModel) {
            var categorizerValidationResult = validateCategorizer(typeModel, categorizers, defaultCategorizersOnly);
            var summaryValidationResult = validateSummary(typeModel, hasSummaries);
            var measuresCountValidationResult = validateMeasuresCount(typeModel, measuresCount);
            var measuresPositionValidationResult = validateMeasuresPosition(typeModel, placement);
            var fieldsCountValidationResult = validateFieldsCount(typeModel, fieldsCount);
            var fieldsPositionValidationResult = validateFieldsPosition(typeModel, placement);
            var placementValidationResult = validatePlacement(typeModel, placement);

            var timeSeriesValidationResult = validateTimeSeries(typeModel, timeseriesAttr);

            if (summaryValidationResult
                || measuresCountValidationResult
                || measuresPositionValidationResult
                || fieldsCountValidationResult
                || fieldsPositionValidationResult
                || placementValidationResult
                || timeSeriesValidationResult
                || categorizerValidationResult
            ) {
                typesDisabled.push(typeModel.name);
            }

        });
        return typesDisabled;
    };

    chartTypeManager = new ChartTypeManager();


    return chartTypeManager;

    function toPlacement(axis) {
        var res, fieldsCount = 0,
            measuresCount = axis.reduce(function(memo, item){
                return item.isMeasure() ? memo + 1 : memo;
            }, 0),
        // multiAxisMap required in this case, because it is exact configuration,
        // which will be used for any chart and crosstab and sure will pass check for table
            arr = axis.multiAxisMap(function (el) {
                if (el.isMeasure()) {
                    return "m";
                } else {
                    fieldsCount++;
                    return "f";
                }
            });

        // multiAxisMap shows only location of measures, its required to put additional "m"s to cover measures size
        if (measuresCount > 1) {
            res = [];
            for (var i = 0; i < arr.length; i++){
                if (arr[i] === "m"){
                    for (var j = 0; j < measuresCount; j++){
                        res.push("m");
                    }
                } else {
                    res.push(arr[i]);
                }
            }
        } else {
            res = arr;
        }

        return {
            fieldsCount: fieldsCount,
            measureCount: measuresCount,
            placement: res.join("")
        }
    }

    function validateCategorizer(typeModel, categorizers, defaultCategorizersOnly){
        var res = typeModel.requirements.categorizerAllowed && _.difference(categorizers, typeModel.requirements.categorizerAllowed).length ||
            typeModel.requirements.categorizerForbidden && _.difference(categorizers, typeModel.requirements.categorizerForbidden).length < categorizers.length;

        return res || (typeModel.requirements.categorizerDefaultOnly && !defaultCategorizersOnly);
    }

    function validateSummary(typeModel, hasSummary){
        return !(hasSummary || typeModel.name === "Crosstab" || typeModel.name === "Table");
    }

    function validateMeasuresCount(typeModel, measuresCount) {

        var req = typeModel.requirements;

        if (req.measures) {
            if (!_.isUndefined(req.measures.min) && req.measures.min > measuresCount) {
                return true;
            }
            if (!_.isUndefined(req.measures.max) && req.measures.max < measuresCount) {
                return true;
            }
            return false;
        }

    }
    function validateFieldsCount(typeModel, fieldsCount) {

        var req = typeModel.requirements;

        if (req.fields) {
            if (!_.isUndefined(req.fields.min) && req.fields.min > fieldsCount) {
                return true;
            }
            if (!_.isUndefined(req.fields.max) && req.fields.max < fieldsCount) {
                return true;
            }
        }
        return false;

    }
    function validateMeasuresPosition(typeModel, placement) {

        var req = typeModel.requirements;

        if (req.measures) {
            if (req.measures.inRow === false && placement.row.indexOf("m") > -1 ) {
                return true;
            }
            if (req.measures.inColumn === false && placement.column.indexOf("m") > -1 ) {
                return true;
            }
        }
        return false;
    }
    function validateFieldsPosition(typeModel, placement) {

        var req = typeModel.requirements;

        if (req.fields) {
            if (req.fields.inRow === false && placement.row.indexOf("f") > -1 ) {
                return true;
            }
            if (req.fields.inColumn === false && placement.column.indexOf("f") > -1 ) {
                return true;
            }
        }
        return false;
    }
    function validatePlacement(typeModel, placement) {

        var req = typeModel.requirements;

        if (req.placement) {
            if (req.placement.allowed) {
                return !_.some(req.placement.allowed, function(allowedPattern) {
                    return (placement.column.match(new RegExp("^" + allowedPattern.column + "$")) !== null)
                        && (placement.row.match(new RegExp("^" + allowedPattern.row + "$")) !== null);
                });
            }
            if (req.placement.forbidden) {
                return _.some(req.placement.forbidden, function(forbiddenPattern) {
                    return (placement.column.match(new RegExp("^" + forbiddenPattern.column + "$")) !== null)
                        && (placement.row.match(new RegExp("^" + forbiddenPattern.row + "$")) !== null);
                });
            }
        }
        return false;
    }
    function validateTimeSeries(typeModel, timeseriesAttr) {
        var req = typeModel.requirements;

        if (typeModel.isTimeSeries && req.fields) {
            if (req.fields.type === "time" && !timeseriesAttr.isDateTime) {
                return true;
            }
            if (req.fields.categorizer && !_.contains(req.fields.categorizer, timeseriesAttr.categorizer) ) {
                return true;
            }
        }
        return false;
    }
});