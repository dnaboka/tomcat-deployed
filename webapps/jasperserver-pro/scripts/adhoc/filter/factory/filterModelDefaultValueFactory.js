/*
 * Copyright (C) 2005 - 2018 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */


/**
 * @version: ${Id}
 */

define(function (require) {
    "use strict";

    var dataTypes = require("adhoc/filter/enum/filterDataTypes"),
        operators = require("adhoc/filter/enum/filterOperators"),
        jrsConfigs = require("jrs.configs"),
        _ = require("underscore");

    var defaultValueMap = {};

    defaultValueMap[dataTypes.STRING] = {};
    defaultValueMap[dataTypes.STRING][operators.IN] = {value: [], isAnyValue: true};
    defaultValueMap[dataTypes.STRING][operators.NOT_IN] = {value: [], isAnyValue: false};
    defaultValueMap[dataTypes.STRING][operators.EQUALS] = function (additionalModelData) { return {value: additionalModelData.values[0], isAnyValue: false } };
    defaultValueMap[dataTypes.STRING][operators.NOT_EQUAL] = function (additionalModelData) { return {value: additionalModelData.values[0], isAnyValue: false } };
    defaultValueMap[dataTypes.STRING][operators.CONTAINS] = {value: "", isAnyValue: false};
    defaultValueMap[dataTypes.STRING][operators.NOT_CONTAINS] = {value: "", isAnyValue: false};
    defaultValueMap[dataTypes.STRING][operators.STARTS_WITH] = {value: "", isAnyValue: false};
    defaultValueMap[dataTypes.STRING][operators.NOT_STARTS_WITH] = {value: "", isAnyValue: false};
    defaultValueMap[dataTypes.STRING][operators.ENDS_WITH] = {value: "", isAnyValue: false};
    defaultValueMap[dataTypes.STRING][operators.NOT_ENDS_WITH] = {value: "", isAnyValue: false};

    var TimeAndNumericMap = {};
    TimeAndNumericMap[operators.IN] = {value: [], isAnyValue: true};
    TimeAndNumericMap[operators.NOT_IN] = {value: [], isAnyValue: false};
    TimeAndNumericMap[operators.EQUALS] =  {value: jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_VALUE, isAnyValue: false};
    TimeAndNumericMap[operators.NOT_EQUAL] =  {value: jrsConfigs.inputControlsConstants.NULL_SUBSTITUTION_VALUE, isAnyValue: false};
    TimeAndNumericMap[operators.GREATER] = function (additionalModelData) { return {value: additionalModelData.min, isAnyValue: false} };
    TimeAndNumericMap[operators.GREATER_OR_EQUAL] = function (additionalModelData) { return {value: additionalModelData.min, isAnyValue: false} };
    TimeAndNumericMap[operators.LESS] =  function (additionalModelData) { return {value: additionalModelData.max, isAnyValue: false} };
    TimeAndNumericMap[operators.LESS_OR_EQUAL] = function (additionalModelData) { return {value: additionalModelData.max, isAnyValue: false} };
    TimeAndNumericMap[operators.BETWEEN] = function (additionalModelData) { return {value: [additionalModelData.min,additionalModelData.max], isAnyValue: false} };
    TimeAndNumericMap[operators.NOT_BETWEEN] = function (additionalModelData) { return {value: [additionalModelData.min,additionalModelData.max], isAnyValue: false} };

    var DateMap = _.omit(TimeAndNumericMap, operators.BETWEEN, operators.NOT_BETWEEN);
    DateMap[operators.BETWEEN_DATES] = function (additionalModelData) { return {value: [additionalModelData.min,additionalModelData.max], isAnyValue: true} };
    DateMap[operators.NOT_BETWEEN_DATES] = function (additionalModelData) { return {value: [additionalModelData.min,additionalModelData.max], isAnyValue: false} };

    defaultValueMap[dataTypes.INTEGER] = _.clone(TimeAndNumericMap);
    defaultValueMap[dataTypes.NUMERIC] = _.clone(TimeAndNumericMap);
    defaultValueMap[dataTypes.LONG] = _.clone(TimeAndNumericMap);
    defaultValueMap[dataTypes.DECIMAL] = _.clone(TimeAndNumericMap);
    defaultValueMap[dataTypes.TIME] = _.clone(TimeAndNumericMap);
    defaultValueMap[dataTypes.TIMESTAMP] = _.clone(DateMap);
    defaultValueMap[dataTypes.DATE] = _.clone(DateMap);

    defaultValueMap[dataTypes.BOOLEAN] = {};
    defaultValueMap[dataTypes.BOOLEAN][operators.IN] = {value: [], isAnyValue: true};
    defaultValueMap[dataTypes.BOOLEAN][operators.NOT_IN] = {value: [], isAnyValue: false};
    defaultValueMap[dataTypes.BOOLEAN][operators.EQUALS] = {value: "false", isAnyValue: false};
    defaultValueMap[dataTypes.BOOLEAN][operators.NOT_EQUAL] = {value: "false", isAnyValue: false};

    var olapDefaultValueMap = {};
    olapDefaultValueMap[operators.IN] = function (additionalModelData) {
        return additionalModelData.allValuesLoaded ? {value: additionalModelData.values, isAnyValue: false} : {value: [], isAnyValue: false}
    };
    olapDefaultValueMap[operators.NOT_IN] = {value: [], isAnyValue: false};
    olapDefaultValueMap[operators.EQUALS] = function (additionalModelData) { return {value: additionalModelData.values[0], isAnyValue: false } };
    olapDefaultValueMap[operators.NOT_EQUAL] = function (additionalModelData) { return {value: additionalModelData.values[0], isAnyValue: false } };

    // additionalModelData is an object containing following properties: min, max, values
    return function(dataType, operator, isOlap, additionalModelData) {
        var defaultValue;

        if (isOlap) {
            if (!(operator in olapDefaultValueMap)) {
                throw new Error("Operator '" + operator + "' is not supported in OLAP mode");
            }

            defaultValue = olapDefaultValueMap[operator];
        } else {
            if (!(dataType in defaultValueMap)) {
                throw new Error("Filter data type '" + dataType + "' is not supported");
            }

            if (!(operator in defaultValueMap[dataType])) {
                throw new Error("Operator '" + operator + "' is not supported by filter data type '" + dataType + "'");
            }

            defaultValue = defaultValueMap[dataType][operator];
        }

        return _.isFunction(defaultValue) ? defaultValue(additionalModelData) : defaultValue;
    }
});